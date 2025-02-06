"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import DeleteModal from "@/components/deleteModal";
import StatusModal from "@/components/statusModal";
import Table from "@/components/table";
import SearchBar from "@/components/searchBar";

const ListStudent = () => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [studentIdToDelete, setStudentIdToDelete] = useState(null);

    const [showStatusModal, setShowStatusModal] = useState(false);
    const [studentIdToStatus, setStudentIdToStatus] = useState(null);

    const [students, setStudents] = useState([]);
    const [totalStudents, setTotalStudents] = useState(0);
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

    const [sortOrder, setSortOrder] = useState({
        name: "ASC",
        roll: "ASC",
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
            name: "Roll Number",
            key: "roll",
            isSort: true
        },
        {
            name: "Course",
            key: "course_name",
            isSort: false
        },
        {
            name: "Contact",
            key: "contact",
            isSort: false
        },
        {
            name: "Status",
            key: "status",
            isSort: false,
            isStatus: true,
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
            updatePath: "update_student"
        }
    ];

    useEffect(()=>{
        document.title = "Student List";
    }, [])

    const loadStudents = async (input = "", page = 1, order = "name", type = "ASC") => {
        setCurr({ input, page, order, type });
        try {
            const response = await axios.post("/api/student/search_student", {
                input,
                page,
                order,
                type,
            });
            const data = response.data;
            setStudents(data.students);

            setPagination({
                currentPage: page,
                totalPages: Math.ceil(data.totalRecords / 5)
            });
            setTotalStudents(data.totalRecords);
        } catch (error) {
            console.error("Failed to load students", error);
        }
    };
    useEffect(() => {
        loadStudents();
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


    const deleteStudent = async (studentId) => {
        try {
            await axios.get(`/api/student/delete_student/${studentId}`);
            loadStudents(curr.input, curr.page, curr.order, curr.type);
            toast.success("Student deleted successfully!");
            setShowDeleteModal(false);
        } catch (error) {
            console.log(error);

            toast.error("Unable to delete student.");
        }
    };

    const handleSort = (column) => {
        const newOrder = sortOrder[column] === "ASC" ? "DESC" : "ASC";

        const updatedSortOrder = column === "name"
            ? {
                name: newOrder,
                roll: "ASC"
            }
            : {
                name: "ASC",
                roll: newOrder
            };

        setSortOrder(updatedSortOrder);
        loadStudents(curr.input, curr.page, column, newOrder);
    };

    const handleSearch = (e) => {
        const inputValue = e.target.value;
        setInput(inputValue);
        loadStudents(inputValue, 1, curr.order, curr.type);
    };

    const handlePagination = (page) => {
        loadStudents(input, page, curr.order, curr.type);
    };

    const changeStatus = async (studentId) => {
        try {
            await axios.put(`/api/student/change_status/${studentId}`);
            loadStudents(curr.input, curr.page, curr.order, curr.type);
            toast.success("Status updated successfully");
            setShowStatusModal(false);
        } catch (error) {
            console.error("Failed to change status", error);
            toast.error("Unable to update status.");
        }
    };

    const openDeleteModal = (studentId) => {
        setStudentIdToDelete(studentId);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setStudentIdToDelete(null);
    };

    const openStatusModal = (studentId) => {
        setStudentIdToStatus(studentId);
        setShowStatusModal(true);
    };

    const closeStatusModal = () => {
        setShowStatusModal(false);
        setStudentIdToStatus(null);
    };

    return (
        <div className="container-fluid">
            <div style={{ display: "flex" }}>
                <h1 className="h3 mb-2 text-gray-800 my-2">Student List</h1>

            </div>

            <div className="card shadow mb-4">

                <DeleteModal
                    pageName={'Student'}
                    showDeleteModal={showDeleteModal}
                    closeDeleteModal={closeDeleteModal}
                    deleteFunction={deleteStudent}
                    id={studentIdToDelete} />

                <StatusModal
                    showStatusModal={showStatusModal}
                    closeStatusModal={closeStatusModal}
                    statusFunction={changeStatus}
                    id={studentIdToStatus} />

                <div className="card-body">
                    <div className="table-responsive">
                        <SearchBar
                            pageName={'Students'}
                            total={totalStudents}
                            value={input}
                            handleSearch={handleSearch} />

                        <Table
                            columns={columns}
                            data={students}
                            handleSort={handleSort}
                            sortOrder={sortOrder}
                            curr={curr}
                            idKey={"student_id"}
                            openDeleteModal={openDeleteModal}
                            openStatusModal={openStatusModal}
                        />
                        {renderPagination()}
                    </div>
                </div>
            </div>
        </div >
    );
};

export default ListStudent;
