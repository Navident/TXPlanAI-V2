const API_BASE_URL = 'https://localhost:7089/api/TreatmentPlans';

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

// Function to get treatment plans by subcategory name
export const getTreatmentPlansBySubcategory = async (subcategoryName, setTreatmentPlans) => {
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
                setTreatmentPlans(data);
                console.log(`Treatment plans for subcategory Name ${subcategoryName}:`, data);
            } else {
                console.log(`Received non-JSON response for subcategory Name ${subcategoryName}`);
            }
        } else {
            console.error(`Failed to retrieve treatment plans for subcategory Name ${subcategoryName}. Status:`, response.status);
        }
    } catch (error) {
        console.error(`Error fetching treatment plans for subcategory Name ${subcategoryName}:`, error.message);
    }
};

const CDT_CODES_API_URL = 'https://localhost:7089/api/cdtcodes';

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
