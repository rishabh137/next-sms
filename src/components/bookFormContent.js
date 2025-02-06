const BookFormContent = ({ formData, handleChange, errors, subject }) => {
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
                    id="author"
                    name="author"
                    className="form-control"
                    placeholder=" "
                    value={formData.author}
                    onChange={handleChange}
                    autoComplete="off"
                />
                <label htmlFor="author">Author</label>
                {errors.author && <span className="danger text-xs">{errors.author}</span>}
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

            <div className="form-group">
                <input
                    type="text"
                    id="isbn"
                    name="isbn"
                    className="form-control"
                    placeholder=" "
                    value={formData.isbn}
                    onChange={handleChange}
                    autoComplete="off"
                />
                <label htmlFor="isbn">ISBN</label>
                {errors.isbn && <span className="danger text-xs">{errors.isbn}</span>}
            </div>

            <div className="form-group">
                <input
                    type="text"
                    id="copies"
                    name="copies"
                    className="form-control"
                    placeholder=" "
                    value={formData.copies}
                    onChange={handleChange}
                    autoComplete="off"
                />
                <label htmlFor="copies">Number of Copies</label>
                {errors.copies && <span className="danger text-xs">{errors.copies}</span>}
            </div>
        </>
    )
}

export default BookFormContent;