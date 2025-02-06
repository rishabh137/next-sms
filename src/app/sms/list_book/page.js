"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import DeleteModal from "@/components/deleteModal";
import StatusModal from "@/components/statusModal";
import SearchBar from "@/components/searchBar";
import Table from "@/components/table";

const ListBook = () => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [bookIdToDelete, setBookIdToDelete] = useState(null);

    const [showStatusModal, setShowStatusModal] = useState(false);
    const [bookIdToStatus, setBookIdToStatus] = useState(null);

    const [books, setBooks] = useState([]);
    const [totalBooks, setTotalBooks] = useState(0);
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
        author: "ASC",
    });

    const columns = [
        {
            name: "Book Name",
            key: "name",
            isSort: true
        },
        {
            name: "Subject",
            key: "subject_name",
            isSort: false
        },
        {
            name: "Author",
            key: "author",
            isSort: true
        },
        {
            name: "Status",
            key: "status",
            isSort: false,
            isStatus: true,
        },
        {
            name: "ISBN",
            key: "isbn",
            isSort: false
        },
        {
            name: "Number of Copies",
            key: "available_copies",
            isSort: false
        },
        {
            name: "Added On",
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
            updatePath: "update_book"
        }
    ];

    useEffect(()=>{
        document.title = "Book List";
    }, [])

    const loadBooks = async (input = "", page = 1, order = "name", type = "ASC") => {
        setCurr({ input, page, order, type });
        try {
            const response = await axios.post("/api/book/search_book", {
                input,
                page,
                order,
                type,
            });
            const data = response.data;
            setBooks(data.books);
            setPagination({
                currentPage: page,
                totalPages: Math.ceil(data.totalRecords / 5)
            });
            setTotalBooks(data.totalRecords);
        } catch (error) {
            console.error("Failed to load books", error);
        }
    };
    useEffect(() => {
        loadBooks();
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


    const deleteBook = async (bookId) => {
        try {
            await axios.get(`/api/book/delete_book/${bookId}`);
            loadBooks(curr.input, curr.page, curr.order, curr.type);
            toast.success("Book deleted successfully!");
            setShowDeleteModal(false);
        } catch (error) {
            toast.error("Unable to delete book.");
        }
    };

    const handleSort = (column) => {
        const newOrder = sortOrder[column] === "ASC" ? "DESC" : "ASC";

        const updatedSortOrder = column === "name"
            ? {
                name: newOrder,
                author: "ASC"
            }
            : {
                name: "ASC",
                author: newOrder
            };

        setSortOrder(updatedSortOrder);
        loadBooks(curr.input, curr.page, column, newOrder);
    };

    const handleSearch = (e) => {
        const inputValue = e.target.value;
        setInput(inputValue);
        loadBooks(inputValue, 1, curr.order, curr.type);
    };

    const handlePagination = (page) => {
        loadBooks(input, page, curr.order, curr.type);
    };

    const changeStatus = async (bookId) => {
        try {
            await axios.put(`/api/book/change_status/${bookId}`);
            loadBooks(curr.input, curr.page, curr.order, curr.type);
            toast.success("Status updated successfully");
            setShowStatusModal(false);
        } catch (error) {
            toast.error("Unable to update status.");
        }
    };

    const openDeleteModal = (bookId) => {
        setBookIdToDelete(bookId);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setBookIdToDelete(null);
    };

    const openStatusModal = (bookId) => {
        setBookIdToStatus(bookId);
        setShowStatusModal(true);
    };

    const closeStatusModal = () => {
        setShowStatusModal(false);
        setBookIdToStatus(null);
    };

    return (
        <div className="container-fluid">
            <div style={{ display: "flex" }}>
                <h1 className="h3 mb-2 text-gray-800 my-2">Book List</h1>

            </div>

            <div className="card shadow mb-4">

                <DeleteModal
                    pageName={'Book'}
                    showDeleteModal={showDeleteModal}
                    closeDeleteModal={closeDeleteModal}
                    deleteFunction={deleteBook}
                    id={bookIdToDelete} />
                <StatusModal
                    showStatusModal={showStatusModal}
                    closeStatusModal={closeStatusModal}
                    statusFunction={changeStatus}
                    id={bookIdToStatus} />

                <div className="card-body">
                    <div className="table-responsive">
                        <SearchBar
                            pageName={'Books'}
                            total={totalBooks}
                            value={input}
                            handleSearch={handleSearch} />

                        <Table
                            columns={columns}
                            data={books}
                            handleSort={handleSort}
                            sortOrder={sortOrder}
                            curr={curr}
                            idKey={"book_id"}
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

export default ListBook;
