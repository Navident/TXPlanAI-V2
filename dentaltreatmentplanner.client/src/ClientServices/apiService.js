//const API_BASE_URL = 'https://localhost:7089/api/TreatmentPlans';
//const CDT_CODES_API_URL = 'https://localhost:7089/api/cdtcodes';
//const VISITS_API_URL = 'https://localhost:7089/api/visits';
//const PROCEDURES_API_URL = 'https://localhost:7089/api';
const API_BASE_URL = 'https://dentaltreatmentplanner.azurewebsites.net/api/TreatmentPlans';
const CDT_CODES_API_URL = 'https://dentaltreatmentplanner.azurewebsites.net/api/cdtcodes';
const VISITS_API_URL = 'https://dentaltreatmentplanner.azurewebsites.net/api/visits';
const PROCEDURES_API_URL = 'https://dentaltreatmentplanner.azurewebsites.net/api';
const CREATE_NEW_PROCEDURES_API_URL = `${VISITS_API_URL}/CreateNewProcedures`;


// Function to generate a treatment plan
export const generateTreatmentPlan = async (parsedData, setTreatmentPlanId) => {
    try {
        console.log('Parsed Data being sent:', parsedData);
        const response = await fetch(`${API_BASE_URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(parsedData)
        });

        if (response.ok) {
            const responseData = await response.json();
            setTreatmentPlanId(responseData.treatmentPlanId);
            console.log('Treatment plan created successfully, ID:', responseData.treatmentPlanId);
        } else {
            // Convert response to text to handle non-JSON responses.
            const responseText = await response.text();
            console.error('Failed to create treatment plan. Status:', response.status, response.statusText);
            console.error('Response Body:', responseText);
        }
    } catch (error) {
        if (error.name === 'TypeError') {
            console.error('Network error or CORS issue:', error.message);
        } else {
            console.error('Other error:', error.message);
        }
    }
};

// Function to get a treatment plan by ID
export const getTreatmentPlanById = async (id, setTreatmentPlan) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (response.ok) {
            setTreatmentPlan(data);
            console.log(`Treatment plan with ID ${id}:`, data);
        } else {
            console.error(`Failed to retrieve treatment plan with ID ${id}. Status:`, response.status);
        }
    } catch (error) {
        console.error(`Error fetching treatment plan with ID ${id}:`, error.message);
    }
};

// Function to update treatment plans 
export const updateTreatmentPlan = async (id, updatedData) => {
    try {
        console.log('Updating Treatment Plan ID:', id, 'with data:', updatedData);
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData)
        });

        if (response.ok) {
            const responseData = await response.json();
            console.log('Treatment plan updated successfully:', responseData);
            return responseData; 
        } else {
            const responseText = await response.text();
            console.error('Failed to update treatment plan. Status:', response.status, response.statusText);
            console.error('Response Body:', responseText);
            throw new Error('Failed to update treatment plan');
        }
    } catch (error) {
        console.error('Error updating treatment plan:', error.message);
        throw error; // Re-throwing the error for the caller to handle it appropriately
    }
};

// Function to get all categories
export const getCategories = async () => {
    try {
        const response = await fetch(`${PROCEDURES_API_URL}/ProcedureCategory/categories`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Categories:", data);
            return data; // Return data
        } else {
            console.error("Failed to retrieve categories. Status:", response.status);
            return []; // Return empty array in case of error
        }
    } catch (error) {
        console.error("Error fetching categories:", error.message);
        return []; // Return empty array in case of error
    }
};


// Function to get subcategories by category name
export const getSubCategoriesByCategoryName = async (categoryName) => {
    try {
        const response = await fetch(`${PROCEDURES_API_URL}/ProcedureCategory/subcategories/${categoryName}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                const data = await response.json();
                console.log(`Subcategories for category Name ${categoryName}:`, data);
                return data; // Return data
            } else {
                console.log(`Received non-JSON response for category Name ${categoryName}`);
                return []; // Return empty array in case of error
            }
        } else {
            console.error(`Failed to retrieve subcategories for category Name ${categoryName}. Status:`, response.status);
            return []; // Return empty array in case of error
        }
    } catch (error) {
        console.error(`Error fetching subcategories for category Name ${categoryName}:`, error.message);
        return []; // Return empty array in case of error
    }
};


// Function to get treatment plans by subcategory name
export const getTreatmentPlansBySubcategory = async (subcategoryName) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Subcategory/${subcategoryName}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                const data = await response.json();
                console.log(`Treatment plans for subcategory Name ${subcategoryName}:`, data);
                return data; // Return the data directly
            } else {
                console.log(`Received non-JSON response for subcategory Name ${subcategoryName}`);
                return null; 
            }
        } else {
            console.error(`Failed to retrieve treatment plans for subcategory Name ${subcategoryName}. Status:`, response.status);
            return null; 
        }
    } catch (error) {
        console.error(`Error fetching treatment plans for subcategory Name ${subcategoryName}:`, error.message);
        return null; 
    }
};


export const getCdtCodes = async (setCdtCodes) => {
    try {
        const response = await fetch(CDT_CODES_API_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Data fetched:', data);
            setCdtCodes(data);
            console.log('CDT codes fetched successfully:', data);
        } else {
            console.error('Failed to fetch CDT codes. Status:', response.status);
        }
    } catch (error) {
        console.error('Error fetching CDT codes:', error.message);
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

