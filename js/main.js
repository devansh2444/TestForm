// // js/main.js
// import * as UI from './ui.js'; // Import all UI functions
// import { startTimer, stopTimer } from './timer.js';
// import { validateField } from './validation.js';

// // --- State Variables ---
// let currentUserId = localStorage.getItem('userId');
// let isDisqualified = false;
// let storedGoogleFormUrl = '';
// let tabSwitchWarnings = parseInt(localStorage.getItem('tabSwitchWarnings') || '0');
// let isShowingWarning = false; // Flag for first warning alert
// let isGoogleFormActive = false; // Flag for Google Form phase
// const timerDuration = 10 * 60 * 1000; // 10 minutes

// // validationErrors object
// let validationErrors = { name: false, email: false, phone: false };

// // --- Core Logic Functions ---

// // function to update submit button state based on validationErrors
// function updateSubmitButtonBasedOnValidation() {
//     const hasErrors = Object.values(validationErrors).some(hasError => hasError);
//     UI.updateSubmitButtonState(isDisqualified || hasErrors);
// }


// function handleDisqualification(message = '<b>Access Blocked!</b><br>You moved away from the page. Please refresh to try again.') {
//     if (isDisqualified) return;
//     isDisqualified = true;
//     stopTimer(); // Use the imported function
//     UI.applyDisqualificationUI(message); // Use the imported function
//     localStorage.removeItem('tabSwitchWarnings');
//     isGoogleFormActive = false;
//     validationErrors = { name: true, email: true, phone: true }; // Mark all as invalid on disqualification
//     updateSubmitButtonBasedOnValidation(); // Update button state
//     console.log("User disqualified.");
// }

// function resetApp() {
//     stopTimer();
//     UI.resetUIElements(); // Use the imported function

//     // Reset state variables
//     currentUserId = null; // Clear user ID on full reset
//     localStorage.removeItem('userId');
//     isDisqualified = false;
//     storedGoogleFormUrl = '';
//     tabSwitchWarnings = 0;
//     localStorage.removeItem('tabSwitchWarnings');
//     isShowingWarning = false;
//     isGoogleFormActive = false;
//     validationErrors = { name: false, email: false, phone: false }; // Reset validation errors

//     // Update button state
//     updateSubmitButtonBasedOnValidation(); // Use the new function
// }

// async function handleFormSubmit(event) {
//     event.preventDefault();
//     UI.hideMessage();

//     if (isDisqualified) {
//         handleDisqualification(); // Re-show message if needed
//         return;
//     }

//     // Get references inside the handler to ensure they exist
//     const nameInput = document.getElementById('name');
//     const emailInput = document.getElementById('email');
//     const phoneInput = document.getElementById('phone-number');
//     if (!nameInput || !emailInput || !phoneInput) {
//         console.error("Form input elements not found!");
//         return;
//     }

//     // Perform all validations before submitting and update state
//     const nameResult = await validateField('name', handleDisqualification);
//     validationErrors.name = !nameResult.isValid;
//     UI.showInlineMessage('name', nameResult.message);

//     const emailResult = await validateField('email', handleDisqualification);
//     validationErrors.email = !emailResult.isValid;
//     UI.showInlineMessage('email', emailResult.message);

//     const phoneResult = await validateField('phone', handleDisqualification);
//     validationErrors.phone = !phoneResult.isValid;
//     UI.showInlineMessage('phone', phoneResult.message);

//     // Update button state based on the latest validation results
//     updateSubmitButtonBasedOnValidation();

//     // Check if any errors exist now
//     if (validationErrors.name || validationErrors.email || validationErrors.phone) {
//         UI.showMessage('Please fix the errors in the form before submitting.', 'error');
//         return;
//     }

//     // Get form data (assuming validation passed)
//     const name = nameInput.value.trim();
//     const email = emailInput.value.trim();
//     const phoneNumber = phoneInput.value.trim();

//     // Final check for empty fields (redundant if validation is robust, but safe)
//     if (!name || !email || !phoneNumber) {
//         UI.showMessage('Please fill in all fields.', 'error');
//         updateSubmitButtonBasedOnValidation();
//         return;
//     }

//     console.log("Submitting form...");
//     UI.updateSubmitButtonState(true); // Disable button during submit
//     const submitButton = document.getElementById('submit-button');
//     if (submitButton) submitButton.textContent = 'Submitting...';


//     try {
//         const submitResponse = await fetch('/submit', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ name, email, phoneNumber })
//         });
//         // Always try to parse JSON, even for errors
//         const submitData = await submitResponse.json().catch(() => ({})); // Default to empty object on parse error


//         if (!submitResponse.ok) {
//              if (submitResponse.status === 403) { handleDisqualification(submitData.message || 'Submission denied. Your session may have been closed.'); }
//              else if (submitResponse.status === 409) {
//                  UI.showMessage('User already exists with this email or phone number.', 'error');
//                  // Re-highlight fields and update state
//                  validationErrors.email = true; // Assume email/phone conflict
//                  validationErrors.phone = true;
//                  UI.showInlineMessage('email', 'Email or phone number may already exist.');
//                  UI.showInlineMessage('phone', 'Email or phone number may already exist.');
//              } else { throw new Error(submitData.message || `Error submitting form: Status ${submitResponse.status}`); }

//              if (!isDisqualified) {
//                  updateSubmitButtonBasedOnValidation(); // Update button state based on errors
//                  if (submitButton) submitButton.textContent = 'Submit'; // Reset button text
//              }
//              return;
//         }

//         // Handle successful submission
//         if (submitData.message === 'Form submitted successfully' && submitData.googleFormUrl) {
//             currentUserId = submitData.userId;
//             localStorage.setItem('userId', currentUserId);
//             console.log('Stored userId:', currentUserId);
//             storedGoogleFormUrl = submitData.googleFormUrl;

//             UI.showInstructions(); // Show instructions UI

//         } else {
//             throw new Error(submitData.message || 'Unexpected response after submission.');
//         }

//     } catch (error) {
//         console.error('Error during form submission process:', error);
//         UI.showMessage(error.message || 'An unexpected error occurred during submission.');
//         if (!isDisqualified) {
//             updateSubmitButtonBasedOnValidation(); // Update button state
//             if (submitButton) submitButton.textContent = 'Submit'; // Reset button text
//         }
//     }
// }

// function handleInstructionCheckboxChange() {
//     if (isDisqualified) return;
//     const instructionCheckbox = document.getElementById('instruction-checkbox');
//     if (!instructionCheckbox) return;

//     if (instructionCheckbox.checked) {
//         console.log("Instructions confirmed.");
//         UI.showGoogleForm(storedGoogleFormUrl); // Show Google Form UI
//         isGoogleFormActive = true; // Set flag
//         console.log("Google Form is now active. Tab switch monitoring enabled.");
//         startTimer(timerDuration, () => { // Start timer and pass timeout handler
//              handleDisqualification('<b>Your time is up!</b><br>Access to the form has been blocked.');
//         });
//     } else {
//         // Optional: Handle unchecking?
//     }
// }

// function handleWindowBlur() {
//     console.log("--- Blur Event Start ---");
//     if (!isGoogleFormActive || !currentUserId || isDisqualified) {
//         console.log(`Blur ignored: isGoogleFormActive=${isGoogleFormActive}, currentUserId=${currentUserId}, isDisqualified=${isDisqualified}`);
//         console.log("--- Blur Event End (Ignored) ---");
//         return;
//     }
//     if (isShowingWarning) {
//          console.log("Blur ignored: Warning alert likely still showing.");
//          console.log("--- Blur Event End (Warning Active) ---");
//          return;
//     }

//     tabSwitchWarnings++;
//     localStorage.setItem('tabSwitchWarnings', tabSwitchWarnings.toString());
//     console.log(`Window blurred. Warning count: ${tabSwitchWarnings}`);

//     if (tabSwitchWarnings === 1) {
//         console.log("Condition met: tabSwitchWarnings === 1");
//         isShowingWarning = true;
//         alert('Warning: You have switched tabs. This is your final warning. Switching again will block your access.');
//         console.log("First tab switch warning issued via alert(). isShowingWarning set to true.");

//     } else if (tabSwitchWarnings >= 2) {
//         console.log("Condition met: tabSwitchWarnings >= 2");
//         console.log("Second tab switch detected. Disqualifying user.");
//         handleDisqualification('<b>Access Blocked!</b><br>You moved away from the page. Please refresh to try again.');

//         // Notify the server
//         fetch('/disqualify', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ userId: currentUserId })
//          })
//         .then(response => response.ok ? response.json() : response.json().then(err => Promise.reject(err)))
//         .then(data => console.log('Server acknowledged final disqualification:', data.message))
//         .catch(error => console.error('Error sending final disqualification update:', error.message || error));
//     }
//     console.log("--- Blur Event End ---");
// }

// function handleWindowFocus() {
//     console.log("--- Focus Event Start ---");
//     if (isDisqualified) {
//         console.log("Focus: User is fully disqualified. Enforcing state.");
//         handleDisqualification(); // Re-apply UI if needed
//     } else if (isShowingWarning) {
//         console.log("Focus: Returning after first warning alert (isShowingWarning is true).");
//         isShowingWarning = false; // Reset flag
//         console.log("isShowingWarning set to false.");
//     } else {
//         if (isGoogleFormActive) {
//              console.log("Focus: Normal focus during active Google Form phase.");
//         } else {
//              console.log("Focus: Normal focus before Google Form phase.");
//              // Update button state based on current validation errors
//              updateSubmitButtonBasedOnValidation();
//         }
//     }
//      console.log("--- Focus Event End ---");
// }


// // --- Initialization and Event Listeners ---

// document.addEventListener('DOMContentLoaded', () => {
//     // Get element references *after* DOM is loaded
//     const form = document.getElementById('user-form');
//     const nameInput = document.getElementById('name');
//     const emailInput = document.getElementById('email');
//     const phoneInput = document.getElementById('phone-number');
//     const instructionCheckbox = document.getElementById('instruction-checkbox');

//     // Initial state setup
//     tabSwitchWarnings = parseInt(localStorage.getItem('tabSwitchWarnings') || '0');
//     console.log(`Page loaded. Initial tab switch warnings: ${tabSwitchWarnings}`);

//     resetApp(); // Reset UI and state on load

//     // Re-check disqualification based on stored warning count *if* a user ID exists
//     currentUserId = localStorage.getItem('userId'); // Re-get userId after reset potentially cleared it
//     if (currentUserId && tabSwitchWarnings >= 2) {
//          console.log("Disqualifying user on load due to previous warning count.");
//          isDisqualified = true; // Manually set flag after reset
//          handleDisqualification(); // Apply UI
//     }
//     else if (currentUserId) {
//         console.log(`Page loaded with existing userId: ${currentUserId}. Status check might be needed.`);
//     } else {
//         console.log("Page loaded. No existing user ID found.");
//     }

//     // --- Attach Event Listeners (Updated) ---

//     // Add guards for elements before adding listeners
//     if (nameInput) {
//         nameInput.addEventListener('blur', async () => {
//             const result = await validateField('name', handleDisqualification);
//             validationErrors.name = !result.isValid;
//             UI.showInlineMessage('name', result.message);
//             updateSubmitButtonBasedOnValidation();
//         });
//     }
//     if (emailInput) {
//         emailInput.addEventListener('blur', async () => {
//             const result = await validateField('email', handleDisqualification);
//             validationErrors.email = !result.isValid;
//             UI.showInlineMessage('email', result.message);
//             updateSubmitButtonBasedOnValidation();
//         });
//     }
//     if (phoneInput) {
//         phoneInput.addEventListener('blur', async () => {
//             const result = await validateField('phone', handleDisqualification);
//             validationErrors.phone = !result.isValid;
//             UI.showInlineMessage('phone', result.message);
//             updateSubmitButtonBasedOnValidation();
//         });
//     }
//     if (form) {
//         form.addEventListener('submit', handleFormSubmit);
//     }
//     if (instructionCheckbox) {
//         instructionCheckbox.addEventListener('change', handleInstructionCheckboxChange);
//     }

//     window.addEventListener('blur', handleWindowBlur);
//     window.addEventListener('focus', handleWindowFocus);

// });






// // js/main.js
// import * as UI from './ui.js'; // Import all UI functions
// import { startTimer, stopTimer } from './timer.js';
// import { validateField } from './validation.js';

// // --- State Variables ---
// let currentUserId = localStorage.getItem('userId');
// let isDisqualified = false;
// let storedGoogleFormUrl = '';
// let tabSwitchWarnings = parseInt(localStorage.getItem('tabSwitchWarnings') || '0');
// let isShowingWarning = false; // Flag represents if the first warning *logic* has been triggered
// let isGoogleFormActive = false; // Flag for Google Form phase
// const timerDuration = 10 * 60 * 1000; // 10 minutes
// let blurCheckTimeoutId = null; // To track the blur check timeout

// // validationErrors object
// let validationErrors = { name: false, email: false, phone: false };

// // --- Core Logic Functions ---

// // function to update submit button state based on validationErrors
// function updateSubmitButtonBasedOnValidation() {
//     const hasErrors = Object.values(validationErrors).some(hasError => hasError);
//     UI.updateSubmitButtonState(isDisqualified || hasErrors);
// }


// function handleDisqualification(message = '<b>Access Blocked!</b><br>You moved away from the page. Please refresh to try again.') {
//     if (isDisqualified) return;
//     isDisqualified = true;
//     stopTimer(); // Use the imported function
//     UI.applyDisqualificationUI(message); // Use the imported function
//     localStorage.removeItem('tabSwitchWarnings'); // Clear warnings on final disqualification
//     isGoogleFormActive = false;
//     validationErrors = { name: true, email: true, phone: true }; // Mark all as invalid on disqualification
//     updateSubmitButtonBasedOnValidation(); // Update button state
//     console.log("User disqualified.");

//     // Optional: Clear pending blur check if disqualification happens for other reasons (like timer)
//     if (blurCheckTimeoutId) {
//         clearTimeout(blurCheckTimeoutId);
//         blurCheckTimeoutId = null;
//     }
// }

// function resetApp() {
//     stopTimer();
//     UI.resetUIElements(); // Use the imported function

//     // Reset state variables
//     currentUserId = null; // Clear user ID on full reset
//     localStorage.removeItem('userId');
//     isDisqualified = false;
//     storedGoogleFormUrl = '';
//     tabSwitchWarnings = 0;
//     localStorage.removeItem('tabSwitchWarnings');
//     isShowingWarning = false;
//     isGoogleFormActive = false;
//     validationErrors = { name: false, email: false, phone: false }; // Reset validation errors

//     // Update button state
//     updateSubmitButtonBasedOnValidation(); // Use the new function
// }

// async function handleFormSubmit(event) {
//     event.preventDefault();
//     UI.hideMessage();

//     if (isDisqualified) {
//         handleDisqualification(); // Re-show message if needed
//         return;
//     }

//     // Get references inside the handler to ensure they exist
//     const nameInput = document.getElementById('name');
//     const emailInput = document.getElementById('email');
//     const phoneInput = document.getElementById('phone-number');
//     if (!nameInput || !emailInput || !phoneInput) {
//         console.error("Form input elements not found!");
//         return;
//     }

//     // Perform all validations before submitting and update state
//     const nameResult = await validateField('name', handleDisqualification);
//     validationErrors.name = !nameResult.isValid;
//     UI.showInlineMessage('name', nameResult.message);

//     const emailResult = await validateField('email', handleDisqualification);
//     validationErrors.email = !emailResult.isValid;
//     UI.showInlineMessage('email', emailResult.message);

//     const phoneResult = await validateField('phone', handleDisqualification);
//     validationErrors.phone = !phoneResult.isValid;
//     UI.showInlineMessage('phone', phoneResult.message);

//     // Update button state based on the latest validation results
//     updateSubmitButtonBasedOnValidation();

//     // Check if any errors exist now
//     if (validationErrors.name || validationErrors.email || validationErrors.phone) {
//         UI.showMessage('Please fix the errors in the form before submitting.', 'error');
//         return;
//     }

//     // Get form data (assuming validation passed)
//     const name = nameInput.value.trim();
//     const email = emailInput.value.trim();
//     const phoneNumber = phoneInput.value.trim();

//     // Final check for empty fields (redundant if validation is robust, but safe)
//     if (!name || !email || !phoneNumber) {
//         UI.showMessage('Please fill in all fields.', 'error');
//         updateSubmitButtonBasedOnValidation();
//         return;
//     }

//     console.log("Submitting form...");
//     UI.updateSubmitButtonState(true); // Disable button during submit
//     const submitButton = document.getElementById('submit-button');
//     if (submitButton) submitButton.textContent = 'Submitting...';


//     try {
//         const submitResponse = await fetch('/submit', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ name, email, phoneNumber })
//         });
//         // Always try to parse JSON, even for errors
//         const submitData = await submitResponse.json().catch(() => ({})); // Default to empty object on parse error


//         if (!submitResponse.ok) {
//              if (submitResponse.status === 403) { handleDisqualification(submitData.message || 'Submission denied. Your session may have been closed.'); }
//              else if (submitResponse.status === 409) {
//                  UI.showMessage('User already exists with this email or phone number.', 'error');
//                  // Re-highlight fields and update state
//                  validationErrors.email = true; // Assume email/phone conflict
//                  validationErrors.phone = true;
//                  UI.showInlineMessage('email', 'Email or phone number may already exist.');
//                  UI.showInlineMessage('phone', 'Email or phone number may already exist.');
//              } else { throw new Error(submitData.message || `Error submitting form: Status ${submitResponse.status}`); }

//              if (!isDisqualified) {
//                  updateSubmitButtonBasedOnValidation(); // Update button state based on errors
//                  if (submitButton) submitButton.textContent = 'Submit'; // Reset button text
//              }
//              return;
//         }

//         // Handle successful submission
//         if (submitData.message === 'Form submitted successfully' && submitData.googleFormUrl) {
//             currentUserId = submitData.userId; // <<< SET USER ID HERE
//             localStorage.setItem('userId', currentUserId);
//             console.log('Stored userId:', currentUserId);
//             storedGoogleFormUrl = submitData.googleFormUrl;

//             // Tab switch monitoring will now be active because currentUserId is set
//             console.log("Initial form submitted. Tab switch monitoring is now active.");

//             UI.showInstructions(); // Show instructions UI

//         } else {
//             throw new Error(submitData.message || 'Unexpected response after submission.');
//         }

//     } catch (error) {
//         console.error('Error during form submission process:', error);
//         UI.showMessage(error.message || 'An unexpected error occurred during submission.');
//         if (!isDisqualified) {
//             updateSubmitButtonBasedOnValidation(); // Update button state
//             if (submitButton) submitButton.textContent = 'Submit'; // Reset button text
//         }
//     }
// }

// function handleInstructionCheckboxChange() {
//     if (isDisqualified) return;
//     const instructionCheckbox = document.getElementById('instruction-checkbox');
//     if (!instructionCheckbox) return;

//     if (instructionCheckbox.checked) {
//         console.log("Instructions confirmed.");
//         UI.showGoogleForm(storedGoogleFormUrl); // Show Google Form UI
//         isGoogleFormActive = true; // Set flag specifically for iframe phase
//         console.log("Google Form is now active (iframe phase).");
//         startTimer(timerDuration, () => { // Start timer and pass timeout handler
//              handleDisqualification('<b>Your time is up!</b><br>Access to the form has been blocked.');
//         });
//     } else {
//         // Optional: Handle unchecking?
//         // If unchecking should pause the timer or re-enable something, add logic here.
//     }
// }

// // === CORRECTED Blur/Focus Handlers ===

// function handleWindowBlur() {
//     console.log("--- Blur Event Start ---");
//     // Run if a user session is active (initial form submitted) AND not disqualified
//     // REMOVED the !isGoogleFormActive check
//     if (!currentUserId || isDisqualified) {
//         console.log(`Blur ignored: currentUserId=${currentUserId}, isDisqualified=${isDisqualified}`);
//         console.log("--- Blur Event End (Ignored) ---");
//         return;
//     }

//     // Clear any previous pending check (if blur/focus happens rapidly)
//     if (blurCheckTimeoutId) {
//         clearTimeout(blurCheckTimeoutId);
//         console.log("Blur: Cleared previous pending check.");
//     }

//     // *** DELAY THE ACTUAL VIOLATION CHECK ***
//     console.log("Blur: Scheduling violation check.");
//     blurCheckTimeoutId = setTimeout(() => {
//         blurCheckTimeoutId = null; // Clear the ID as the timeout is now running

//         // *** The CORE Check: Did the window lose focus and STAY unfocused? ***
//         if (!document.hasFocus()) {
//              // Focus has definitely left the browser window/tab. THIS IS A VIOLATION.
//              console.log("Blur Check Timeout: Violation confirmed (!document.hasFocus()).");

//              // --- Proceed with warning/disqualification logic ---
//              if (isShowingWarning) {
//                  // This flag indicates the first warning *logic* was triggered.
//                  // If we get another blur while this is true, it means the user ignored the alert
//                  // or switched again after dismissing it. We shouldn't re-alert,
//                  // but the next violation (tabSwitchWarnings >= 2) should still disqualify.
//                  console.log("Blur Check Timeout: First warning logic was active. Proceeding to count violation.");
//                  // No 'return' here, let the count proceed.
//              }

//              tabSwitchWarnings++;
//              localStorage.setItem('tabSwitchWarnings', tabSwitchWarnings.toString());
//              console.log(`Violation count incremented: ${tabSwitchWarnings}`);

//              if (tabSwitchWarnings === 1) {
//                  console.log("Violation Count = 1: Triggering first warning.");
//                  isShowingWarning = true; // Set flag *before* alert
//                  try {
//                     // Use a non-blocking way to show the warning if possible, but alert is simple
//                     alert('Warning: You have switched tabs or minimized the window. This is your final warning. Doing so again will block your access.');
//                  } catch (e) {
//                     console.error("Failed to show alert:", e);
//                     // Fallback: Show message in UI?
//                     UI.showMessage('Warning: You have switched tabs or minimized the window. This is your final warning.', 'warning');
//                  }
//                  // NOTE: alert() blocks execution.
//                  console.log("First warning alert shown (or attempted). isShowingWarning remains true.");
//                  // isShowingWarning is reset on FOCUS.

//              } else if (tabSwitchWarnings >= 2) {
//                  console.log("Violation Count >= 2: Triggering disqualification.");
//                  // Ensure disqualification happens even if the alert from the first warning is somehow bypassed/fails
//                  handleDisqualification('<b>Access Blocked!</b><br>You moved away from the page more than once.'); // Disqualify fully

//                  // Notify the server about the final disqualification
//                  fetch('/disqualify', {
//                      method: 'POST',
//                      headers: { 'Content-Type': 'application/json' },
//                      body: JSON.stringify({ userId: currentUserId })
//                   })
//                  .then(response => response.ok ? response.json() : response.json().then(err => Promise.reject(err)))
//                  .then(data => console.log('Server acknowledged final disqualification:', data.message))
//                  .catch(error => console.error('Error sending final disqualification update:', error.message || error));
//              }
//              // --- End warning/disqualification logic ---

//         } else {
//             // Document has focus. This means focus either returned quickly
//             // or moved within the page (e.g., to the iframe). NOT a violation.
//             console.log("Blur Check Timeout: Document has focus. No violation.");
//             // Optional: Log if focus is on iframe specifically during the active form phase
//             if (isGoogleFormActive) {
//                 const googleFormContainer = document.getElementById('google-form-container');
//                 const googleIframe = googleFormContainer ? googleFormContainer.querySelector('iframe') : null;
//                 if (googleIframe && document.activeElement === googleIframe) {
//                     console.log("Blur Check Timeout: Focus is on the iframe (allowed).");
//                 }
//             }
//         }
//         console.log("--- Blur Check Timeout End ---");

//     }, 300); // Wait 300ms. Adjust if needed, but keep it short.

//     console.log("--- Blur Event End (Timeout Scheduled) ---");
// }

// function handleWindowFocus() {
//     console.log("--- Focus Event Start ---");

//     // *** Clear any pending blur check timeout ***
//     // This prevents a violation from being registered if focus returns quickly.
//     if (blurCheckTimeoutId) {
//         clearTimeout(blurCheckTimeoutId);
//         blurCheckTimeoutId = null;
//         console.log("Focus: Cleared pending blur check timeout.");
//     }

//     // Handle the focus event based on current state
//     if (isDisqualified) {
//         console.log("Focus: User is already disqualified. Enforcing state.");
//         // Re-applying disqualification UI might be redundant, just log.
//     } else if (isShowingWarning) {
//         // This means the user is returning focus *after* the first warning logic was triggered (alert shown).
//         console.log("Focus: Returning after first warning alert logic was triggered (isShowingWarning is true).");
//         // Reset the flag. The next confirmed blur will lead to disqualification.
//         isShowingWarning = false;
//         console.log("isShowingWarning reset to false.");
//     } else {
//         // Normal focus event, no warning logic was active
//         console.log("Focus: Normal focus event.");
//         // No specific action needed here usually, maybe update UI if needed
//         // if (!isGoogleFormActive) {
//         //      updateSubmitButtonBasedOnValidation();
//         // }
//     }
//      console.log("--- Focus Event End ---");
// }


// // --- Initialization and Event Listeners ---

// document.addEventListener('DOMContentLoaded', () => {
//     // Get element references *after* DOM is loaded
//     const form = document.getElementById('user-form');
//     const nameInput = document.getElementById('name');
//     const emailInput = document.getElementById('email');
//     const phoneInput = document.getElementById('phone-number');
//     const instructionCheckbox = document.getElementById('instruction-checkbox');

//     // Initial state setup
//     tabSwitchWarnings = parseInt(localStorage.getItem('tabSwitchWarnings') || '0');
//     console.log(`Page loaded. Initial tab switch warnings: ${tabSwitchWarnings}`);

//     resetApp(); // Reset UI and state on load

//     // Re-check disqualification based on stored warning count *if* a user ID exists
//     currentUserId = localStorage.getItem('userId'); // Re-get userId after reset potentially cleared it
//     if (currentUserId && tabSwitchWarnings >= 2) {
//          console.log("Disqualifying user on load due to previous warning count.");
//          isDisqualified = true; // Manually set flag after reset
//          handleDisqualification(); // Apply UI
//     }
//     else if (currentUserId) {
//         // If user reloads page after submitting initial form but before finishing
//         console.log(`Page loaded with existing userId: ${currentUserId}. Tab switch monitoring is active.`);
//         // Potentially need to fetch user status from server here to ensure they weren't disqualified elsewhere
//     } else {
//         console.log("Page loaded. No existing user ID found. Tab switch monitoring inactive.");
//     }

//     // --- Attach Event Listeners (Updated) ---

//     // Add guards for elements before adding listeners
//     if (nameInput) {
//         nameInput.addEventListener('blur', async () => {
//             if (isDisqualified) return; // Don't validate if already disqualified
//             const result = await validateField('name', handleDisqualification);
//             validationErrors.name = !result.isValid;
//             UI.showInlineMessage('name', result.message);
//             updateSubmitButtonBasedOnValidation();
//         });
//     }
//     if (emailInput) {
//         emailInput.addEventListener('blur', async () => {
//             if (isDisqualified) return;
//             const result = await validateField('email', handleDisqualification);
//             validationErrors.email = !result.isValid;
//             UI.showInlineMessage('email', result.message);
//             updateSubmitButtonBasedOnValidation();
//         });
//     }
//     if (phoneInput) {
//         phoneInput.addEventListener('blur', async () => {
//             if (isDisqualified) return;
//             const result = await validateField('phone', handleDisqualification);
//             validationErrors.phone = !result.isValid;
//             UI.showInlineMessage('phone', result.message);
//             updateSubmitButtonBasedOnValidation();
//         });
//     }
//     if (form) {
//         form.addEventListener('submit', handleFormSubmit);
//     }
//     if (instructionCheckbox) {
//         instructionCheckbox.addEventListener('change', handleInstructionCheckboxChange);
//     }

//     // Attach the corrected blur/focus handlers
//     window.addEventListener('blur', handleWindowBlur);
//     window.addEventListener('focus', handleWindowFocus);

// });





// // js/main.js
// import * as UI from './ui.js'; // Import all UI functions
// import { startTimer, stopTimer } from './timer.js';
// import { validateField } from './validation.js';

// // --- State Variables ---
// let currentUserId = localStorage.getItem('userId');
// let isDisqualified = false;
// let storedGoogleFormUrl = '';
// let tabSwitchWarnings = parseInt(localStorage.getItem('tabSwitchWarnings') || '0');
// // 'isShowingWarning' flag is less critical with Visibility API as the state change is the trigger
// let isGoogleFormActive = false; // Flag for Google Form phase (still useful context)
// const timerDuration = 10 * 60 * 1000; // 10 minutes

// // validationErrors object
// let validationErrors = { name: false, email: false, phone: false };

// // --- Core Logic Functions ---

// // function to update submit button state based on validationErrors
// function updateSubmitButtonBasedOnValidation() {
//     const hasErrors = Object.values(validationErrors).some(hasError => hasError);
//     UI.updateSubmitButtonState(isDisqualified || hasErrors);
// }


// function handleDisqualification(message = '<b>Access Blocked!</b><br>You moved away from the page. Please refresh to try again.') {
//     if (isDisqualified) return;
//     isDisqualified = true;
//     stopTimer(); // Use the imported function
//     UI.applyDisqualificationUI(message); // Use the imported function
//     localStorage.removeItem('tabSwitchWarnings'); // Clear warnings on final disqualification
//     isGoogleFormActive = false;
//     validationErrors = { name: true, email: true, phone: true }; // Mark all as invalid on disqualification
//     updateSubmitButtonBasedOnValidation(); // Update button state
//     console.log("User disqualified.");
// }

// function resetApp() {
//     stopTimer();
//     UI.resetUIElements(); // Use the imported function

//     // Reset state variables
//     currentUserId = null; // Clear user ID on full reset
//     localStorage.removeItem('userId');
//     isDisqualified = false;
//     storedGoogleFormUrl = '';
//     tabSwitchWarnings = 0;
//     localStorage.removeItem('tabSwitchWarnings');
//     isGoogleFormActive = false;
//     validationErrors = { name: false, email: false, phone: false }; // Reset validation errors

//     // Update button state
//     updateSubmitButtonBasedOnValidation(); // Use the new function
// }

// async function handleFormSubmit(event) {
//     event.preventDefault();
//     UI.hideMessage();

//     if (isDisqualified) {
//         handleDisqualification(); // Re-show message if needed
//         return;
//     }

//     // Get references inside the handler to ensure they exist
//     const nameInput = document.getElementById('name');
//     const emailInput = document.getElementById('email');
//     const phoneInput = document.getElementById('phone-number');
//     if (!nameInput || !emailInput || !phoneInput) {
//         console.error("Form input elements not found!");
//         return;
//     }

//     // Perform all validations before submitting and update state
//     const nameResult = await validateField('name', handleDisqualification);
//     validationErrors.name = !nameResult.isValid;
//     UI.showInlineMessage('name', nameResult.message);

//     const emailResult = await validateField('email', handleDisqualification);
//     validationErrors.email = !emailResult.isValid;
//     UI.showInlineMessage('email', emailResult.message);

//     const phoneResult = await validateField('phone', handleDisqualification);
//     validationErrors.phone = !phoneResult.isValid;
//     UI.showInlineMessage('phone', phoneResult.message);

//     // Update button state based on the latest validation results
//     updateSubmitButtonBasedOnValidation();

//     // Check if any errors exist now
//     if (validationErrors.name || validationErrors.email || validationErrors.phone) {
//         UI.showMessage('Please fix the errors in the form before submitting.', 'error');
//         return;
//     }

//     // Get form data (assuming validation passed)
//     const name = nameInput.value.trim();
//     const email = emailInput.value.trim();
//     const phoneNumber = phoneInput.value.trim();

//     // Final check for empty fields (redundant if validation is robust, but safe)
//     if (!name || !email || !phoneNumber) {
//         UI.showMessage('Please fill in all fields.', 'error');
//         updateSubmitButtonBasedOnValidation();
//         return;
//     }

//     console.log("Submitting form...");
//     UI.updateSubmitButtonState(true); // Disable button during submit
//     const submitButton = document.getElementById('submit-button');
//     if (submitButton) submitButton.textContent = 'Submitting...';


//     try {
//         const submitResponse = await fetch('/submit', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ name, email, phoneNumber })
//         });
//         // Always try to parse JSON, even for errors
//         const submitData = await submitResponse.json().catch(() => ({})); // Default to empty object on parse error


//         if (!submitResponse.ok) {
//              if (submitResponse.status === 403) { handleDisqualification(submitData.message || 'Submission denied. Your session may have been closed.'); }
//              else if (submitResponse.status === 409) {
//                  UI.showMessage('User already exists with this email or phone number.', 'error');
//                  // Re-highlight fields and update state
//                  validationErrors.email = true; // Assume email/phone conflict
//                  validationErrors.phone = true;
//                  UI.showInlineMessage('email', 'Email or phone number may already exist.');
//                  UI.showInlineMessage('phone', 'Email or phone number may already exist.');
//              } else { throw new Error(submitData.message || `Error submitting form: Status ${submitResponse.status}`); }

//              if (!isDisqualified) {
//                  updateSubmitButtonBasedOnValidation(); // Update button state based on errors
//                  if (submitButton) submitButton.textContent = 'Submit'; // Reset button text
//              }
//              return;
//         }

//         // Handle successful submission
//         if (submitData.message === 'Form submitted successfully' && submitData.googleFormUrl) {
//             currentUserId = submitData.userId; // <<< SET USER ID HERE
//             localStorage.setItem('userId', currentUserId);
//             console.log('Stored userId:', currentUserId);
//             storedGoogleFormUrl = submitData.googleFormUrl;

//             // Tab switch monitoring will now be active because currentUserId is set
//             console.log("Initial form submitted. Tab switch monitoring is now active via Visibility API.");

//             UI.showInstructions(); // Show instructions UI

//         } else {
//             throw new Error(submitData.message || 'Unexpected response after submission.');
//         }

//     } catch (error) {
//         console.error('Error during form submission process:', error);
//         UI.showMessage(error.message || 'An unexpected error occurred during submission.');
//         if (!isDisqualified) {
//             updateSubmitButtonBasedOnValidation(); // Update button state
//             if (submitButton) submitButton.textContent = 'Submit'; // Reset button text
//         }
//     }
// }

// function handleInstructionCheckboxChange() {
//     if (isDisqualified) return;
//     const instructionCheckbox = document.getElementById('instruction-checkbox');
//     if (!instructionCheckbox) return;

//     if (instructionCheckbox.checked) {
//         console.log("Instructions confirmed.");
//         UI.showGoogleForm(storedGoogleFormUrl); // Show Google Form UI
//         isGoogleFormActive = true; // Set flag specifically for iframe phase
//         console.log("Google Form is now active (iframe phase).");
//         startTimer(timerDuration, () => { // Start timer and pass timeout handler
//              handleDisqualification('<b>Your time is up!</b><br>Access to the form has been blocked.');
//         });
//     } else {
//         // Optional: Handle unchecking?
//     }
// }





// // === Page Visibility API Handler ===
// function handleVisibilityChange() {
//     // Run only if a user session is active (initial form submitted) AND not disqualified
//     if (!currentUserId || isDisqualified) {
//         // Log why it's ignored, but only if a user session was expected to be active
//         if (currentUserId && !isDisqualified) {
//              console.log(`Visibility change ignored: currentUserId=${currentUserId}, isDisqualified=${isDisqualified}`);
//         }
//         return;
//     }

//     // Check the visibility state
//     if (document.visibilityState === 'hidden') {
//         // Page is hidden (tab switch, minimize, etc.) - THIS IS A VIOLATION
//         console.log("Visibility Change: Page hidden. Violation detected.");

//         // Increment warnings immediately
//         // Read the latest count from localStorage to ensure accuracy if multiple events fire quickly (though unlikely)
//         let currentWarnings = parseInt(localStorage.getItem('tabSwitchWarnings') || '0');
//         currentWarnings++;
//         tabSwitchWarnings = currentWarnings; // Update state variable too
//         localStorage.setItem('tabSwitchWarnings', tabSwitchWarnings.toString());
//         console.log(`Violation count incremented: ${tabSwitchWarnings}`);

//         if (tabSwitchWarnings === 1) {
//             console.log("Violation Count = 1: Triggering first warning.");
//             try {
//                 // Alert blocks execution, ensuring the user sees it.
//                 alert('Warning: You have switched tabs or minimized the window. This is your final warning. Doing so again will block your access.');
//                 console.log("First warning alert shown.");
//             } catch (e) {
//                 console.error("Failed to show alert:", e);
//                 UI.showMessage('Warning: You have switched tabs or minimized the window. This is your final warning.', 'warning');
//             }
//         } else if (tabSwitchWarnings >= 2) {
//             console.log("Violation Count >= 2: Triggering disqualification.");
//             // Disqualify immediately
//             handleDisqualification('<b>Access Blocked!</b><br>You moved away from the page more than once.');

//             // Notify the server
//             fetch('/disqualify', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ userId: currentUserId })
//              })
//             .then(response => response.ok ? response.json() : response.json().then(err => Promise.reject(err)))
//             .then(data => console.log('Server acknowledged final disqualification:', data.message))
//             .catch(error => console.error('Error sending final disqualification update:', error.message || error));
//         }
//     } else if (document.visibilityState === 'visible') {
//         // Page is visible again
//         console.log("Visibility Change: Page visible.");
//         // No action needed here for the warning logic itself.
//         // If the user was disqualified while hidden, the isDisqualified flag handles it.
//     }
// }


// // --- Initialization and Event Listeners ---

// document.addEventListener('DOMContentLoaded', () => {
//     // Get element references *after* DOM is loaded
//     const form = document.getElementById('user-form');
//     const nameInput = document.getElementById('name');
//     const emailInput = document.getElementById('email');
//     const phoneInput = document.getElementById('phone-number');
//     const instructionCheckbox = document.getElementById('instruction-checkbox');

//     // Initial state setup
//     tabSwitchWarnings = parseInt(localStorage.getItem('tabSwitchWarnings') || '0');
//     console.log(`Page loaded. Initial tab switch warnings: ${tabSwitchWarnings}`);

//     resetApp(); // Reset UI and state on load

//     // Re-check disqualification based on stored warning count *if* a user ID exists
//     currentUserId = localStorage.getItem('userId'); // Re-get userId after reset potentially cleared it
//     if (currentUserId && tabSwitchWarnings >= 2) {
//          console.log("Disqualifying user on load due to previous warning count.");
//          isDisqualified = true; // Manually set flag after reset
//          handleDisqualification(); // Apply UI
//     }
//     else if (currentUserId) {
//         // If user reloads page after submitting initial form but before finishing
//         console.log(`Page loaded with existing userId: ${currentUserId}. Tab switch monitoring is active via Visibility API.`);
//         // Potentially need to fetch user status from server here to ensure they weren't disqualified elsewhere
//     } else {
//         console.log("Page loaded. No existing user ID found. Tab switch monitoring inactive.");
//     }

//     // --- Attach Event Listeners ---

//     // Add guards for elements before adding listeners
//     if (nameInput) {
//         nameInput.addEventListener('blur', async () => {
//             if (isDisqualified) return; // Don't validate if already disqualified
//             const result = await validateField('name', handleDisqualification);
//             validationErrors.name = !result.isValid;
//             UI.showInlineMessage('name', result.message);
//             updateSubmitButtonBasedOnValidation();
//         });
//     }
//     if (emailInput) {
//         emailInput.addEventListener('blur', async () => {
//             if (isDisqualified) return;
//             const result = await validateField('email', handleDisqualification);
//             validationErrors.email = !result.isValid;
//             UI.showInlineMessage('email', result.message);
//             updateSubmitButtonBasedOnValidation();
//         });
//     }
//     if (phoneInput) {
//         phoneInput.addEventListener('blur', async () => {
//             if (isDisqualified) return;
//             const result = await validateField('phone', handleDisqualification);
//             validationErrors.phone = !result.isValid;
//             UI.showInlineMessage('phone', result.message);
//             updateSubmitButtonBasedOnValidation();
//         });
//     }
//     if (form) {
//         form.addEventListener('submit', handleFormSubmit);
//     }
//     if (instructionCheckbox) {
//         instructionCheckbox.addEventListener('change', handleInstructionCheckboxChange);
//     }

//     // Attach Page Visibility listener
//     document.addEventListener('visibilitychange', handleVisibilityChange);
//     console.log("Attached visibilitychange listener.");

// });

// js/main.js
import * as UI from './ui.js'; // Import all UI functions
import { startTimer, stopTimer } from './timer.js';
import { validateField } from './validation.js';

// --- State Variables ---
let currentUserId = localStorage.getItem('userId');
let isDisqualified = false;
let storedGoogleFormUrl = '';
let tabSwitchWarnings = parseInt(localStorage.getItem('tabSwitchWarnings') || '0'); // For Violation Detection
let isGoogleFormActive = false; // Flag for Google Form phase
const timerDuration = 10 * 60 * 1000; // 10 minutes
let violationCheckInProgress = false; // Flag to prevent rapid double triggers
let isPermissionPromptActive = false; // Flag for getDisplayMedia prompt

// --- Screen Capture State (Once Per Session) ---
let activeScreenStream = null;
let activeScreenTrack = null;
let activeImageCapture = null;
let screenCaptureIntervalId = null; // For periodic screen capture
const screenCaptureInterval = 2 * 60 * 1000; // 2 minutes

// validationErrors object
let validationErrors = { name: false, email: false, phone: false };

// --- Core Logic Functions ---

// function to update submit button state based on validationErrors
function updateSubmitButtonBasedOnValidation() {
    const hasErrors = Object.values(validationErrors).some(hasError => hasError);
    UI.updateSubmitButtonState(isDisqualified || hasErrors);
}


function handleDisqualification(message = '<b>Access Blocked!</b><br>Please refresh to try again.') {
    if (isDisqualified) return;
    isDisqualified = true;
    violationCheckInProgress = false; // Ensure flag is reset
    isPermissionPromptActive = false; // Ensure prompt flag is reset
    stopTimer(); // Use the imported function
    stopScreenCapture(); // Stop screen capture on disqualification
    UI.applyDisqualificationUI(message); // Use the imported function
    localStorage.removeItem('tabSwitchWarnings'); // Clear warnings on final disqualification
    isGoogleFormActive = false;
    validationErrors = { name: true, email: true, phone: true }; // Mark all as invalid on disqualification
    updateSubmitButtonBasedOnValidation(); // Update button state
    console.log("User disqualified.");
}

function resetApp() {
    stopTimer();
    stopScreenCapture(); // Ensure capture stops on reset
    UI.resetUIElements(); // Use the imported function

    // Reset state variables
    currentUserId = null; // Clear user ID on full reset
    localStorage.removeItem('userId');
    isDisqualified = false;
    storedGoogleFormUrl = '';
    tabSwitchWarnings = 0;
    localStorage.removeItem('tabSwitchWarnings');
    isGoogleFormActive = false;
    violationCheckInProgress = false;
    isPermissionPromptActive = false; // <<< Reset prompt flag
    validationErrors = { name: false, email: false, phone: false }; // Reset validation errors

    // Update button state
    updateSubmitButtonBasedOnValidation(); // Use the new function
}

async function handleFormSubmit(event) {
    event.preventDefault();
    UI.hideMessage(); // Hide any previous messages on new submit

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
            currentUserId = submitData.userId; // <<< SET USER ID HERE
            localStorage.setItem('userId', currentUserId);
            console.log('Stored userId:', currentUserId);
            storedGoogleFormUrl = submitData.googleFormUrl;

            // Tab switch monitoring will now be active because currentUserId is set
            console.log("Initial form submitted. Monitoring active.");

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

async function handleInstructionCheckboxChange() { // Made async
    if (isDisqualified) return;
    const instructionCheckbox = document.getElementById('instruction-checkbox');
    if (!instructionCheckbox) return;

    if (instructionCheckbox.checked) {
        console.log("Instructions confirmed.");
        UI.hideMessage(); // Hide any previous messages before asking permission

        // Attempt to start screen capture FIRST
        const captureStarted = await startScreenCapture(); // Wait for permission result

        if (captureStarted) {
            // If permission granted and capture started successfully:
            UI.showGoogleForm(storedGoogleFormUrl); // Show Google Form UI
            isGoogleFormActive = true; // Set flag specifically for iframe phase
            console.log("Google Form is now active (iframe phase).");
            startTimer(timerDuration, () => { // Start timer and pass timeout handler
                 handleDisqualification('<b>Your time is up!</b><br>Access to the form has been blocked.');
            });
        } else {
            // If permission denied or error occurred during startScreenCapture
            console.log("Screen capture failed to start. Cannot proceed.");
            // Uncheck the box as the process cannot continue without capture
            instructionCheckbox.checked = false;
            // The error message is now shown (and timed out) within startScreenCapture
        }

    } else {
        // Optional: Handle unchecking? Stop timer/capture?
        // stopTimer();
        // stopScreenCapture();
    }
}

// === Screen Capture Functions (getDisplayMedia - Once Per Session) ===

async function grabFrameAndSend() {
    if (!activeImageCapture || !currentUserId || isDisqualified) {
        console.log("[Capture Interval] Skipping frame grab: No active capture/user or disqualified.");
        if (!activeImageCapture && screenCaptureIntervalId) stopScreenCapture(); // Stop interval if capture died
        return;
    }
    console.log("[Capture Interval] Grabbing frame...");
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    try {
        const imageBitmap = await activeImageCapture.grabFrame();
        tempCanvas.width = imageBitmap.width;
        tempCanvas.height = imageBitmap.height;
        tempCtx.drawImage(imageBitmap, 0, 0);
        const imageDataUrl = tempCanvas.toDataURL('image/png');

        // Send data to server
        console.log("[Capture Interval] Sending image data to server...");
        const response = await fetch('/upload-screen-capture', { // Use the correct endpoint
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                imageData: imageDataUrl,
                userId: currentUserId,
                timestamp: Date.now()
            })
        });

         if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('[Capture Interval] Error sending screen capture to server:', errorData.message || response.status);
        } else {
            console.log('[Capture Interval] Frame sent successfully.');
        }

    } catch (error) {
        console.error("[Capture Interval] Error grabbing/sending frame:", error);
        // If error occurs, maybe the stream ended? Stop the interval.
        stopScreenCapture();
        // Potentially disqualify if the error indicates stream ended unexpectedly
        if (!isDisqualified) { // Avoid double disqualification message
             handleDisqualification("Screen sharing stopped unexpectedly. Please refresh.");
        }
    } finally {
        tempCanvas.width = 0; tempCanvas.height = 0;
    }
}

async function startScreenCapture() {
    // Returns true if successful, false otherwise
    stopScreenCapture(); // Clear previous state first
    if (!currentUserId || isDisqualified) return false;

    console.log("[Capture] Requesting screen capture permission...");
    isPermissionPromptActive = true; // <<< SET FLAG before calling getDisplayMedia
    try {
        activeScreenStream = await navigator.mediaDevices.getDisplayMedia({
            video: { cursor: "never" }, audio: false
        });
        // If promise resolves, permission was granted (or previously granted)
        isPermissionPromptActive = false; // <<< CLEAR FLAG after prompt interaction

        activeScreenTrack = activeScreenStream.getVideoTracks()[0];
        activeImageCapture = new ImageCapture(activeScreenTrack);

        // IMPORTANT: Handle user stopping sharing manually via browser UI
        activeScreenTrack.onended = () => {
            console.warn("[Capture] Screen sharing track ended (likely stopped by user or stream ended).");
            stopScreenCapture(); // Clean up interval and state
            if (!isDisqualified) { // Only disqualify if not already done
                handleDisqualification("Screen sharing was stopped. Access blocked.");
            }
        };

        console.log("[Capture] Permission granted. Starting periodic capture.");
        // Capture first frame slightly delayed, then interval
        setTimeout(grabFrameAndSend, 500); // Initial capture
        screenCaptureIntervalId = setInterval(grabFrameAndSend, screenCaptureInterval);
        return true; // Indicate success

    } catch (error) {
        isPermissionPromptActive = false; // <<< CLEAR FLAG even on error
        console.error("[Capture] Error starting screen capture:", error.name, error.message);

        // --- MODIFIED ERROR HANDLING ---
        let userMessage = "Could not start screen sharing. Please ensure permissions are enabled and try again."; // Default message
        if (error.name === 'NotAllowedError') {
            console.warn("[Capture] User denied screen sharing permission.");
            userMessage = "Screen sharing permission is required to start the test."; // Specific message for denial
            // Do NOT disqualify here, let the calling function handle UI based on return value
        }

        UI.showMessage(userMessage, "error"); // Show the message
        setTimeout(UI.hideMessage, 5000); // <<< HIDE message after 5 seconds

        // --- END MODIFIED ERROR HANDLING ---

        stopScreenCapture(); // Ensure cleanup on error
        return false; // Indicate failure
    }
}

function stopScreenCapture() {
    if (screenCaptureIntervalId) {
        clearInterval(screenCaptureIntervalId);
        screenCaptureIntervalId = null;
        console.log("[Capture] Stopped periodic capture interval.");
    }
    if (activeScreenTrack) {
        activeScreenTrack.onended = null; // Remove listener
        activeScreenTrack.stop();
        console.log("[Capture] Stopped active screen track.");
    }
    // Clear global vars
    activeScreenStream = null;
    activeScreenTrack = null;
    activeImageCapture = null;
}


// === Violation Detection Logic ===

// Central function to handle violation processing
function triggerViolationProcedure(detectionMethod) {
    // Check basic conditions and prevent rapid double triggers
    // <<< ADD CHECK for permission prompt active >>>
    if (!currentUserId || isDisqualified || violationCheckInProgress || isPermissionPromptActive) {
        if (isPermissionPromptActive) console.log(`Violation check ignored: Permission prompt active.`);
        return;
    }
    violationCheckInProgress = true; // Set flag to prevent re-entry
    console.log(`Violation detected via: ${detectionMethod}`);

    // Increment warnings
    let currentWarnings = parseInt(localStorage.getItem('tabSwitchWarnings') || '0');
    currentWarnings++;
    tabSwitchWarnings = currentWarnings; // Update state variable too
    localStorage.setItem('tabSwitchWarnings', tabSwitchWarnings.toString());
    console.log(`Violation count incremented: ${tabSwitchWarnings}`);

    if (tabSwitchWarnings === 1) {
        console.log("Violation Count = 1: Triggering first warning.");
        try {
            // Alert blocks execution, ensuring the user sees it.
            alert('Warning: You have switched tabs or minimized the window. This is your final warning. Doing so again will block your access.');
            console.log("First warning alert shown.");
        } catch (e) {
            console.error("Failed to show alert:", e);
            UI.showMessage('Warning: You have switched tabs or minimized the window. This is your final warning.', 'warning');
        } finally {
            // Reset flag after alert is dismissed (or fails)
            // Use a small timeout to ensure it resets after potential browser processing
            setTimeout(() => { violationCheckInProgress = false; }, 100);
        }
    } else if (tabSwitchWarnings >= 2) {
        console.log("Violation Count >= 2: Triggering disqualification.");
        // Disqualify immediately
        handleDisqualification('<b>Access Blocked!</b><br>You moved away from the page more than once.');

        // Notify the server (already happens inside handleDisqualification, but good to be explicit)
        fetch('/disqualify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: currentUserId })
         })
        .then(response => response.ok ? response.json() : response.json().then(err => Promise.reject(err)))
        .then(data => console.log('Server acknowledged final disqualification:', data.message))
        .catch(error => console.error('Error sending final disqualification update:', error.message || error));
        // No need to reset violationCheckInProgress here, as user is disqualified
    } else {
         // Should not happen if count starts at 0, but reset flag just in case
         setTimeout(() => { violationCheckInProgress = false; }, 100);
    }
}

// 1. Page Visibility API Handler (Primary)
function handleVisibilityChange() {
    // <<< ADD CHECK for permission prompt active >>>
    if (isPermissionPromptActive) {
        console.log("Visibility change ignored: Permission prompt active.");
        return;
    }
    if (document.visibilityState === 'hidden') {
        triggerViolationProcedure("Visibility API");
    } else if (document.visibilityState === 'visible') {
        console.log("Visibility Change: Page visible.");
        // Reset flag if user comes back after first warning alert was dismissed
        violationCheckInProgress = false;
    }
}

// 2. Blur + Focus Check Handler (Secondary Fallback)
function handleWindowBlur() {
    // Run only if a user session is active AND not disqualified
    // <<< ADD CHECK for permission prompt active >>>
    if (!currentUserId || isDisqualified || isPermissionPromptActive) {
        if (isPermissionPromptActive) console.log("Blur ignored: Permission prompt active.");
        return;
    }
    // Use a small delay to avoid issues with iframe clicks triggering blur momentarily
    // AND to avoid race conditions with the permission prompt flag
    setTimeout(() => {
        // Re-check prompt flag inside timeout as well
        if (isPermissionPromptActive) {
             console.log("Blur timeout ignored: Permission prompt became active?");
             return;
        }
        if (!document.hasFocus()) {
            // If focus is *still* lost after the delay, trigger violation
            triggerViolationProcedure("Blur/Focus Check");
        }
    }, 250); // Short delay (adjust if needed)
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
        console.log(`Page loaded with existing userId: ${currentUserId}. Monitoring active.`);
    } else {
        console.log("Page loaded. No existing user ID found. Monitoring inactive.");
    }

    // --- Attach Event Listeners ---

    // Add guards for elements before adding listeners
    if (nameInput) {
        nameInput.addEventListener('blur', async () => {
            if (isDisqualified) return;
            const result = await validateField('name', handleDisqualification);
            validationErrors.name = !result.isValid;
            UI.showInlineMessage('name', result.message);
            updateSubmitButtonBasedOnValidation();
        });
    }
    if (emailInput) {
        emailInput.addEventListener('blur', async () => {
            if (isDisqualified) return;
            const result = await validateField('email', handleDisqualification);
            validationErrors.email = !result.isValid;
            UI.showInlineMessage('email', result.message);
            updateSubmitButtonBasedOnValidation();
        });
    }
    if (phoneInput) {
        phoneInput.addEventListener('blur', async () => {
            if (isDisqualified) return;
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
        // Make the handler async to await startScreenCapture
        instructionCheckbox.addEventListener('change', handleInstructionCheckboxChange);
    }

    // Attach BOTH listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur); // Add blur listener as fallback
    // No focus listener needed as visibilitychange handles return, and blur check is immediate

    console.log("Attached visibilitychange and blur listeners.");

});

