"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import DeleteModal from "@/components/deleteModal";
import SearchBar from "@/components/searchBar";
import Table from "@/components/table";

const ListTeacher = () => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [teacherIdToDelete, setTeacherIdToDelete] = useState(null);

    const [teachers, setTeachers] = useState([]);
    const [totalTeachers, setTotalTeachers] = useState(0);
    const [input, setInput] = useState("");
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 0
    });
    const [curr, setCurr] = useState({
        input: "",
        page: 1,
        order: "name",
        type: "ASC",
    });

    const columns = [
        {
            name: "Name",
            key: "name",
            isSort: true,
            isImage: true,
            imageKey: "image"
        },
        {
            name: "Subject",
            key: "subject_name",
            isSort: false
        },
        {
            name: "Contact",
            key: "contact",
            isSort: false
        },
        {
            name: "Created On",
            key: "created_on",
            isSort: false,
            isDate: true
        },
        {
            name: "Updated On",
            key: "updated_on",
            isSort: false,
            isDate: true
        },
        {
            name: "Action",
            isSort: false,
            isAction: true,
            updatePath: "update_teacher"
        }
    ];

    useEffect(()=>{
        document.title = "Teacher List";
    }, [])

    const [sortOrder, setSortOrder] = useState({
        name: "ASC",
    });

    const loadTeachers = async (input = "", page = 1, order = "name", type = "ASC") => {
        setCurr({ input, page, order, type });
        try {
            const response = await axios.post("/api/teacher/search_teacher", {
                input,
                page,
                order,
                type,
            });
            const data = response.data;
            setTeachers(data.teachers);
            setPagination({
                currentPage: page,
                totalPages: Math.ceil(data.totalRecords / 5)
            });
            setTotalTeachers(data.totalRecords);
        } catch (error) {
            console.error("Failed to load teachers", error);
        }
    };
    useEffect(() => {
        loadTeachers();
    }, []);

    const renderPagination = () => {
        if (pagination.totalPages <= 1) return null;

        let paginationLinks = [];

        if (pagination.currentPage > 1) {
            paginationLinks.push(
                <button
                    key="prev"
                    className="page-link"
                    onClick={() => handlePagination(pagination.currentPage - 1)}
                >
                    Prev
                </button>
            );
        }

        for (let i = 1; i <= pagination.totalPages; i++) {
            paginationLinks.push(
                <button
                    key={i}
                    className={`page-link ${i === pagination.currentPage ? 'active' : ''}`}
                    onClick={() => handlePagination(i)}
                >
                    {i}
                </button>
            );
        }

        if (pagination.currentPage < pagination.totalPages) {
            paginationLinks.push(
                <button
                    key="next"
                    className="page-link"
                    onClick={() => handlePagination(pagination.currentPage + 1)}
                >
                    Next
                </button>
            );
        }

        return (
            <div className="pagination">
                {paginationLinks}
            </div>
        );
    };


    const deleteTeacher = async (teacherId) => {
        try {
            await axios.get(`/api/teacher/delete_teacher/${teacherId}`);
            loadTeachers(curr.input, curr.page, curr.order, curr.type);
            toast.success("Teacher deleted successfully!");
            setShowDeleteModal(false);
        } catch (error) {
            toast.error("Unable to delete teacher.");
        }
    };

    const handleSort = (column) => {
        const newOrder = sortOrder[column] === "ASC" ? "DESC" : "ASC";
        setSortOrder((prev) => ({
            ...prev,
            [column]: newOrder,
        }));
        loadTeachers(curr.input, curr.page, column, newOrder);
    };

    const handleSearch = (e) => {
        const inputValue = e.target.value;
        setInput(inputValue);
        loadTeachers(inputValue, 1, curr.order, curr.type);
    };

    const handlePagination = (page) => {
        loadTeachers(input, page, curr.order, curr.type);
    };

    const openDeleteModal = (teacherId) => {
        setTeacherIdToDelete(teacherId);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setTeacherIdToDelete(null);
    };

    return (
        <div className="container-fluid">
            <div style={{ display: "flex" }}>
                <h1 className="h3 mb-2 text-gray-800 my-2">Teacher List</h1>
            </div>

            <div className="card shadow mb-4">

                <DeleteModal
                    pageName={'Teacher'}
                    showDeleteModal={showDeleteModal}
                    closeDeleteModal={closeDeleteModal}
                    deleteFunction={deleteTeacher}
                    id={teacherIdToDelete} />

                <div className="card-body">
                    <div className="table-responsive">
                        <SearchBar
                            pageName={'Teachers'}
                            total={totalTeachers}
                            value={input}
                            handleSearch={handleSearch} />

                        <Table
                            columns={columns}
                            data={teachers}
                            handleSort={handleSort}
                            sortOrder={sortOrder}
                            curr={curr}
                            idKey={"teacher_id"}
                            openDeleteModal={openDeleteModal}
                        />
                        {renderPagination()}
                    </div>
                </div>
            </div>
        </div >
    );
};

export default ListTeacher;
