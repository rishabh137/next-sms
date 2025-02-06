"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from 'react-hot-toast';
import { useRouter, useParams } from "next/navigation";
import BookFormContent from "@/components/bookFormContent";

const UpdateBook = () => {
    const router = useRouter();
    const { id } = useParams();
    const [formData, setFormData] = useState({
        name: "",
        subject: "",
        author: "",
        status: "",
        isbn: "",
        copies: "",
    });

    const [errors, setErrors] = useState({});
    const [subject, setSubject] = useState([]);

    useEffect(()=>{
        document.title = "Update Book";
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const subjectResponse = await axios.get('/api/get_subject');
                if (subjectResponse.status === 200) {
                    setSubject(subjectResponse.data.subject);
                }

                const bookResponse = await axios.get(`/api/book/get_book/${id}`);
                if (bookResponse.status === 200) {
                    const bookData = bookResponse.data.book;
                    setFormData({
                        name: bookData.name,
                        subject: bookData.subject_id,
                        author: bookData.author,
                        status: bookData.status,
                        isbn: bookData.isbn,
                        copies: bookData.available_copies,
                    });
                }
            } catch (error) {
                toast.error('Failed to fetch book data');
            }
        };

        fetchData();
    }, [id, router]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        validateField(name, value);
    };

    const validateField = (name, value) => {
        let message = "";
        switch (name) {
            case "name":
                if (!value) message = "Name is required.";
                break;
            case "subject":
                if (!value) message = "Subject is required.";
                break;
            case "author":
                if (!value) message = "Author is required.";
                break;
            case "isbn":
                if (!value) message = "ISBN number is required.";
                else if (!/^\d+$/.test(value)) message = "Invalid ISBN.";
                else if (value.length !== 13) message = "ISBN number must be of 13 digits.";
                break;
            case "copies":
                if (!value) message = "Number of copy is required.";
                else if (!/^\d+$/.test(value)) message = "Invalid Number of copy.";
                break;
            default:
                break;
        }
        setErrors((prevErrors) => ({ ...prevErrors, [name]: message }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formErrors = {};

        Object.keys(formData).forEach((key) => {
            let message = "";
            switch (key) {
                case "name":
                    if (!formData[key]) message = "Name is required.";
                    break;
                case "subject":
                    if (!formData[key]) message = "Subject is required.";
                    break;
                case "author":
                    if (!formData[key]) message = "Author is required.";
                    break;
                case "isbn":
                    if (!formData[key]) message = "ISBN number is required.";
                    else if (!/^\d+$/.test(formData[key])) message = "Invalid ISBN.";
                    else if (formData[key].length !== 13) message = "ISBN number must be of 13 digits.";
                    break;
                case "copies":
                    if (!formData[key]) message = "Number of copy is required.";
                    else if (!/^\d+$/.test(formData[key])) message = "Invalid Number of copy.";
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

            const response = await axios.put(`/api/book/update_book/${id}`, {
                name: formData.name,
                subject: formData.subject,
                author: formData.author,
                status: formData.status,
                isbn: formData.isbn,
                copies: formData.copies,
            });

            if (response.status === 200) {
                toast.success('Book updated successfully!');
                router.push('/sms/list_book');
            }
        } catch (error) {
            if (error.response?.data?.error) {
                toast.error(error.response.data.error);
            } else {
                toast.error('Failed to update book.');
            }
        }
    };

    return (
        <div id="page-top">
            <div id="content-wrapper" style={{ background: "#f8f9fc", marginBottom: "5.7rem" }} className="d-flex flex-column">

                <div id="content">
                    <div className="container-fluid">
                        <h1 className="h3 mb-4 mt-3 text-gray-800">Update Book</h1>

                        <form className="w-50" onSubmit={handleSubmit}>

                            <BookFormContent formData={formData} handleChange={handleChange} errors={errors} subject={subject} />

                            <button type="submit" id="teacher_submit" className="btn btn-primary">
                                Update
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateBook;