"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import DeleteModal from "@/components/deleteModal";
import SearchBar from "@/components/searchBar";
import Table from "@/components/table";

const BorrowLog = () => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [borrowIdToDelete, setBorrowIdToDelete] = useState(null);

    const [borrowers, setBorrowers] = useState([]);
    const [totalBorrowers, setTotalBorrowers] = useState(0);
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
            name: "Role",
            key: "borrower_type",
            isSort: false
        },
        {
            name: "Subject",
            key: "subject_name",
            isSort: false
        },
        {
            name: "Book Name",
            key: "book_name",
            isSort: false
        },
        {
            name: "Borrow Date",
            key: "borrow_date",
            isBook: true,
            isSort: false
        },
        {
            name: "Return Date",
            key: "return_date",
            isBook: true,
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
            updatePath: "update_borrow_log"
        }
    ];

    useEffect(()=>{
        document.title = "Borrow Log";
    }, [])

    const loadBorrower = async (input = "", page = 1, order = "name", type = "ASC") => {
        setCurr({ input, page, order, type });
        try {
            const response = await axios.post("/api/book/search_borrower", {
                input,
                page,
                order,
                type,
            });
            const data = response.data;
            setBorrowers(data.borrowers);
            setPagination({
                currentPage: page,
                totalPages: Math.ceil(data.totalRecords / 5)
            });
            setTotalBorrowers(data.totalRecords);
        } catch (error) {
            console.error("Failed to load borrowers", error);
        }
    };
    useEffect(() => {
        loadBorrower();
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


    const deleteBorrower = async (bookId) => {
        try {
            await axios.get(`/api/book/delete_borrower/${bookId}`);
            loadBorrower(curr.input, curr.page, curr.order, curr.type);
            toast.success("Book returned successfully!");
            setShowDeleteModal(false);
        } catch (error) {
            toast.error("Unable to return book.");
        }
    };

    const handleSort = (column) => {
        const newOrder = sortOrder[column] === "ASC" ? "DESC" : "ASC";
        setSortOrder((prev) => ({
            ...prev,
            [column]: newOrder,
        }));
        loadBorrower(curr.input, curr.page, column, newOrder);
    };


    const handleSearch = (e) => {
        const inputValue = e.target.value;
        setInput(inputValue);
        loadBorrower(inputValue, 1, curr.order, curr.type);
    };

    const handlePagination = (page) => {
        loadBorrower(input, page, curr.order, curr.type);
    };

    const openDeleteModal = (bookId) => {
        setBorrowIdToDelete(bookId);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setBorrowIdToDelete(null);
    };

    return (
        <div className="container-fluid">
            <div style={{ display: "flex" }}>
                <h1 className="h3 mb-2 text-gray-800 my-2">Borrow Log</h1>

            </div>

            <div className="card shadow mb-4">

                <DeleteModal
                    pageName={'book'}
                    showDeleteModal={showDeleteModal}
                    closeDeleteModal={closeDeleteModal}
                    deleteFunction={deleteBorrower}
                    id={borrowIdToDelete}
                    returnVal={'Return'}
                />

                <div className="card-body">
                    <div className="table-responsive">
                        <SearchBar
                            pageName={'Borrowed Books'}
                            total={totalBorrowers}
                            value={input}
                            handleSearch={handleSearch} />

                        <Table
                            columns={columns}
                            data={borrowers}
                            handleSort={handleSort}
                            sortOrder={sortOrder}
                            curr={curr}
                            idKey={"borrow_id"}
                            openDeleteModal={openDeleteModal}
                        />
                        {renderPagination()}
                    </div>
                </div>
            </div>
        </div >
    );
};

export default BorrowLog;
