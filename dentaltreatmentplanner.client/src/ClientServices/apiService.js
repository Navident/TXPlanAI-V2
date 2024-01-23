//const API_BASE_URL = 'https://localhost:7089/api/TreatmentPlans';
//const CDT_CODES_API_URL = 'https://localhost:7089/api/cdtcodes';
//const VISITS_API_URL = 'https://localhost:7089/api/visits';
//const PROCEDURES_API_URL = 'https://localhost:7089/api';
const API_BASE_URL = 'https://localhost:7089/api/TreatmentPlans';
const CDT_CODES_API_URL = 'https://dentaltreatmentplanner.azurewebsites.net/api/cdtcodes';
const VISITS_API_URL = 'https://localhost:7089/api/visits';
const PROCEDURES_API_URL = 'https://dentaltreatmentplanner.azurewebsites.net/api';
const CREATE_NEW_PROCEDURES_API_URL = `${VISITS_API_URL}/CreateNewProcedures`;
const PATIENTS_API_URL = 'https://localhost:7089/api/Patient';
const TREATMENT_PHASES_API_URL = 'https://localhost:7089/api/treatmentphases';
import { mapToCreateNewTreatmentPlanFromDefaultDto, mapToCreateNewCombinedTreatmentPlanForPatient } from '../Utils/mappingUtils';

export const registerUser = async (userData) => {
    try {
        const response = await fetch('https://dentaltreatmentplanner.azurewebsites.net/api/account/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });

        if (response.ok) {
            console.log('User registered successfully');
            return await response.json();
        } else {
            console.error('Failed to register user. Status:', response.status, response.statusText);
            return await response.json();
        }
    } catch (error) {
        console.error('Error during user registration:', error);
    }
};

export const loginUser = async (credentials) => {
    try {
        const response = await fetch('https://localhost:7089/api/account/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials)
        });

        if (!response.ok) {
            // If response status is not OK, attempt to parse and return the error details
            const errorData = await response.json();
            console.error('Failed to login user. Status:', response.status, response.statusText, errorData);
            return { isSuccess: false, ...errorData };
        }

        // If response is OK, process the successful login
        const data = await response.json();
        console.log('User logged in successfully', data);
        console.log('Response data:', data);


        // Store the token
        localStorage.setItem('jwtToken', data.token);


        return { isSuccess: true, ...data };
    } catch (networkError) {
        // Handle network-related errors
        console.error('Network error during user login:', networkError);
        return { isSuccess: false, message: networkError.message || 'Network error during login' };
    }
};




export const logoutUser = async () => {
    try {
        const response = await fetch('https://dentaltreatmentplanner.azurewebsites.net/api/account/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.ok) {
            console.log('User logged out successfully');
        } else {
            console.error('Failed to logout user. Status:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Error during user logout:', error);
    }
};

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

// Function to create a new treatment plan from default
export const handleCreateNewTreatmentPlanFromDefault = async (treatmentPlan, allRows, visitOrder) => {
    try {
        const token = localStorage.getItem('jwtToken'); // Retrieve the token from local storage
        const newPlanData = mapToCreateNewTreatmentPlanFromDefaultDto(treatmentPlan, allRows, visitOrder);

        const response = await fetch(`${API_BASE_URL}/newfromdefault`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(newPlanData),
        });

        if (response.ok) {
            return await response.json();
        } else {
            const responseText = await response.text();
            console.error('Failed to create new treatment plan. Status:', response.status, response.statusText);
            console.error('Response Body:', responseText);
            throw new Error('Failed to create new treatment plan');
        }
    } catch (error) {
        console.error('Error creating new treatment plan:', error.message);
        throw error;
    }
};


// Function to create a new treatment plan from default
export const handleCreateNewCombinedTreatmentPlanForPatient = async (treatmentPlan, allRows, visitOrder, selectedPatientId) => {
    try {
        const token = localStorage.getItem('jwtToken');
        const newPlanData = {
            ...mapToCreateNewCombinedTreatmentPlanForPatient(treatmentPlan, allRows, visitOrder),
            patientId: selectedPatientId
        };

        const response = await fetch(`${API_BASE_URL}/newCombinedForPatient`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Include the token in the Authorization header
            },
            body: JSON.stringify(newPlanData),
        });

        if (response.ok) {
            return await response.json();
        } else {
            const responseText = await response.text();
            console.error('Failed to create new treatment plan. Status:', response.status, response.statusText);
            console.error('Response Body:', responseText);
            throw new Error('Failed to create new treatment plan');
        }
    } catch (error) {
        console.error('Error creating new treatment plan:', error.message);
        throw error;
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
        const token = localStorage.getItem('jwtToken');
        console.log("jwttoken: ", token);
        const response = await fetch(`${PROCEDURES_API_URL}/ProcedureCategory/categories`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Include the token in the Authorization header
            },
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Categories:", data);
            return data; 
        } else {
            console.error("Failed to retrieve categories. Status:", response.status);
            return [];
        }
    } catch (error) {
        console.error("Error fetching categories:", error.message);
        return [];
    }
};


// Function to get subcategories by category name
export const getSubCategoriesByCategoryName = async (categoryName) => {
    try {
        const token = localStorage.getItem('jwtToken');
        console.log('Retrieved token:', token);


        const response = await fetch(`${PROCEDURES_API_URL}/ProcedureCategory/subcategories/${categoryName}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Include the token in the Authorization header
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
                return []; 
            }
        } else {
            console.error(`Failed to retrieve subcategories for category Name ${categoryName}. Status:`, response.status);
            return []; 
        }
    } catch (error) {
        console.error(`Error fetching subcategories for category Name ${categoryName}:`, error.message);
        return []; 
    }
};



// Function to get patients for the user's facility
export const getPatientsForUserFacility = async () => {
    try {
        const token = localStorage.getItem('jwtToken');
        const response = await fetch(`${PATIENTS_API_URL}/facilityPatients`, {
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

// Function to create a new patient
export const createPatient = async (patientData) => {
    try {
        const token = localStorage.getItem('jwtToken');
        const response = await fetch(`${PATIENTS_API_URL}/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(patientData),
        });

        if (response.ok) {
            const patientId = await response.json();
            console.log(`New patient created with ID:`, patientId);
            return patientId;
        } else {
            console.error(`Failed to create patient. Status:`, response.status);
            return null;
        }
    } catch (error) {
        console.error(`Error creating patient:`, error.message);
        return null;
    }
};


// Function to get treatment plans by subcategory name
export const getTreatmentPlansBySubcategory = async (subcategoryName) => {
    try {
        const token = localStorage.getItem('jwtToken');
        console.log(`token in gettreatmentplan ${token}`);
        const response = await fetch(`${API_BASE_URL}/Subcategory/${subcategoryName}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Include the token in the Authorization header
            },
        });

        if (response.ok) {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                const data = await response.json();
                console.log(`Treatment plans for subcategory Name ${subcategoryName}:`, data);
                return data; 
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

// Function to get treatment plans by patient ID
export const getTreatmentPlansByPatient = async (patientId) => {
    try {
        const token = localStorage.getItem('jwtToken');
        console.log(`token in getTreatmentPlansByPatient: ${token}`);
        const response = await fetch(`${API_BASE_URL}/Patient/${patientId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Include the token in the Authorization header
            },
        });

        if (response.ok) {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                const data = await response.json();
                console.log(`Treatment plans for patient ID ${patientId}:`, data);
                return data;
            } else {
                console.log(`Received non-JSON response for patient ID ${patientId}`);
                return null;
            }
        } else {
            console.error(`Failed to retrieve treatment plans for patient ID ${patientId}. Status:`, response.status);
            return null;
        }
    } catch (error) {
        console.error(`Error fetching treatment plans for patient ID ${patientId}:`, error.message);
        return null;
    }
};

// In your apiService.js or wherever getCdtCodes is defined
export const getCdtCodes = async () => {
    try {
        const response = await fetch(CDT_CODES_API_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const data = await response.json();
            console.log('CDT codes fetched successfully:', data);
            return data; // Return the data
        } else {
            console.error('Failed to fetch CDT codes. Status:', response.status);
            return [];
        }
    } catch (error) {
        console.error('Error fetching CDT codes:', error.message);
        return []; 
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

export const getTreatmentPhases = async () => {
    try {
        const response = await fetch(TREATMENT_PHASES_API_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Treatment phases fetched successfully:', data);
            return data; // Return the data
        } else {
            console.error('Failed to fetch treatment phases. Status:', response.status);
            return [];
        }
    } catch (error) {
        console.error('Error fetching treatment phases:', error.message);
        return [];
    }
};


