
// js/validation.js

// Returns an object: { isValid: boolean, message: string | null }
export async function validateField(field, handleDisqualificationCallback) {
    // Get elements within the function now
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone-number');

    let inputElement, value, fieldNameForAPI;
    if (field === 'name') { inputElement = nameInput; fieldNameForAPI = 'name'; }
    else if (field === 'email') { inputElement = emailInput; fieldNameForAPI = 'email'; }
    else if (field === 'phone') { inputElement = phoneInput; fieldNameForAPI = 'phone'; }
    else { return { isValid: true, message: null }; } // No validation needed

    if (!inputElement) return { isValid: true, message: null }; // Element not found

    value = inputElement.value.trim();

    // Basic required check
    if (!value) {
        return { isValid: false, message: `${field.charAt(0).toUpperCase() + field.slice(1)} is required.` };
    }

    console.log(`Checking ${field}: ${value}`);
    const checkUrl = `/check-user?field=${fieldNameForAPI}&value=${encodeURIComponent(value)}`;

    try {
        const checkResponse = await fetch(checkUrl);
        // Always try to parse JSON, even for errors
        const checkData = await checkResponse.json().catch(() => ({})); // Default to empty object on parse error

        if (!checkResponse.ok) {
             // Handle 404 specifically as "user not found" which is OK for validation
             if (checkResponse.status === 404) {
                 return { isValid: true, message: null }; // User not found, so it's valid
             }
             // Handle other errors
             if (checkData.exists && checkData.disqualified) {
                 if (handleDisqualificationCallback) {
                    handleDisqualificationCallback(checkData.message || `User with this ${field} exists and is disqualified.`);
                 }
                 return { isValid: false, message: checkData.message || `User with this ${field} exists and is disqualified.` };
             }
             else if (checkData.exists && !checkData.disqualified) {
                 return { isValid: false, message: checkData.message || `User with this ${field} already exists.` };
             }
             else {
                 // Handle other non-OK statuses (e.g., 500)
                 throw new Error(checkData.message || `Error checking ${field}: Status ${checkResponse.status}`);
             }
        } else {
            // Server responded OK (200) - This implies user *was* found in check-user logic
            if (checkData.exists) { // Double check response structure
                if (checkData.disqualified) {
                    if (handleDisqualificationCallback) {
                        handleDisqualificationCallback(checkData.message || `User with this ${field} exists and is disqualified.`);
                    }
                    return { isValid: false, message: checkData.message || `User with this ${field} exists and is disqualified.` };
                } else {
                    // User exists but is not disqualified
                    return { isValid: false, message: checkData.message || `User with this ${field} already exists.` };
                }
            } else {
                 // If server responds 200 OK but says exists: false (shouldn't happen with GET /check-user ideally)
                 // Treat as valid for now, assuming the 404 handles non-existence.
                 console.warn("Server responded OK but checkData.exists is false for /check-user");
                 return { isValid: true, message: null };
            }
        }
    } catch (error) {
        console.error(`Error during real-time ${field} check:`, error);
        return { isValid: false, message: `Could not verify ${field}. Check connection.` };
    }
}
