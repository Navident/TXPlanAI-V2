// Determine the base URL based on the window location
const API_BASE_URL = window.location.hostname === 'localhost'
    ? 'https://localhost:7089/api'
    : 'https://dentaltreatmentplanner.azurewebsites.net/api';

const VISITS_API_URL = `${API_BASE_URL}/visits`;
//const CATS_SUBCATS__API_URL = `${API_BASE_URL}/ProcedureCategory`;
const CREATE_NEW_PROCEDURES_API_URL = `${VISITS_API_URL}/CreateNewProcedures`;
//const PATIENTS_API_URL = `${API_BASE_URL}/Patient`;
const CDT_CODES_API_URL = `${API_BASE_URL}/cdtcodes`;
const PAYER_API_URL = `${API_BASE_URL}/payer`;
//const ACCOUNT_API_URL = `${API_BASE_URL}/account`;
//const TREATMENT_PLANS_API_URL = `${API_BASE_URL}/TreatmentPlans`;



/*const OPEN_DENTAL_API_URL = `${API_BASE_URL}/OpenDental`;


// Function to get patients for the user's facility from opendental
export const getPatientsForUserFacilityFromOpenDental = async () => {
    try {
        const token = localStorage.getItem('jwtToken');
        const response = await fetch(`${OPEN_DENTAL_API_URL}/facilityPatientsOpenDental`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        if (response.ok) {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                const data = await response.json();
                console.log(`Patients for user's facility:`, data);
                return data;
            } else {
                console.log(`Received non-JSON response for patients`);
                return null;
            }
        } else {
            console.error(`Failed to retrieve patients. Status:`, response.status);
            return null;
        }
    } catch (error) {
        console.error(`Error fetching patients:`, error.message);
        return null;
    }
};

//function to import treatment plan into opendental
export const importTreatmentPlanToOpenDental = async (openDentalTreatmentPlanDto) => {
    console.log("openDentalTreatmentPlanDto in importTreatmentPlanToOpenDental: ", openDentalTreatmentPlanDto);
    try {
        const token = localStorage.getItem('jwtToken');
        const response = await fetch(`${OPEN_DENTAL_API_URL}/importtoopendental`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(openDentalTreatmentPlanDto),
        });

        if (response.ok) {
            console.log(`Treatment plan imported successfully`);
            return true;
        } else {
            console.error(`Failed to import treatment plan. Status:`, response.status);
            return false;
        }
    } catch (error) {
        console.error(`Error importing treatment plan:`, error.message);
        return false;
    }
};

// Function to save patients from OpenDental to the database
export const savePatientsFromOpenDentalToDatabase = async () => {
    try {
        const token = localStorage.getItem('jwtToken');
        const response = await fetch(`${OPEN_DENTAL_API_URL}/savePatientsFromOpenDentalToDatabase`, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        if (response.ok) {
            console.log(`Patients successfully saved to the database.`);
            return true;
        } else {
            console.error(`Failed to save patients. Status:`, response.status);
            return false;
        }
    } catch (error) {
        console.error(`Error saving patients:`, error.message);
        return false;
    }
};*/






export const getPayersForFacility = async () => {
    try {
        const token = localStorage.getItem('jwtToken');
        const response = await fetch(`${PAYER_API_URL}/facilityPayers`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        if (response.ok) {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                const data = await response.json();
                console.log(`Payers for user's facility:`, data);
                return data;
            } else {
                console.log(`Received non-JSON response for payers`);
                return null;
            }
        } else {
            console.error(`Failed to retrieve payers. Status:`, response.status);
            return null;
        }
    } catch (error) {
        console.error(`Error fetching payers:`, error.message);
        return null;
    }
};

export const getFacilityPayersWithCdtCodesFees = async () => {
    try {
        const token = localStorage.getItem('jwtToken');
        const response = await fetch(`${PAYER_API_URL}/facilityPayersWithCdtCodesFees`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        if (response.ok) {
            const data = await response.json();
            console.log(`Payers with CDT codes fees for facility:`, data);
            return data;
        } else {
            console.error(`Failed to retrieve payers with CDT codes fees. Status:`, response.status);
            return null;
        }
    } catch (error) {
        console.error(`Error fetching payers with CDT codes fees:`, error.message);
        return null;
    }
};







export const updateFacilityPayerCdtCodeFees = async (payload) => {
    console.log("JSON.stringify(payload) sent from the frontend: ", JSON.stringify(payload));
    try {
        const token = localStorage.getItem('jwtToken');
        const response = await fetch(`${CDT_CODES_API_URL}/updateFacilityPayerCdtCodeFees`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            console.log(`Facility payer CDT code fees updated successfully`);
            return true;
        } else {
            console.error(`Failed to update facility payer CDT code fees. Status:`, response.status);
            return false;
        }
    } catch (error) {
        console.error(`Error updating facility payer CDT code fees:`, error.message);
        return false;
    }
};





export const updateFacilityPayers = async (updateData) => {
    console.log("Updating Payers:", JSON.stringify(updateData));
    try {
        const token = localStorage.getItem('jwtToken');
        const response = await fetch(`${PAYER_API_URL}/updateFacilityPayers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updateData),
        });

        if (response.ok) {
            console.log(`Payers updated successfully`);
            return true;
        } else {
            console.error(`Failed to update payers. Status:`, response.status);
            return false;
        }
    } catch (error) {
        console.error(`Error updating payers:`, error.message);
        return false;
    }
};




export const createVisit = async (visitData, tempVisitId) => {
    try {
        const dataWithTempId = { ...visitData, tempVisitId }; // Include tempVisitId in the request
        console.log('Creating new visit with data:', dataWithTempId);
        const response = await fetch(VISITS_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataWithTempId)
        });

        if (response.ok) {
            const responseData = await response.json();
            console.log('Visit created successfully:', responseData);
            return responseData; // Optionally return data for further processing
        } else {
            const responseText = await response.text();
            console.error('Failed to create visit. Status:', response.status, response.statusText);
            console.error('Response Body:', responseText);
            throw new Error('Failed to create visit');
        }
    } catch (error) {
        console.error('Error creating visit:', error.message);
        throw error; 
    }
};


export const createNewProcedures = async (newProcedures) => {
    try {
        console.log('Creating new procedures with data:', newProcedures);
        const response = await fetch(CREATE_NEW_PROCEDURES_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newProcedures)
        });

        if (response.ok) {
            const responseData = await response.json();
            console.log('New procedures created successfully:', responseData);
            return responseData; // Optionally return data for further processing
        } else {
            const responseText = await response.text();
            console.error('Failed to create new procedures. Status:', response.status, response.statusText);
            console.error('Response Body:', responseText);
            throw new Error('Failed to create new procedures');
        }
    } catch (error) {
        console.error('Error creating new procedures:', error.message);
        throw error;
    }
};

export const getFacilityPayerCdtCodesFeesByPayer = async (payerId) => {
    try {
        const token = localStorage.getItem('jwtToken');
        const response = await fetch(`${CDT_CODES_API_URL}/cdtCodesFees?payerId=${payerId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        if (response.ok) {
            const data = await response.json();
            console.log(`Fees for CDT codes by payer ${payerId}:`, data);
            return data;
        } else {
            console.error(`Failed to retrieve CDT codes fees for payer ${payerId}. Status:`, response.status);
            return null;
        }
    } catch (error) {
        console.error(`Error fetching CDT codes fees for payer ${payerId}:`, error.message);
        return null;
    }
};





