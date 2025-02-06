"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import toast from 'react-hot-toast';
import { useRouter } from "next/navigation";
import StudentFormContent from "@/components/studentFormContent";

const AddStudent = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        roll: "",
        course: "",
        semester: "",
        contact: "",
        status: "",
        image: null,
    });

    const [errors, setErrors] = useState({});
    const [previewImage, setPreviewImage] = useState(null);
    const [courses, setCourses] = useState([]);
    const fileInputRef = useRef(null);

    useEffect(() => {
        document.title = "Add New Student";
    }, []);

    useEffect(() => {
        const getCourse = async () => {
            try {
                const response = await axios.get('/api/get_courses');
                if (response.status === 200) {
                    const fetchedCourses = response.data.courses;
                    setCourses(fetchedCourses);
                }
            } catch (error) {
                setCourses([]);
            }
        };

        getCourse();
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
            case "roll":
                if (!value) message = "Roll number is required.";
                else if (!/^\d+$/.test(value)) message = "Invalid Roll number.";
                break;
            case "course":
                if (!value) message = "Course is required.";
                break;
            case "status":
                if (!value) message = "Status is required.";
                break;
            case "semester":
                if (!value) message = "Semester is required.";
                else if (!/^\d+$/.test(value)) message = "Invalid Semester.";
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
                case "roll":
                    if (!formData[key]) message = "Roll number is required.";
                    else if (!/^\d+$/.test(formData[key])) message = "Invalid Roll number.";
                    break;
                case "course":
                    if (!formData[key]) message = "Course is required.";
                    break;
                case "semester":
                    if (!formData[key]) message = "Semester is required.";
                    else if (!/^\d+$/.test(formData[key])) message = "Invalid Semester.";
                    break;
                case "contact":
                    if (!formData[key]) message = "Contact is required.";
                    else if (!/^\d+$/.test(formData[key])) message = "Contact must contain only digits.";
                    else if (!/^\d{10}$/.test(formData[key])) message = "Contact must be a 10-digit number.";
                    break;
                case "status":
                    if (!formData[key]) message = "Status is required.";
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
        formDataToSend.append('roll', formData.roll);
        formDataToSend.append('course', formData.course);
        formDataToSend.append('semester', formData.semester);
        formDataToSend.append('contact', formData.contact);
        formDataToSend.append('status', formData.status);

        if (formData.image instanceof File) {
            formDataToSend.append('image', formData.image);
        } else {
            formDataToSend.append('image', null);
        }

        try {
            const response = await axios.post("/api/student/add_student", formDataToSend, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.status === 200) {
                setFormData({
                    name: "",
                    roll: "",
                    course: "",
                    semester: "",
                    contact: "",
                    status: "Inactive",
                    image: null,
                });
                setPreviewImage(null);

                toast.success('Student added successfully!');
                router.push('/sms/list_student');
            } else {
                toast.error('Failed to add student.');
            }
        } catch (error) {
            if (error.response && error.response.data.error) {
                toast.error(error.response.data.error);
            } else {
                toast.error('Failed to add student.');
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
                        <h1 className="h3 mb-4 mt-3 text-gray-800">Add New Student</h1>

                        <form className="w-50" onSubmit={handleSubmit}>
                            <StudentFormContent formData={formData} handleChange={handleChange} errors={errors} courses={courses} />

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
                                            alt="Student"
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

                            <button type="submit" id="student_submit" className="btn btn-primary">
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddStudent;