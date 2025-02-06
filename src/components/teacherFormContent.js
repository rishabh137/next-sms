const TeacherFormContent = ({ formData, handleChange, errors, subject }) => {
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

            <div className="form-group floating-label">
                <select
                    id="subject"
                    name="subject"
                    className="form-control"
                    value={formData.subject}
                    onChange={handleChange}
                >
                    <option value="">Select Subject</option>
                    {subject.map((sub) => (
                        <option key={sub.subject_id} value={sub.subject_id}>
                            {sub.subject_name}
                        </option>
                    ))}
                </select>
                <label htmlFor="subject" className="float-label">Subject</label>
                {errors.subject && <span className="danger text-xs">{errors.subject}</span>}
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
        </>
    )
}

export default TeacherFormContent;