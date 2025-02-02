const StudentFormContent = ({ formData, handleChange, errors, courses }) => {
    return (
        <>
            <div className="form-group">
                <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-control"
                    placeholder=" "
                    value={formData.name}
                    onChange={handleChange}
                    autoComplete="off"
                />
                <label htmlFor="name">Name</label>
                {errors.name && <span className="danger text-xs">{errors.name}</span>}
            </div>

            <div className="form-group">
                <input
                    type="text"
                    id="roll"
                    name="roll"
                    className="form-control"
                    placeholder=" "
                    value={formData.roll}
                    onChange={handleChange}
                    autoComplete="off"
                />
                <label htmlFor="roll">Roll Number</label>
                {errors.roll && <span className="danger text-xs">{errors.roll}</span>}
            </div>

            <div className="form-group floating-label">
                <select
                    id="course"
                    name="course"
                    className="form-control"
                    value={formData.course}
                    onChange={handleChange}
                >
                    {courses.map((course) => (
                        <option key={course.course_id} value={course.course_id}>
                            {course.course_name}
                        </option>
                    ))}
                </select>
                <label htmlFor="course" className="float-label">Course</label>
                {errors.course && <span className="danger text-xs">{errors.course}</span>}
            </div>

            <div className="form-group">
                <input
                    type="text"
                    id="semester"
                    name="semester"
                    className="form-control"
                    placeholder=" "
                    value={formData.semester}
                    onChange={handleChange}
                    autoComplete="off"
                />
                <label htmlFor="semester">Semester</label>
                {errors.semester && <span className="danger text-xs">{errors.semester}</span>}
            </div>

            <div className="form-group">
                <input
                    type="text"
                    id="contact"
                    name="contact"
                    className="form-control"
                    placeholder=" "
                    value={formData.contact}
                    onChange={handleChange}
                    autoComplete="off"
                />
                <label htmlFor="contact">Contact</label>
                {errors.contact && <span className="danger text-xs">{errors.contact}</span>}
            </div>

            <div className="form-group floating-label">
                <select
                    id="status"
                    name="status"
                    className="form-control"
                    value={formData.status}
                    onChange={handleChange}
                >
                    <option value="Inactive">Inactive</option>
                    <option value="Active">Active</option>
                </select>
                <label htmlFor="status" className="float-label">Status</label>
            </div>
        </>
    )
}

export default StudentFormContent;