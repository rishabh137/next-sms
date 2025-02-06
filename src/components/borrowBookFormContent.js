const BorrowBookFormContent = ({ formData, handleChange, errors, subjects, books }) => {
    // const currentDate = new Date().toISOString().split('T')[0];
    return (
        <>
            <div className="form-group floating-label">
                <select
                    id="subject"
                    name="subject"
                    className="form-control"
                    value={formData.subject}
                    onChange={handleChange}
                >
                    {subjects.map(subject => (
                        <option key={subject.subject_id} value={subject.subject_id}>
                            {subject.subject_name}
                        </option>
                    ))}
                </select>
                <label htmlFor="subject" className="float-label">Subject</label>
                {errors.subject && <span className="danger text-xs">{errors.subject}</span>}
            </div>

            <div className="form-group floating-label">
                <select
                    id="title"
                    name="title"
                    className="form-control"
                    value={formData.title}
                    onChange={handleChange}
                >
                    {
                        books.length > 0 ?
                            books.map(book => (
                                <option key={book.book_id} value={book.book_id}>
                                    {book.name} by {book.author}
                                </option>
                            )) :
                            <option value="">No Books Found</option>
                    }
                </select>
                <label htmlFor="title" className="float-label">Book Name</label>
                {errors.title && <span className="danger text-xs">{errors.title}</span>}
            </div>

            <div className="form-group">
                <input
                    type="date"
                    id="borrowDate"
                    name="borrowDate"
                    className="form-control"
                    placeholder=" "
                    min="1900-01-01"
                    value={formData.borrowDate}
                    onChange={handleChange}
                    autoComplete="off"
                />
                <label htmlFor="borrowDate">Borrow Date</label>
                {errors.borrowDate && <span className="danger text-xs">{errors.borrowDate}</span>}
            </div>

            <div className="form-group">
                <input
                    type="date"
                    id="returnDate"
                    name="returnDate"
                    className="form-control"
                    placeholder=" "
                    min="1900-01-01"
                    value={formData.returnDate}
                    onChange={handleChange}
                    autoComplete="off"
                />
                <label htmlFor="returnDate">Return Date</label>
                {errors.returnDate && <span className="danger text-xs">{errors.returnDate}</span>}
            </div>
        </>
    )
}

export default BorrowBookFormContent;