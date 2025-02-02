"use client";

import { useState, useEffect } from "react";
import toast from 'react-hot-toast';
import { useRouter } from "next/navigation";
import axios from "axios";
import StudentFormContent from "@/components/StudentFormContent";

const AddStudent = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        roll: "",
        course: "",
        semester: "",
        contact: "",
        status: "Inactive",
        image: "",
    });

    const [errors, setErrors] = useState({});
    const [previewImage, setPreviewImage] = useState(null);
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const getCourse = async () => {
            try {
                const response = await axios.get('/api/get_courses');
                if (response.status === 200) {
                    const fetchedCourses = response.data.courses;
                    setCourses(fetchedCourses);

                    if (fetchedCourses.length > 0) {
                        setFormData((prev) => ({ ...prev, course: fetchedCourses[0].course_id }));
                    }
                }
            } catch (error) {
                setCourses([]);
            }
        }

        getCourse();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        validateField(name, value);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setPreviewImage(reader.result);
            reader.readAsDataURL(file);
            setFormData({ ...formData, image: file });
        }
    };

    let message = "";
    const validateField = (name, value) => {
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
            case "image":
                if (value && !["image/jpeg", "image/png", "image/jpg"].includes(value.type))
                    message = "Only JPEG, JPG, and PNG images are allowed.";
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
                    else if (!/^\d{10}$/.test(formData[key])) message = "Contact must be a 10-digit number.";
                    break;
                case "image":
                    if (formData[key] && !["image/jpeg", "image/png", "image/jpg"].includes(formData[key].type))
                        message = "Only JPEG, JPG, and PNG images are allowed.";
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

        const imageToUpload = formData.image || '/image/undraw_profile.svg';
        try {
            const response = await axios.post("/api/student/add_student", {
                name: formData.name,
                roll: formData.roll,
                course: formData.course,
                semester: formData.semester,
                contact: formData.contact,
                status: formData.status,
                image: imageToUpload,
            }, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.status === 200) {
                setFormData({
                    name: "",
                    roll: "",
                    course: "",
                    semester: "",
                    contact: "",
                    status: "inactive",
                    image: "",
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

    return (
        <div id="page-top">
            <div id="content-wrapper" className="d-flex flex-column">
                <div id="content">
                    <div className="container-fluid">
                        <h1 className="h3 mb-4 mt-3 text-gray-800">Add New Student</h1>

                        <form className="w-50" onSubmit={handleSubmit}>
                            <StudentFormContent formData={formData} handleChange={handleChange} errors={errors} courses={courses} />

                            <div className="mb-3 imageContainer">
                                {previewImage && (
                                    <img
                                        className="img-profile rounded-circle"
                                        style={{ width: "80px", height: "80px" }}
                                        src={previewImage}
                                        alt="Student"
                                    />
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
                                />
                                <label htmlFor="image">Image</label>
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