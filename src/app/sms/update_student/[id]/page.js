"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import toast from 'react-hot-toast';
import { useRouter, useParams } from "next/navigation";
import StudentFormContent from "@/components/studentFormContent";

const UpdateStudent = () => {
    const router = useRouter();
    const { id } = useParams();

    const [formData, setFormData] = useState({
        name: "",
        roll: "",
        course: "",
        semester: "",
        contact: "",
        status: "Inactive",
        image: null,
    });

    const [errors, setErrors] = useState({});
    const [imagePreview, setImagePreview] = useState("");
    const [dbImage, setDbImage] = useState(null);
    const [showImageField, setShowImageField] = useState(false);
    const [courses, setCourses] = useState([]);
    const fileInputRef = useRef(null);
    const [deleteImage, setDeleteImage] = useState(false);

    useEffect(() => {
        document.title = "Update Student";
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const coursesResponse = await axios.get('/api/get_courses');
                if (coursesResponse.status === 200) {
                    setCourses(coursesResponse.data.courses);
                }

                const studentResponse = await axios.get(`/api/student/get_student/${id}`);
                if (studentResponse.status === 200) {
                    const studentData = studentResponse.data.student;
                    setFormData({
                        name: studentData.name,
                        roll: studentData.roll,
                        course: studentData.course_id,
                        semester: studentData.semester,
                        contact: studentData.contact,
                        status: studentData.status || "Inactive",
                        image: null,
                    });

                    if (studentData.image) {
                        setDbImage(studentData.image);
                        setImagePreview(studentData.image);
                        setShowImageField(true);
                    }
                }
            } catch (error) {
                toast.error('Failed to fetch student data');
            }
        };

        fetchData();
    }, [id, router]);

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
                // Revert to database image if available
                if (dbImage) {
                    setImagePreview(dbImage);
                    setFormData({ ...formData, image: null });
                } else {
                    setImagePreview(null);
                    setFormData({ ...formData, image: null });
                }
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
                return;
            }

            const reader = new FileReader();
            reader.onload = () => {
                const img = new Image();
                img.onload = () => {
                    setImagePreview(reader.result);
                    setFormData({ ...formData, image: file });
                    setErrors({ ...errors, image: "" });
                    setDeleteImage(false);
                };
                img.onerror = () => {
                    setErrors({ ...errors, image: "Invalid image file" });
                    // Revert to database image if available
                    if (dbImage) {
                        setImagePreview(dbImage);
                        setFormData({ ...formData, image: null });
                    } else {
                        setImagePreview(null);
                        setFormData({ ...formData, image: null });
                    }
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
            case "semester":
                if (!value) message = "Semester is required.";
                else if (!/^\d+$/.test(value)) message = "Invalid Semester.";
                break;
            case "contact":
                if (!value) message = "Contact is required.";
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
            if (key !== 'image') {  // Skip image validation here
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
                    default:
                        break;
                }
                if (message) {
                    formErrors[key] = message;
                }
            }
        });

        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        try {
            const formDataToSend = new FormData();
            Object.keys(formData).forEach(key => {
                if (key === 'image' && formData[key]) {
                    formDataToSend.append('image', formData[key]);
                } else if (key !== 'image') {
                    formDataToSend.append(key, formData[key]);
                }
            });

            formDataToSend.append('deleteImage', deleteImage);

            const response = await axios.put(`/api/student/update_student/${id}`, formDataToSend, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.status === 200) {
                toast.success('Student updated successfully!');
                router.push('/sms/list_student');
            }
        } catch (error) {
            if (error.response?.data?.error) {
                toast.error(error.response.data.error);
            } else {
                toast.error('Failed to update student.');
            }
        }
    };

    const hideImage = () => {
        setImagePreview(null);
        setFormData((prev) => ({ ...prev, image: null }));
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        setDeleteImage(true);
    };

    return (
        <div id="page-top">
            <div id="content-wrapper" style={{ background: "#f8f9fc", marginBottom: "5.7rem" }} className="d-flex flex-column">
                <div id="content">
                    <div className="container-fluid">
                        <h1 className="h3 mb-4 mt-3 text-gray-800">Update Student</h1>

                        <form className="w-50" onSubmit={handleSubmit}>
                            <StudentFormContent formData={formData} handleChange={handleChange} errors={errors} courses={courses} />

                            <div className="mb-3 imageContainer">
                                {imagePreview && (
                                    <>
                                        <button id='image_icon' type='button' onClick={hideImage} className="imgButton">
                                            <i className='fa-solid fa-trash'></i>
                                        </button>
                                        <img
                                            className="img-profile rounded-circle"
                                            style={{ width: "80px", height: "80px", objectFit: "cover" }}
                                            src={formData.image ? imagePreview : `/uploads/${imagePreview}`}
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
                                {errors.image && <span className="danger text-xs">{errors.image}</span>}
                            </div>

                            <button type="submit" id="student_submit" className="btn btn-primary">
                                Update
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateStudent;