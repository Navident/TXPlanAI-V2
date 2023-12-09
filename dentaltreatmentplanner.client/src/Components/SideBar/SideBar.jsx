import './SideBar.css';
import React, { useState } from 'react';

const SideNav = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        // Here I will Implement search functionality or pass the search query to the parent component
    };

    return (
        <div className="sidebar-container">
            <div className="search-patient">
                <div className="patients-inner-section">
                    <div className="large-text">All Patients</div>
                    <input
                        type="text"
                        placeholder="Search Patient"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        />
                </div>
            </div>

            {/* Going to add the list of all patients here */}
        </div>
    );
};

export default SideNav;