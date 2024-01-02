const SearchPatient = ({ searchQuery, handleSearchChange }) => {

    return (
        <div className="search-patient">
            <div className="patients-inner-section">
                <div className="large-text">Search Patient</div>
                <input
                    type="text"
                    placeholder="Search Patient"
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
            </div>
        </div>
    );
};

export default SearchPatient;
