"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import BorrowBookFormContent from '@/components/borrowBookFormContent';

const BorrowBook = () => {
    const router = useRouter();
    const [borrowerType, setBorrowerType] = useState('student');
    const [formData, setFormData] = useState({
        name: '',
        subject: '',
        title: '',
        borrowDate: '',
        returnDate: ''
    });

    const [errors, setErrors] = useState({
        name: '',
        subject: '',
        title: '',
        borrowDate: '',
        returnDate: ''
    });

    const [borrowers, setBorrowers] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [books, setBooks] = useState([]);
    const currentDate = new Date().toISOString().split('T')[0];

    useEffect(() => {
        document.title = "Borrow Book";
    }, [])

    useEffect(() => {
        loadSubjects();
    }, []);

    useEffect(() => {
        if (borrowers.length > 0) {
            setFormData(prev => ({
                ...prev,
                name: borrowers[0].id
            }));
        }
    }, [borrowers]);

    useEffect(() => {
        fetchBorrowers();
    }, [borrowerType]);

    useEffect(() => {
        if (formData.subject) {
            fetchBooks();
        }
    }, [formData.subject]);

    useEffect(() => {
        if (books.length > 0) {
            setFormData(prev => ({
                ...prev,
                title: books[0].book_id
            }));
        }
    }, [books]);

    const loadSubjects = async () => {
        try {
            const response = await axios.get('/api/get_subject');
            setSubjects(response.data.subject);
            setFormData(prev => ({
                ...prev,
                subject: response.data.subject[0].subject_id
            }));
        } catch (error) {
            console.error('Failed to load subjects', error);
            toast.error('Failed to load subjects');
        }
    };

    const fetchBorrowers = async () => {
        try {
            const response = await axios.post('/api/book/fetch_borrowers', {
                type: borrowerType,
            });

            if (response.data.error) {
                setBorrowers([]);
            } else {
                setBorrowers(response.data.borrowers);
            }
        } catch (error) {
            toast.error('Failed to fetch borrowers');
        }
    };

    const fetchBooks = async () => {
        try {
            const response = await axios.post('/api/book/fetch_books', {
                subject: parseInt(formData.subject)
            });

            if (response.data.error) {
                setBooks([]);
            } else {
                setBooks(response.data.books);
            }
        } catch (error) {
            setBooks([]);
        }
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
            await axios.post('/api/book/borrow_book', {
                name: parseInt(formData.name),
                subject: parseInt(formData.subject),
                title: parseInt(formData.title),
                borrowDate: formData.borrowDate,
                returnDate: formData.returnDate,
                borrowerType
            });
            toast.success('Book borrowed successfully!');
            router.push('/sms/borrow_log');
            setFormData({
                name: '',
                subject: '',
                title: '',
                borrowDate: '',
                returnDate: ''
            });
        } catch (error) {
            if (error.response && error.response.data.error) {
                toast.error(error.response.data.error);
            } else {
                toast.error('Failed to add student.');
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setErrors(prev => ({
            ...prev,
            [name]: ''
        }));
        validateField(name, value);
    };

    return (
        <div className="container-fluid">
            <div style={{ display: "flex" }}>
                <h1 className="h3 mb-4 mt-3 text-gray-800">Borrow Book</h1>
            </div>

            <form className="w-50" onSubmit={handleSubmit}>
                <div className="role">
                    <input
                        type="radio"
                        name="borrowerType"
                        value="student"
                        checked={borrowerType === 'student'}
                        onChange={(e) => setBorrowerType(e.target.value)}
                    /> Student
                    <input
                        type="radio"
                        name="borrowerType"
                        value="teacher"
                        style={{ marginLeft: "10px" }}
                        checked={borrowerType === 'teacher'}
                        onChange={(e) => setBorrowerType(e.target.value)}
                    /> Teacher
                    <label htmlFor="borrower">Borrower Type</label>
                </div>

                <div className="form-group floating-label">
                    <select
                        id="name"
                        name="name"
                        className="form-control"
                        value={formData.name}
                        onChange={handleChange}
                    >
                        {borrowers.map(borrower => (
                            <option key={borrower.id} value={borrower.id}>
                                {borrower.name}
                            </option>
                        ))}
                    </select>
                    <label htmlFor="name" className="float-label">Name</label>
                    {errors.name && <span className="danger text-xs">{errors.name}</span>}
                </div>

                <BorrowBookFormContent
                    formData={formData}
                    handleChange={handleChange}
                    errors={errors}
                    subjects={subjects}
                    books={books}
                />

                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    );
};

export default BorrowBook;