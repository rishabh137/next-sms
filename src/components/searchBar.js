const SearchBar = ({ pageName, total, value, handleSearch }) => {
    return (
        <>
            <div className="dataTables_filter d-flex justify-content-between mb-3">

                <p id="totalBooks">Total {pageName}: {total}</p>
                <p id="total"></p>

                <div className="d-flex align-items-center">
                    <label className="mb-0 mr-2">Search:</label>
                    <input
                        type="text"
                        className="form-control form-control-sm"
                        value={value}
                        onChange={handleSearch}
                    />
                </div>
            </div>
        </>
    )
}

export default SearchBar