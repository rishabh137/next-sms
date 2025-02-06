"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import toast from 'react-hot-toast';
import { useRouter } from "next/navigation";
import TeacherFormContent from "@/components/teacherFormContent";

const AddTeacher = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        subject: "",
        contact: "",
        image: null,
    });

    const [errors, setErrors] = useState({});
    const [previewImage, setPreviewImage] = useState(null);
    const [subject, setSubject] = useState([]);
    const fileInputRef = useRef(null);

    useEffect(() => {
        document.title = "Add New Teacher";
    }, []);

    useEffect(() => {
        const getSubject = async () => {
            try {
                const response = await axios.get('/api/get_subject');
                if (response.status === 200) {
                    const fetchedSubject = response.data.subject;
                    setSubject(fetchedSubject);
                }
            } catch (error) {
                setSubject([]);
            }
        };

        getSubject();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        validateField(name, value);
    };

    const isImageFile = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const arr = new Uint8Array(e.target.result).subarray(0, 4);
                let header = "";
                for (let i = 0; i < arr.length; i++) {
                    header += arr[i].toString(16);
                }

                const isImage = header.startsWith('89504e47') ||
                    header.startsWith('ffd8') ||
                    header.startsWith('424d');

                resolve(isImage);
            };
            reader.readAsArrayBuffer(file);
        });
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const isValid = await isImageFile(file);
            if (!isValid) {
                setErrors({ ...errors, image: "Invalid image file" });
                setPreviewImage(null);
                setFormData({ ...formData, image: null });
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
                return;
            }

            const reader = new FileReader();
            reader.onload = () => {
                const img = new Image();
                img.onload = () => {
                    setPreviewImage(reader.result);
                    setFormData({ ...formData, image: file });
                    setErrors({ ...errors, image: "" });
                };
                img.onerror = () => {
                    setErrors({ ...errors, image: "Invalid image file" });
                    setPreviewImage(null);
                    setFormData({ ...formData, image: null });
                    if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                    }
                };
                img.src = reader.result;
            };
            reader.readAsDataURL(file);
        }
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
            case "contact":
                if (!value) message = "Contact is required.";
                else if (!/^\d+$/.test(value)) message = "Contact must contain only digits.";
                else if (!/^\d{10}$/.test(value)) message = "Contact must be a 10-digit number.";
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
                case "contact":
                    if (!formData[key]) message = "Contact is required.";
                    else if (!/^\d+$/.test(formData[key])) message = "Contact must contain only digits.";
                    else if (!/^\d{10}$/.test(formData[key])) message = "Contact must be a 10-digit number.";
                    break;
                default:
                    break;
            }
            if (message) {
                formErrors[key] = message;
            }
        });

        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('subject', formData.subject);
        formDataToSend.append('contact', formData.contact);

        if (formData.image instanceof File) {
            formDataToSend.append('image', formData.image);
        } else {
            formDataToSend.append('image', null);
        }

        try {
            const response = await axios.post("/api/teacher/add_teacher", formDataToSend, {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
            });

            if (response.status === 200) {
                setFormData({
                    name: "",
                    subject: "",
                    contact: "",
                    image: null,
                });
                setPreviewImage(null);

                toast.success('Teacher added successfully!');
                router.push('/sms/list_teacher');
            } else {
                toast.error('Failed to add teacher.');
            }
        } catch (error) {
            if (error.response && error.response.data.error) {
                toast.error(error.response.data.error);
            } else {
                toast.error('Failed to add teacher.');
            }
        }
    };

    const hideImage = () => {
        setPreviewImage(null);
        setFormData((prev) => ({ ...prev, image: null }));
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div id="page-top">
            <div id="content-wrapper" style={{ background: "#f8f9fc", marginBottom: "5.7rem" }} className="d-flex flex-column">
                <div id="content">
                    <div className="container-fluid">
                        <h1 className="h3 mb-4 mt-3 text-gray-800">Add New Teacher</h1>

                        <form className="w-50" onSubmit={handleSubmit}>
                            <TeacherFormContent formData={formData} handleChange={handleChange} errors={errors} subject={subject} />

                            <div className="mb-3 imageContainer">
                                {previewImage && (
                                    <>
                                        <button id='image_icon' type='button' onClick={hideImage} className="imgButton">
                                            <i className='fa-solid fa-trash'></i>
                                        </button>
                                        <img
                                            className="img-profile rounded-circle"
                                            style={{ width: "80px", height: "80px" }}
                                            src={previewImage}
                                            alt="Teacher"
                                        />
                                    </>
                                )}
                            </div>

                            <div className="form-group">
                                <input
                                    type="file"
                                    id="image"
                                    name="image"
                                    className="form-control"
                                    accept="image/*"
                                    style={{ height: "auto", fontSize: "15px" }}
                                    onChange={handleFileChange}
                                    ref={fileInputRef}
                                />
                                <label htmlFor="image">Image</label>
                                {errors.image && <div className="text-danger text-xs">{errors.image}</div>}
                            </div>

                            <button type="submit" id="teacher_submit" className="btn btn-primary">
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddTeacher;
