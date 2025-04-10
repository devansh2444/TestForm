// js/main.js
import * as UI from './ui.js'; // Import all UI functions
import { startTimer, stopTimer } from './timer.js';
import { validateField } from './validation.js';

// --- State Variables ---
let currentUserId = localStorage.getItem('userId');
let isDisqualified = false;
let storedGoogleFormUrl = '';
let tabSwitchWarnings = parseInt(localStorage.getItem('tabSwitchWarnings') || '0');
let isShowingWarning = false; // Flag for first warning alert
let isGoogleFormActive = false; // Flag for Google Form phase
const timerDuration = 10 * 60 * 1000; // 10 minutes

// validationErrors object
let validationErrors = { name: false, email: false, phone: false };

// --- Core Logic Functions ---

// function to update submit button state based on validationErrors
function updateSubmitButtonBasedOnValidation() {
    const hasErrors = Object.values(validationErrors).some(hasError => hasError);
    UI.updateSubmitButtonState(isDisqualified || hasErrors);
}


function handleDisqualification(message = '<b>Access Blocked!</b><br>You moved away from the page. Please refresh to try again.') {
    if (isDisqualified) return;
    isDisqualified = true;
    stopTimer(); // Use the imported function
    UI.applyDisqualificationUI(message); // Use the imported function
    localStorage.removeItem('tabSwitchWarnings');
    isGoogleFormActive = false;
    validationErrors = { name: true, email: true, phone: true }; // Mark all as invalid on disqualification
    updateSubmitButtonBasedOnValidation(); // Update button state
    console.log("User disqualified.");
}

function resetApp() {
    stopTimer();
    UI.resetUIElements(); // Use the imported function

    // Reset state variables
    currentUserId = null; // Clear user ID on full reset
    localStorage.removeItem('userId');
    isDisqualified = false;
    storedGoogleFormUrl = '';
    tabSwitchWarnings = 0;
    localStorage.removeItem('tabSwitchWarnings');
    isShowingWarning = false;
    isGoogleFormActive = false;
    validationErrors = { name: false, email: false, phone: false }; // Reset validation errors

    // Update button state
    updateSubmitButtonBasedOnValidation(); // Use the new function
}

async function handleFormSubmit(event) {
    event.preventDefault();
    UI.hideMessage();

    if (isDisqualified) {
        handleDisqualification(); // Re-show message if needed
        return;
    }

    // Get references inside the handler to ensure they exist
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone-number');
    if (!nameInput || !emailInput || !phoneInput) {
        console.error("Form input elements not found!");
        return;
    }

    // Perform all validations before submitting and update state
    const nameResult = await validateField('name', handleDisqualification);
    validationErrors.name = !nameResult.isValid;
    UI.showInlineMessage('name', nameResult.message);

    const emailResult = await validateField('email', handleDisqualification);
    validationErrors.email = !emailResult.isValid;
    UI.showInlineMessage('email', emailResult.message);

    const phoneResult = await validateField('phone', handleDisqualification);
    validationErrors.phone = !phoneResult.isValid;
    UI.showInlineMessage('phone', phoneResult.message);

    // Update button state based on the latest validation results
    updateSubmitButtonBasedOnValidation();

    // Check if any errors exist now
    if (validationErrors.name || validationErrors.email || validationErrors.phone) {
        UI.showMessage('Please fix the errors in the form before submitting.', 'error');
        return;
    }

    // Get form data (assuming validation passed)
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phoneNumber = phoneInput.value.trim();

    // Final check for empty fields (redundant if validation is robust, but safe)
    if (!name || !email || !phoneNumber) {
        UI.showMessage('Please fill in all fields.', 'error');
        updateSubmitButtonBasedOnValidation();
        return;
    }

    console.log("Submitting form...");
    UI.updateSubmitButtonState(true); // Disable button during submit
    const submitButton = document.getElementById('submit-button');
    if (submitButton) submitButton.textContent = 'Submitting...';


    try {
        const submitResponse = await fetch('/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, phoneNumber })
        });
        // Always try to parse JSON, even for errors
        const submitData = await submitResponse.json().catch(() => ({})); // Default to empty object on parse error


        if (!submitResponse.ok) {
             if (submitResponse.status === 403) { handleDisqualification(submitData.message || 'Submission denied. Your session may have been closed.'); }
             else if (submitResponse.status === 409) {
                 UI.showMessage('User already exists with this email or phone number.', 'error');
                 // Re-highlight fields and update state
                 validationErrors.email = true; // Assume email/phone conflict
                 validationErrors.phone = true;
                 UI.showInlineMessage('email', 'Email or phone number may already exist.');
                 UI.showInlineMessage('phone', 'Email or phone number may already exist.');
             } else { throw new Error(submitData.message || `Error submitting form: Status ${submitResponse.status}`); }

             if (!isDisqualified) {
                 updateSubmitButtonBasedOnValidation(); // Update button state based on errors
                 if (submitButton) submitButton.textContent = 'Submit'; // Reset button text
             }
             return;
        }

        // Handle successful submission
        if (submitData.message === 'Form submitted successfully' && submitData.googleFormUrl) {
            currentUserId = submitData.userId;
            localStorage.setItem('userId', currentUserId);
            console.log('Stored userId:', currentUserId);
            storedGoogleFormUrl = submitData.googleFormUrl;

            UI.showInstructions(); // Show instructions UI

        } else {
            throw new Error(submitData.message || 'Unexpected response after submission.');
        }

    } catch (error) {
        console.error('Error during form submission process:', error);
        UI.showMessage(error.message || 'An unexpected error occurred during submission.');
        if (!isDisqualified) {
            updateSubmitButtonBasedOnValidation(); // Update button state
            if (submitButton) submitButton.textContent = 'Submit'; // Reset button text
        }
    }
}

function handleInstructionCheckboxChange() {
    if (isDisqualified) return;
    const instructionCheckbox = document.getElementById('instruction-checkbox');
    if (!instructionCheckbox) return;

    if (instructionCheckbox.checked) {
        console.log("Instructions confirmed.");
        UI.showGoogleForm(storedGoogleFormUrl); // Show Google Form UI
        isGoogleFormActive = true; // Set flag
        console.log("Google Form is now active. Tab switch monitoring enabled.");
        startTimer(timerDuration, () => { // Start timer and pass timeout handler
             handleDisqualification('<b>Your time is up!</b><br>Access to the form has been blocked.');
        });
    } else {
        // Optional: Handle unchecking?
    }
}

function handleWindowBlur() {
    console.log("--- Blur Event Start ---");
    if (!isGoogleFormActive || !currentUserId || isDisqualified) {
        console.log(`Blur ignored: isGoogleFormActive=${isGoogleFormActive}, currentUserId=${currentUserId}, isDisqualified=${isDisqualified}`);
        console.log("--- Blur Event End (Ignored) ---");
        return;
    }
    if (isShowingWarning) {
         console.log("Blur ignored: Warning alert likely still showing.");
         console.log("--- Blur Event End (Warning Active) ---");
         return;
    }

    tabSwitchWarnings++;
    localStorage.setItem('tabSwitchWarnings', tabSwitchWarnings.toString());
    console.log(`Window blurred. Warning count: ${tabSwitchWarnings}`);

    if (tabSwitchWarnings === 1) {
        console.log("Condition met: tabSwitchWarnings === 1");
        isShowingWarning = true;
        alert('Warning: You have switched tabs. This is your final warning. Switching again will block your access.');
        console.log("First tab switch warning issued via alert(). isShowingWarning set to true.");

    } else if (tabSwitchWarnings >= 2) {
        console.log("Condition met: tabSwitchWarnings >= 2");
        console.log("Second tab switch detected. Disqualifying user.");
        handleDisqualification('<b>Access Blocked!</b><br>You moved away from the page. Please refresh to try again.');

        // Notify the server
        fetch('/disqualify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: currentUserId })
         })
        .then(response => response.ok ? response.json() : response.json().then(err => Promise.reject(err)))
        .then(data => console.log('Server acknowledged final disqualification:', data.message))
        .catch(error => console.error('Error sending final disqualification update:', error.message || error));
    }
    console.log("--- Blur Event End ---");
}

function handleWindowFocus() {
    console.log("--- Focus Event Start ---");
    if (isDisqualified) {
        console.log("Focus: User is fully disqualified. Enforcing state.");
        handleDisqualification(); // Re-apply UI if needed
    } else if (isShowingWarning) {
        console.log("Focus: Returning after first warning alert (isShowingWarning is true).");
        isShowingWarning = false; // Reset flag
        console.log("isShowingWarning set to false.");
    } else {
        if (isGoogleFormActive) {
             console.log("Focus: Normal focus during active Google Form phase.");
        } else {
             console.log("Focus: Normal focus before Google Form phase.");
             // Update button state based on current validation errors
             updateSubmitButtonBasedOnValidation();
        }
    }
     console.log("--- Focus Event End ---");
}


// --- Initialization and Event Listeners ---

document.addEventListener('DOMContentLoaded', () => {
    // Get element references *after* DOM is loaded
    const form = document.getElementById('user-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone-number');
    const instructionCheckbox = document.getElementById('instruction-checkbox');

    // Initial state setup
    tabSwitchWarnings = parseInt(localStorage.getItem('tabSwitchWarnings') || '0');
    console.log(`Page loaded. Initial tab switch warnings: ${tabSwitchWarnings}`);

    resetApp(); // Reset UI and state on load

    // Re-check disqualification based on stored warning count *if* a user ID exists
    currentUserId = localStorage.getItem('userId'); // Re-get userId after reset potentially cleared it
    if (currentUserId && tabSwitchWarnings >= 2) {
         console.log("Disqualifying user on load due to previous warning count.");
         isDisqualified = true; // Manually set flag after reset
         handleDisqualification(); // Apply UI
    }
    else if (currentUserId) {
        console.log(`Page loaded with existing userId: ${currentUserId}. Status check might be needed.`);
    } else {
        console.log("Page loaded. No existing user ID found.");
    }

    // --- Attach Event Listeners (Updated) ---

    // Add guards for elements before adding listeners
    if (nameInput) {
        nameInput.addEventListener('blur', async () => {
            const result = await validateField('name', handleDisqualification);
            validationErrors.name = !result.isValid;
            UI.showInlineMessage('name', result.message);
            updateSubmitButtonBasedOnValidation();
        });
    }
    if (emailInput) {
        emailInput.addEventListener('blur', async () => {
            const result = await validateField('email', handleDisqualification);
            validationErrors.email = !result.isValid;
            UI.showInlineMessage('email', result.message);
            updateSubmitButtonBasedOnValidation();
        });
    }
    if (phoneInput) {
        phoneInput.addEventListener('blur', async () => {
            const result = await validateField('phone', handleDisqualification);
            validationErrors.phone = !result.isValid;
            UI.showInlineMessage('phone', result.message);
            updateSubmitButtonBasedOnValidation();
        });
    }
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
    if (instructionCheckbox) {
        instructionCheckbox.addEventListener('change', handleInstructionCheckboxChange);
    }

    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);

});
