"use client"

import { useState, useEffect } from "react";
import axios from "axios";
import toast from 'react-hot-toast';
import { useRouter, useParams } from "next/navigation";
import BorrowBookFormContent from "@/components/borrowBookFormContent";

const UpdateBorrowLog = () => {
    const router = useRouter();
    const { id } = useParams();
    const [formData, setFormData] = useState({
        name: "",
        subject: "",
        title: "",
        borrowDate: "",
        returnDate: "",
    });

    const [errors, setErrors] = useState({});
    const [subjects, setSubjects] = useState([]);
    const [books, setBooks] = useState([]);
    const currentDate = new Date().toISOString().split('T')[0];

    useEffect(() => {
        document.title = "Update Borrow Log";
    }, [])

    useEffect(() => {
        loadSubjects();
        fetchBorrowDetails();
    }, []);

    useEffect(() => {
        if (formData.subject) {
            fetchBooks();
        }
    }, [formData.subject]);

    const loadSubjects = async () => {
        try {
            const response = await axios.get('/api/get_subject');
            setSubjects(response.data.subject);
        } catch (error) {
            toast.error('Failed to load subjects');
        }
    };

    const fetchBooks = async () => {
        try {
            const response = await axios.post('/api/book/fetch_updated_books', {
                subject: parseInt(formData.subject),
                borrowId: id
            });
            if (!response.data.error && response.data.books.length > 0) {
                setBooks(response.data.books);
                setFormData(prev => ({
                    ...prev,
                    title: String(response.data.bookId[0].book_id)
                }));
            }
        } catch (error) {
            setBooks([]);
        }
    };

    const fetchBorrowDetails = async () => {
        try {
            const response = await axios.get(`/api/book/get_borrower/${id}`);
            const borrowData = response.data.book;

            setFormData({
                name: borrowData.name,
                subject: borrowData.subject_id,
                title: borrowData.book_id,
                borrowDate: toLocalDate(borrowData.borrow_date),
                returnDate: toLocalDate(borrowData.return_date),
            });


        } catch (error) {
            toast.error('Failed to fetch borrow details');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        validateField(name, value);
    };

    const validateField = (name, value) => {
        let message = '';
        switch (name) {
            case 'borrowDate':
                if (!value) message = 'Borrow date is required.';
                else if (value > currentDate) message = 'Invalid borrow date.';
                else if (formData.returnDate && formData.returnDate >= value) {
                    setErrors(prev => ({ ...prev, returnDate: '' }));
                } else if (formData.returnDate && formData.returnDate < value) {
                    setErrors(prev => ({ ...prev, returnDate: 'Return date cannot be less than borrow date.' }));
                }
                break;
            case 'returnDate':
                if (!value) message = 'Return date is required.';
                else if (formData.borrowDate && value < formData.borrowDate)
                    message = 'Return date cannot be less than borrow date.';
                break;
            case 'subject':
                if (!value) message = 'Subject is required.';
                break;
            case 'title':
                if (!value) message = 'Book title is required.';
                break;
            default:
                break;
        }
        setErrors(prev => ({ ...prev, [name]: message }));
        return message;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formErrors = {};

        Object.keys(formData).forEach((key) => {
            let message = "";
            switch (key) {
                case 'borrowDate':
                    if (!formData[key]) message = 'Borrow date is required.';
                    else if (formData[key] > currentDate) message = 'Invalid borrow date.';
                    break;
                case 'returnDate':
                    if (!formData[key]) message = 'Return date is required.';
                    else if (formData.borrowDate && formData[key] < formData.borrowDate)
                        message = 'Return date cannot be less than borrow date.';
                    break;
                case 'subject':
                    if (!formData[key]) message = 'Subject is required.';
                    break;
                case 'title':
                    if (!formData[key]) message = 'Book title is required.';
                    break;
                default:
                    break;
            }
            setErrors((prevErrors) => ({ ...prevErrors, [key]: message }));
            if (message) {
                formErrors[key] = message;
            }
        });

        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        try {
            const dataToSend = {
                name: formData.name,
                subject: formData.subject,
                title: formData.title,
                borrowDate: formData.borrowDate,
                returnDate: formData.returnDate,
            };

            await axios.put(`/api/book/update_borrow/${id}`, dataToSend);

            toast.success('Borrow log updated successfully!');
            router.push('/sms/borrow_log');
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to update borrow log';
            toast.error(errorMessage);
        }
    };

    const toLocalDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
        return date.toISOString().split("T")[0];
    };

    return (
        <div className="container-fluid">
            <h1 className="h3 mb-4 mt-3 text-gray-800">Update Borrow Log</h1>

            <form className="w-50" onSubmit={handleSubmit}>

                <div className="form-group mb-3">
                    <input
                        type="text"
                        className="form-control"
                        value={formData.name}
                        readOnly
                    />
                    <label>Borrower Name</label>
                </div>

                <BorrowBookFormContent
                    formData={formData}
                    handleChange={handleChange}
                    errors={errors}
                    subjects={subjects}
                    books={books}
                />

                <button type="submit" className="btn btn-primary">
                    Update Borrow Log
                </button>
            </form>
        </div>
    );
};

export default UpdateBorrowLog;