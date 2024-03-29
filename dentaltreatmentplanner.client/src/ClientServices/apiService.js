// Determine the base URL based on the window location
const API_BASE_URL = window.location.hostname === 'localhost'
    ? 'https://localhost:7089/api'
    : 'https://dentaltreatmentplanner.azurewebsites.net/api';

const VISITS_API_URL = `${API_BASE_URL}/visits`;
const PROCEDURES_API_URL = `${API_BASE_URL}`;
const CREATE_NEW_PROCEDURES_API_URL = `${VISITS_API_URL}/CreateNewProcedures`;
const PATIENTS_API_URL = `${API_BASE_URL}/Patient`;
const CDT_CODES_API_URL = `${API_BASE_URL}/cdtcodes`;
const PAYER_API_URL = `${API_BASE_URL}/payer`;
const ACCOUNT_API_URL = `${API_BASE_URL}/account`;
const TREATMENT_PLANS_API_URL = `${API_BASE_URL}/TreatmentPlans`;
const OPEN_DENTAL_API_URL = `${API_BASE_URL}/OpenDental`;

import { mapToCreateNewTreatmentPlanFromDefaultDto, mapToCreateNewCombinedTreatmentPlanForPatient } from '../Utils/mappingUtils';

export const registerUser = async (userData) => {
    try {
        const response = await fetch(`${ACCOUNT_API_URL}/register`, {
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

// Function to get the customer key for the user's facility
export const getCustomerKeyForUserFacility = async () => {
    try {
        const token = localStorage.getItem('jwtToken');
        const response = await fetch(`${ACCOUNT_API_URL}/customerkey`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        if (response.ok) {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                const customerKey = await response.json();
                console.log(`Received customer key object:`, customerKey); 
                return customerKey;
            } else {
                console.log(`Received non-JSON response for customer key`);
                return null;
            }
        } else {
            console.error(`Failed to retrieve customer key. Status:`, response.status);
            return null;
        }
    } catch (error) {
        console.error(`Error fetching customer key:`, error.message);
        return null;
    }
};

// Function to update the customer key for a facility
export const updateFacilityCustomerKey = async (newCustomerKey) => {
    try {
        const token = localStorage.getItem('jwtToken');
        const response = await fetch(`${ACCOUNT_API_URL}/updatecustomerkey`, { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ newCustomerKey }),
        });

        if (response.ok) {
            console.log(`Customer key updated successfully`);
            return true;
        } else {
            console.error(`Failed to update customer key. Status:`, response.status);
            return false;
        }
    } catch (error) {
        console.error(`Error updating customer key:`, error.message);
        return false;
    }
};


export const loginUser = async (credentials) => {
    try {
        const response = await fetch(`${ACCOUNT_API_URL}/login`, {
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
        console.log("data in loginUser: ", data);

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
        const response = await fetch(`${ACCOUNT_API_URL}/logout`, {
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
        const response = await fetch(`${TREATMENT_PLANS_API_URL}`, {
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
export const getTreatmentPlanById = async (id) => {
    try {
        const response = await fetch(`${TREATMENT_PLANS_API_URL}/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (response.ok) {
            console.log(`Treatment plan with ID ${id}:`, data);
            return data;
        } else {
            console.error(`Failed to retrieve treatment plan with ID ${id}. Status:`, response.status);
            return null; 
        }
    } catch (error) {
        console.error(`Error fetching treatment plan with ID ${id}:`, error.message);
        return null; 
    }
};

// Function to create a new treatment plan from default
export const handleCreateNewTreatmentPlanFromDefault = async (treatmentPlan, allRows, visitOrder) => {
    try {
        const token = localStorage.getItem('jwtToken'); 
        const newPlanData = mapToCreateNewTreatmentPlanFromDefaultDto(treatmentPlan, allRows, visitOrder);

        const response = await fetch(`${TREATMENT_PLANS_API_URL}/newfromdefault`, {
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


// Function to create a new treatment plan from for patient
export const handleCreateNewTreatmentPlanForPatient = async (treatmentPlan, allRows, visitOrder, selectedPatientId, payerId) => {
    try {
        const token = localStorage.getItem('jwtToken');
        const endpoint = '/newTxForPatient';
        const newPlanData = {
            ...mapToCreateNewCombinedTreatmentPlanForPatient(treatmentPlan, allRows, visitOrder, payerId),
            patientId: selectedPatientId
        };

        const response = await fetch(`${TREATMENT_PLANS_API_URL}${endpoint}`, {
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

// Function to update treatment plans 
export const updateTreatmentPlan = async (id, updatedData) => {
    try {
        console.log('Updating Treatment Plan ID:', id, 'with data:', updatedData);
        const response = await fetch(`${TREATMENT_PLANS_API_URL}/${id}`, {
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
        throw error;
    }
};

// Function to get all treatment plans for the current user's facility
export const getAllPatientTreatmentPlansForFacility = async () => {
    try {
        const token = localStorage.getItem('jwtToken');
        const response = await fetch(`${TREATMENT_PLANS_API_URL}/allpatientplansforfacility`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Treatment Plans:", data);
            return data;
        } else {
            console.error("Failed to retrieve treatment plans. Status:", response.status);
            return [];
        }
    } catch (error) {
        console.error("Error fetching treatment plans:", error.message);
        return [];
    }
};

// Function to get all categories
export const getCategories = async () => {
    try {
        const token = localStorage.getItem('jwtToken');
        const response = await fetch(`${PROCEDURES_API_URL}/ProcedureCategory/categories`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
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
};


export const getCdtCodes = async () => {
    try {
        const response = await fetch(`${CDT_CODES_API_URL}/defaultcdtcodes`, {
            method: 'GET'
        });

        if (response.ok) {
            try {
                const data = await response.json();
                console.log('CDT codes fetched successfully:', data);
                return data;
            } catch (jsonParseError) {
                console.error('Failed to parse response as JSON:', jsonParseError);
                return [];
            }
        } else {
            console.error('Failed to fetch CDT codes. Status:', response.status);
            return [];
        }
    } catch (networkError) {
        console.error('Error fetching CDT codes:', networkError.message);
        return [];
    }
};


export const getAlternativeProceduresByFacility = async () => {
    try {
        const token = localStorage.getItem('jwtToken');
        const response = await fetch(`${CDT_CODES_API_URL}/alternativeprocedures`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        if (response.ok) {
            try {
                const data = await response.json();
                console.log('Alternative procedures fetched successfully:', data);
                return data;
            } catch (jsonParseError) {
                console.error('Failed to parse response as JSON:', jsonParseError);
                return [];
            }
        } else {
            console.error('Failed to fetch alternative procedures. Status:', response.status);
            return [];
        }
    } catch (networkError) {
        console.error('Error fetching alternative procedures:', networkError.message);
        return [];
    }
};


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



export const getCustomCdtCodesForFacility = async () => {
    try {
        const token = localStorage.getItem('jwtToken');
        const response = await fetch(`${CDT_CODES_API_URL}/facilityCdtCodes`, {
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
                console.log(`Custom CDT codes for user's facility:`, data);
                return data;
            } else {
                console.log(`Received non-JSON response for CDT codes`);
                return null;
            }
        } else {
            console.error(`Failed to retrieve CDT codes. Status:`, response.status);
            return null;
        }
    } catch (error) {
        console.error(`Error fetching CDT codes:`, error.message);
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



// Function to update custom cdt codes (both create and delete)
export const updateCustomFacilityCdtCodes = async (updateData) => {
    console.log("JSON.stringify(updateData):", JSON.stringify(updateData));
    try {
        const token = localStorage.getItem('jwtToken');
        const response = await fetch(`${CDT_CODES_API_URL}/updateCustomCdtCodes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updateData),
        });

        if (response.ok) {
            console.log(`CDT codes updated successfully`);
            return true;
        } else {
            console.error(`Failed to update CDT codes. Status:`, response.status);
            return false;
        }
    } catch (error) {
        console.error(`Error updating CDT codes:`, error.message);
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


// Function to get treatment plans by subcategory name
export const getTreatmentPlansBySubcategory = async (subcategoryName) => {
    try {
        const token = localStorage.getItem('jwtToken');
        console.log(`token in gettreatmentplan ${token}`);
        const response = await fetch(`${TREATMENT_PLANS_API_URL}/Subcategory/${subcategoryName}`, {
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
        const response = await fetch(`${TREATMENT_PLANS_API_URL}/Patient/${patientId}`, {
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

export const deleteTreatmentPlanById = async (treatmentPlanId) => {
    try {
        const token = localStorage.getItem('jwtToken');
        const response = await fetch(`${TREATMENT_PLANS_API_URL}/delete/${treatmentPlanId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}` 
            },
        });

        if (response.ok) {
            console.log('Treatment plan deleted successfully');
            return true;
        } else {
            console.error('Failed to delete treatment plan. Status:', response.status);
            return false;
        }
    } catch (error) {
        console.error('Error deleting treatment plan:', error.message);
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





