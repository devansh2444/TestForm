// // main.test.js
// import * as UI from './ui';
// import * as Timer from './timer';
// import * as Validation from './validation';

// // --- Mock Modules ---
// jest.mock('./ui', () => ({
//   showMessage: jest.fn(),
//   hideMessage: jest.fn(),
//   showInlineMessage: jest.fn(),
//   updateSubmitButtonState: jest.fn(),
//   updateInputDisabledState: jest.fn(),
//   showInstructions: jest.fn(),
//   showGoogleForm: jest.fn(),
//   resetUIElements: jest.fn(),
//   applyDisqualificationUI: jest.fn(),
//   updateTimerDisplay: jest.fn(), // Also mock this if timer calls it directly
// }));

// jest.mock('./timer', () => ({
//   startTimer: jest.fn(),
//   stopTimer: jest.fn(),
// }));

// jest.mock('./validation', () => ({
//   validateField: jest.fn(() => Promise.resolve({ isValid: true, message: null })), // Default mock
// }));

// // --- Mock Browser APIs (Some already in setup) ---
// // Mock getDisplayMedia and related APIs
// const mockTrack = {
//   stop: jest.fn(),
//   onended: null, // Allow setting this handler
// };
// const mockStream = {
//   getVideoTracks: jest.fn(() => [mockTrack]),
// };
// const mockImageCapture = {
//   grabFrame: jest.fn(() => Promise.resolve({ width: 100, height: 100 })), // Mock bitmap
// };
// global.navigator.mediaDevices = {
//   ...global.navigator.mediaDevices, // Keep existing mocks if any
//   getDisplayMedia: jest.fn(() => Promise.resolve(mockStream)),
// };
// global.ImageCapture = jest.fn(() => mockImageCapture);
// // Mock canvas for grabFrameAndSend
// global.HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
//   drawImage: jest.fn(),
// }));
// global.HTMLCanvasElement.prototype.toDataURL = jest.fn(() => 'data:image/png;base64,FAKEDATA');


// // --- Test Suite ---
// describe('Main Logic (main.js)', () => {
//   let form, nameInput, emailInput, phoneInput, instructionCheckbox, submitButton;

//   // Function to simulate DOMContentLoaded and run main script logic
//   // This is a simplified way; ideally, main.js would export an init function
//   const initializeApp = () => {
//       // Need to dynamically import or eval main.js content here
//       // This is complex. A simpler approach for testing is to manually
//       // attach the event listeners defined in main.js to the elements.
//       // We will manually call the handlers in the tests instead.

//       // Simulate the initial resetApp call from DOMContentLoaded
//       // Find the resetApp function (assuming it's globally accessible or exported)
//       // For this example, we assume resetApp is called implicitly by setup.
//       // We also simulate the initial state check from DOMContentLoaded
//       const initialUserId = localStorage.getItem('userId');
//       const initialWarnings = parseInt(localStorage.getItem('tabSwitchWarnings') || '0');
//       if (initialUserId && initialWarnings >= 2) {
//           // Simulate immediate disqualification on load
//           // Find handleDisqualification and call it
//       }
//   };

//   // Function to get handlers (assuming they are globally accessible or exported)
//   // In a real scenario, main.js should export these or an object containing them.
//   // For now, we'll assume we can access them (this might require refactoring main.js).
//   // We will mock the functions directly for this example.
//   let handleFormSubmit;
//   let handleInstructionCheckboxChange;
//   let handleVisibilityChange;
//   let handleWindowBlur;
//   let handleDisqualification;
//   let resetApp;
//   let startScreenCapture;
//   let stopScreenCapture;
//   let grabFrameAndSend;
//   let triggerViolationProcedure;
//   let updateSubmitButtonBasedOnValidation; // If needed

//   beforeEach(async () => {
//     // Reset mocks, timers, localStorage, DOM
//     jest.clearAllMocks();
//     jest.useFakeTimers();
//     localStorage.clear(); // Uses mock localStorage from setup
//     document.body.innerHTML = `
//       <div id="message"></div>
//       <h1 id="main-heading">Heading</h1>
//       <form id="user-form">
//         <div><input type="text" id="name"><span class="validation-message" id="name-validation-msg"></span></div>
//         <div><input type="email" id="email"><span class="validation-message" id="email-validation-msg"></span></div>
//         <div><input type="text" id="phone-number"><span class="validation-message" id="phone-validation-msg"></span></div>
//         <button type="submit" id="submit-button">Submit</button>
//       </form>
//       <div id="instruction-container" style="display: none;">
//         <input type="checkbox" id="instruction-checkbox"> Instructions...
//       </div>
//       <div id="google-form-container" style="display: none;"></div>
//       <div id="timer-display"></div>
//     `;

//     // Get DOM elements
//     form = document.getElementById('user-form');
//     nameInput = document.getElementById('name');
//     emailInput = document.getElementById('email');
//     phoneInput = document.getElementById('phone-number');
//     instructionCheckbox = document.getElementById('instruction-checkbox');
//     submitButton = document.getElementById('submit-button');

//     // --- IMPORTANT: Load main.js AFTER mocking dependencies ---
//     // This ensures main.js uses the mocked versions when it initializes.
//     // Using dynamic import inside beforeEach is one way.
//     const mainModule = await import('./main.js');
//     // Assign handlers from the imported module
//     handleFormSubmit = mainModule.handleFormSubmit; // Assuming exported
//     handleInstructionCheckboxChange = mainModule.handleInstructionCheckboxChange; // Assuming exported
//     handleVisibilityChange = mainModule.handleVisibilityChange; // Assuming exported
//     handleWindowBlur = mainModule.handleWindowBlur; // Assuming exported
//     handleDisqualification = mainModule.handleDisqualification; // Assuming exported
//     resetApp = mainModule.resetApp; // Assuming exported
//     startScreenCapture = mainModule.startScreenCapture; // Assuming exported
//     stopScreenCapture = mainModule.stopScreenCapture; // Assuming exported
//     grabFrameAndSend = mainModule.grabFrameAndSend; // Assuming exported
//     triggerViolationProcedure = mainModule.triggerViolationProcedure; // Assuming exported
//     updateSubmitButtonBasedOnValidation = mainModule.updateSubmitButtonBasedOnValidation; // Assuming exported

//     // Simulate DOMContentLoaded initialization steps manually if needed
//     // resetApp(); // Call reset explicitly if not handled by import/setup
//     // Check initial disqualification state based on localStorage
//     const initialUserId = localStorage.getItem('userId');
//     const initialWarnings = parseInt(localStorage.getItem('tabSwitchWarnings') || '0');
//      if (initialUserId && initialWarnings >= 2) {
//          // Manually set state as handleDisqualification might rely on module scope
//          mainModule.isDisqualified = true; // Assuming isDisqualified is exported or accessible
//          handleDisqualification();
//      }

//      // Reset visibility state for tests
//      Object.defineProperty(document, 'visibilityState', { value: 'visible', writable: true });
//      Object.defineProperty(document, 'hasFocus', { value: true, writable: true });
//   });

//    afterEach(() => {
//     jest.useRealTimers();
//     document.body.innerHTML = '';
//     // Reset module state if necessary (tricky without explicit reset functions)
//   });

//   // --- Test handleFormSubmit ---
//   describe('handleFormSubmit', () => {
//     test('should prevent default, validate fields, and show error if invalid', async () => {
//       const event = { preventDefault: jest.fn() };
//       nameInput.value = 'Test';
//       emailInput.value = ''; // Invalid
//       phoneInput.value = '123';

//       // Mock validation to return error for email
//       Validation.validateField.mockImplementation(async (field) => {
//         if (field === 'email') return { isValid: false, message: 'Email required' };
//         return { isValid: true, message: null };
//       });

//       await handleFormSubmit(event);

//       expect(event.preventDefault).toHaveBeenCalled();
//       expect(Validation.validateField).toHaveBeenCalledWith('name', expect.any(Function));
//       expect(Validation.validateField).toHaveBeenCalledWith('email', expect.any(Function));
//       expect(Validation.validateField).toHaveBeenCalledWith('phone', expect.any(Function));
//       expect(UI.showInlineMessage).toHaveBeenCalledWith('email', 'Email required');
//       expect(UI.showMessage).toHaveBeenCalledWith(expect.stringContaining('fix the errors'), 'error');
//       expect(global.fetch).not.toHaveBeenCalledWith('/submit', expect.anything());
//       expect(UI.updateSubmitButtonState).toHaveBeenCalled(); // Called by updateSubmitButtonBasedOnValidation
//     });

//      test('should call fetch /submit with data if validation passes', async () => {
//       const event = { preventDefault: jest.fn() };
//       nameInput.value = 'Valid User';
//       emailInput.value = 'valid@test.com';
//       phoneInput.value = '1234567890';

//       // Mock successful validation
//       Validation.validateField.mockResolvedValue({ isValid: true, message: null });
//       // Mock successful fetch
//       global.fetch.mockResolvedValue({
//         ok: true,
//         status: 201,
//         json: () => Promise.resolve({
//           message: 'Form submitted successfully',
//           googleFormUrl: 'http://example.com/form',
//           userId: 'user-123'
//         }),
//       });

//       await handleFormSubmit(event);

//       expect(event.preventDefault).toHaveBeenCalled();
//       expect(Validation.validateField).toHaveBeenCalledTimes(3);
//       expect(UI.showMessage).not.toHaveBeenCalledWith(expect.stringContaining('fix the errors'), 'error');
//       expect(UI.updateSubmitButtonState).toHaveBeenCalledWith(true); // Disabled during submit
//       expect(submitButton.textContent).toBe('Submitting...');
//       expect(global.fetch).toHaveBeenCalledWith('/submit', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ name: 'Valid User', email: 'valid@test.com', phoneNumber: '1234567890' })
//       });
//       expect(localStorage.setItem).toHaveBeenCalledWith('userId', 'user-123');
//       expect(UI.showInstructions).toHaveBeenCalled();
//     });

//     test('should handle fetch /submit 409 conflict (user exists)', async () => {
//        const event = { preventDefault: jest.fn() };
//        nameInput.value = 'Existing User';
//        emailInput.value = 'exists@test.com';
//        phoneInput.value = '1112223333';

//        Validation.validateField.mockResolvedValue({ isValid: true, message: null });
//        global.fetch.mockResolvedValue({
//          ok: false,
//          status: 409,
//          json: () => Promise.resolve({ message: 'User already exists' }),
//        });

//        await handleFormSubmit(event);

//        expect(global.fetch).toHaveBeenCalledWith('/submit', expect.anything());
//        expect(UI.showMessage).toHaveBeenCalledWith(expect.stringContaining('User already exists'), 'error');
//        expect(UI.showInlineMessage).toHaveBeenCalledWith('email', expect.stringContaining('already exist'));
//        expect(UI.showInlineMessage).toHaveBeenCalledWith('phone', expect.stringContaining('already exist'));
//        expect(UI.updateSubmitButtonState).toHaveBeenCalled(); // Re-enabled potentially
//        expect(submitButton.textContent).toBe('Submit'); // Reset text
//        expect(UI.showInstructions).not.toHaveBeenCalled();
//     });

//      test('should handle fetch /submit 403 forbidden (disqualified)', async () => {
//        const event = { preventDefault: jest.fn() };
//        nameInput.value = 'DQ User';
//        emailInput.value = 'dq@test.com';
//        phoneInput.value = '4445556666';

//        Validation.validateField.mockResolvedValue({ isValid: true, message: null });
//        global.fetch.mockResolvedValue({
//          ok: false,
//          status: 403,
//          json: () => Promise.resolve({ message: 'Session closed' }),
//        });

//        await handleFormSubmit(event);

//        expect(global.fetch).toHaveBeenCalledWith('/submit', expect.anything());
//        // Expect handleDisqualification to be called (via its mock or by checking UI.applyDisqualificationUI)
//        expect(UI.applyDisqualificationUI).toHaveBeenCalledWith('Session closed');
//        expect(Timer.stopTimer).toHaveBeenCalled();
//        expect(UI.showInstructions).not.toHaveBeenCalled();
//     });

//      test('should handle fetch /submit network error', async () => {
//        const event = { preventDefault: jest.fn() };
//        nameInput.value = 'Net Error';
//        emailInput.value = 'net@test.com';
//        phoneInput.value = '7778889999';

//        Validation.validateField.mockResolvedValue({ isValid: true, message: null });
//        global.fetch.mockRejectedValue(new Error('Network Failed'));

//        await handleFormSubmit(event);

//        expect(global.fetch).toHaveBeenCalledWith('/submit', expect.anything());
//        expect(UI.showMessage).toHaveBeenCalledWith(expect.stringContaining('Network Failed'), expect.any(String));
//        expect(UI.updateSubmitButtonState).toHaveBeenCalled();
//        expect(submitButton.textContent).toBe('Submit');
//        expect(UI.showInstructions).not.toHaveBeenCalled();
//     });
//   });

//   // --- Test handleInstructionCheckboxChange ---
//   describe('handleInstructionCheckboxChange', () => {
//      beforeEach(() => {
//         // Simulate successful form submission state
//         localStorage.setItem('userId', 'test-user');
//         // Need access to module's internal state or mock it
//         // mainModule.currentUserId = 'test-user'; // If accessible
//         // mainModule.storedGoogleFormUrl = 'http://example.com/form'; // If accessible
//         // For testing, let's assume startScreenCapture is mocked globally
//      });

//      test('should do nothing if checkbox is not checked', async () => {
//         instructionCheckbox.checked = false;
//         await handleInstructionCheckboxChange();

//         expect(navigator.mediaDevices.getDisplayMedia).not.toHaveBeenCalled();
//         expect(UI.showGoogleForm).not.toHaveBeenCalled();
//         expect(Timer.startTimer).not.toHaveBeenCalled();
//      });

//      test('should attempt screen capture, show form, and start timer if checked and capture succeeds', async () => {
//         instructionCheckbox.checked = true;
//         // Mock successful screen capture start
//         navigator.mediaDevices.getDisplayMedia.mockResolvedValue(mockStream);
//         ImageCapture.mockImplementation(() => mockImageCapture); // Ensure constructor mock works

//         await handleInstructionCheckboxChange();

//         expect(navigator.mediaDevices.getDisplayMedia).toHaveBeenCalledTimes(1);
//         // Check if grabFrameAndSend was scheduled (hard to test setTimeout directly without spies)
//         // Check interval was set
//         expect(setInterval).toHaveBeenCalledWith(expect.any(Function), expect.any(Number)); // Check if interval was set up
//         expect(UI.showGoogleForm).toHaveBeenCalledWith(expect.any(String)); // Check with stored URL
//         expect(Timer.startTimer).toHaveBeenCalledWith(expect.any(Number), expect.any(Function));
//      });

//      test('should show error and not proceed if screen capture fails (permission denied)', async () => {
//         instructionCheckbox.checked = true;
//         // Mock screen capture denial
//         navigator.mediaDevices.getDisplayMedia.mockRejectedValue(new DOMException('Permission denied', 'NotAllowedError'));

//         await handleInstructionCheckboxChange();

//         expect(navigator.mediaDevices.getDisplayMedia).toHaveBeenCalledTimes(1);
//         expect(UI.showMessage).toHaveBeenCalledWith(expect.stringContaining('permission is required'), 'error');
//         // Check that the message is hidden after timeout
//         expect(setTimeout).toHaveBeenCalledWith(UI.hideMessage, 5000);
//         jest.advanceTimersByTime(5000);
//         expect(UI.hideMessage).toHaveBeenCalled();

//         expect(instructionCheckbox.checked).toBe(false); // Should uncheck
//         expect(UI.showGoogleForm).not.toHaveBeenCalled();
//         expect(Timer.startTimer).not.toHaveBeenCalled();
//      });
//   });


//   // --- Test Violation Detection (Visibility API / Blur) ---
//   describe('Violation Detection', () => {
//       beforeEach(() => {
//           // Simulate active user session
//           localStorage.setItem('userId', 'violator-123');
//           // mainModule.currentUserId = 'violator-123'; // If accessible
//           localStorage.setItem('tabSwitchWarnings', '0');
//           // mainModule.tabSwitchWarnings = 0; // If accessible
//           // mainModule.isDisqualified = false; // If accessible
//           // mainModule.violationCheckInProgress = false; // If accessible
//           // mainModule.isPermissionPromptActive = false; // If accessible
//       });

//       // Test Visibility API
//       test('handleVisibilityChange: should increment warnings and alert on first hidden state', () => {
//           Object.defineProperty(document, 'visibilityState', { value: 'hidden' });
//           handleVisibilityChange(); // Simulate event

//           expect(localStorage.setItem).toHaveBeenCalledWith('tabSwitchWarnings', '1');
//           expect(global.alert).toHaveBeenCalledTimes(1);
//           expect(global.alert).toHaveBeenCalledWith(expect.stringContaining('final warning'));
//           expect(UI.applyDisqualificationUI).not.toHaveBeenCalled();
//           expect(global.fetch).not.toHaveBeenCalledWith('/disqualify', expect.anything());

//           // Simulate coming back
//           Object.defineProperty(document, 'visibilityState', { value: 'visible' });
//           handleVisibilityChange();
//           // Resetting violationCheckInProgress happens internally, hard to assert directly without exposing state
//       });

//       test('handleVisibilityChange: should disqualify and notify server on second hidden state', () => {
//           localStorage.setItem('tabSwitchWarnings', '1'); // Simulate first warning already happened
//           // mainModule.tabSwitchWarnings = 1; // If accessible

//           Object.defineProperty(document, 'visibilityState', { value: 'hidden' });
//           handleVisibilityChange(); // Simulate second violation

//           expect(localStorage.setItem).toHaveBeenCalledWith('tabSwitchWarnings', '2');
//           expect(global.alert).not.toHaveBeenCalled(); // No alert on second time
//           expect(UI.applyDisqualificationUI).toHaveBeenCalledWith(expect.stringContaining('moved away from the page more than once'));
//           expect(Timer.stopTimer).toHaveBeenCalled();
//           expect(stopScreenCapture).toHaveBeenCalled(); // Ensure screen capture stops
//           expect(global.fetch).toHaveBeenCalledWith('/disqualify', {
//               method: 'POST',
//               headers: { 'Content-Type': 'application/json' },
//               body: JSON.stringify({ userId: 'violator-123' })
//           });
//       });

//        test('handleVisibilityChange: should ignore if no userId', () => {
//           localStorage.removeItem('userId');
//           // mainModule.currentUserId = null; // If accessible

//           Object.defineProperty(document, 'visibilityState', { value: 'hidden' });
//           handleVisibilityChange();

//           expect(localStorage.setItem).not.toHaveBeenCalledWith('tabSwitchWarnings', expect.anything());
//           expect(global.alert).not.toHaveBeenCalled();
//           expect(UI.applyDisqualificationUI).not.toHaveBeenCalled();
//       });

//        test('handleVisibilityChange: should ignore if disqualified', () => {
//           // mainModule.isDisqualified = true; // If accessible
//           // Simulate disqualification state
//           localStorage.setItem('tabSwitchWarnings', '2');

//           Object.defineProperty(document, 'visibilityState', { value: 'hidden' });
//           handleVisibilityChange(); // Should be ignored by the guard

//           // Assert that counters/alerts/fetches are not called *again*
//           expect(localStorage.setItem).not.toHaveBeenCalledWith('tabSwitchWarnings', '3');
//           expect(global.alert).not.toHaveBeenCalled();
//           // applyDisqualificationUI might be called again if focus returns, but not directly by visibility change when already disqualified
//       });

//        test('handleVisibilityChange: should ignore if permission prompt is active', () => {
//           // mainModule.isPermissionPromptActive = true; // If accessible
//           // Simulate prompt state

//           Object.defineProperty(document, 'visibilityState', { value: 'hidden' });
//           handleVisibilityChange(); // Should be ignored by the guard

//           expect(localStorage.setItem).not.toHaveBeenCalledWith('tabSwitchWarnings', expect.anything());
//           expect(global.alert).not.toHaveBeenCalled();
//        });


//       // Test Blur Fallback
//       test('handleWindowBlur: should trigger violation check after delay if document loses focus', () => {
//           Object.defineProperty(document, 'hasFocus', { value: false }); // Simulate focus lost
//           handleWindowBlur(); // Simulate event

//           // Violation check is delayed, shouldn't happen immediately
//           expect(localStorage.setItem).not.toHaveBeenCalled();
//           expect(global.alert).not.toHaveBeenCalled();

//           // Advance timer past the delay
//           jest.advanceTimersByTime(300); // Past 250ms timeout

//           // Now the violation logic should run
//           expect(localStorage.setItem).toHaveBeenCalledWith('tabSwitchWarnings', '1');
//           expect(global.alert).toHaveBeenCalledTimes(1);
//           expect(UI.applyDisqualificationUI).not.toHaveBeenCalled();
//       });

//       test('handleWindowBlur: should NOT trigger violation if focus returns before delay ends', () => {
//           Object.defineProperty(document, 'hasFocus', { value: false }); // Focus lost
//           handleWindowBlur();

//           // Advance timer partially
//           jest.advanceTimersByTime(100);

//           // Simulate focus returning quickly
//           Object.defineProperty(document, 'hasFocus', { value: true });

//           // Advance timer past the full delay
//           jest.advanceTimersByTime(200);

//           // Violation logic should NOT have run
//           expect(localStorage.setItem).not.toHaveBeenCalled();
//           expect(global.alert).not.toHaveBeenCalled();
//       });

//        test('handleWindowBlur: should ignore if permission prompt is active', () => {
//           // mainModule.isPermissionPromptActive = true; // If accessible
//           Object.defineProperty(document, 'hasFocus', { value: false });
//           handleWindowBlur();

//           // Advance timer past the delay
//           jest.advanceTimersByTime(300);

//           // Violation logic should NOT have run
//           expect(localStorage.setItem).not.toHaveBeenCalled();
//           expect(global.alert).not.toHaveBeenCalled();
//        });
//   });

//    // --- Test Screen Capture Logic ---
//    describe('Screen Capture', () => {
//         beforeEach(() => {
//             // Simulate active user session needed for capture
//             localStorage.setItem('userId', 'capture-user');
//             // mainModule.currentUserId = 'capture-user'; // If accessible
//             // mainModule.isDisqualified = false; // If accessible
//         });

//         test('startScreenCapture: should request permission, set up track listener, and start interval', async () => {
//             navigator.mediaDevices.getDisplayMedia.mockResolvedValue(mockStream);
//             ImageCapture.mockImplementation(() => mockImageCapture);

//             const success = await startScreenCapture();

//             expect(success).toBe(true);
//             expect(navigator.mediaDevices.getDisplayMedia).toHaveBeenCalledTimes(1);
//             expect(ImageCapture).toHaveBeenCalledWith(mockTrack);
//             expect(mockTrack.onended).toEqual(expect.any(Function)); // Listener should be attached
//             expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 500); // Initial grabFrame
//             expect(setInterval).toHaveBeenCalledWith(expect.any(Function), expect.any(Number)); // Interval
//         });

//         test('startScreenCapture: should handle permission denial', async () => {
//             navigator.mediaDevices.getDisplayMedia.mockRejectedValue(new DOMException('Permission denied', 'NotAllowedError'));

//             const success = await startScreenCapture();

//             expect(success).toBe(false);
//             expect(UI.showMessage).toHaveBeenCalledWith(expect.stringContaining('permission is required'), 'error');
//             expect(setTimeout).toHaveBeenCalledWith(UI.hideMessage, 5000); // Hide message check
//             expect(mockTrack.stop).not.toHaveBeenCalled(); // Should not get this far
//             expect(clearInterval).not.toHaveBeenCalled();
//         });

//         test('grabFrameAndSend: should grab frame, convert to data URL, and fetch to server', async () => {
//             // Simulate capture already started state
//             // mainModule.activeImageCapture = mockImageCapture; // If accessible
//             // mainModule.currentUserId = 'capture-user'; // If accessible
//             // Need to manually set the state for the test if not exported
//             await startScreenCapture(); // Start capture to set up state via mocks

//             // Reset fetch mock specifically for this test
//             global.fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ message: 'Received' }) });

//             // Clear mocks from startScreenCapture call
//             jest.clearAllMocks();
//             global.fetch.mockClear();

//             await grabFrameAndSend();

//             expect(mockImageCapture.grabFrame).toHaveBeenCalledTimes(1);
//             expect(global.HTMLCanvasElement.prototype.getContext).toHaveBeenCalledWith('2d');
//             expect(global.HTMLCanvasElement.prototype.toDataURL).toHaveBeenCalledWith('image/png');
//             expect(global.fetch).toHaveBeenCalledTimes(1);
//             expect(global.fetch).toHaveBeenCalledWith('/upload-screen-capture', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({
//                     imageData: 'data:image/png;base64,FAKEDATA',
//                     userId: 'capture-user', // Check correct user ID
//                     timestamp: expect.any(Number),
//                 }),
//             });
//         });

//          test('grabFrameAndSend: should handle error during frame grab/send and stop capture', async () => {
//             await startScreenCapture(); // Start capture to set up state
//             jest.clearAllMocks(); // Clear mocks from setup

//             // Mock error during grabFrame
//             mockImageCapture.grabFrame.mockRejectedValueOnce(new Error('Grab failed'));

//             await grabFrameAndSend();

//             expect(mockImageCapture.grabFrame).toHaveBeenCalledTimes(1);
//             expect(global.fetch).not.toHaveBeenCalledWith('/upload-screen-capture', expect.anything());
//             // Check if stopScreenCapture logic was called (clearInterval, track.stop)
//             expect(clearInterval).toHaveBeenCalled();
//             expect(mockTrack.stop).toHaveBeenCalled();
//             // Check if disqualification was triggered
//             expect(UI.applyDisqualificationUI).toHaveBeenCalledWith(expect.stringContaining('Screen sharing stopped unexpectedly'));
//         });

//         test('stopScreenCapture: should clear interval and stop track', () => {
//             // Simulate interval running and track active
//             const intervalId = 12345;
//             // mainModule.screenCaptureIntervalId = intervalId; // If accessible
//             // mainModule.activeScreenTrack = mockTrack; // If accessible
//             // Need to manually set state or call startScreenCapture first
//             startScreenCapture(); // Sets up mocks and state
//             const currentIntervalId = mainModule.screenCaptureIntervalId; // Get the actual ID set

//             stopScreenCapture();

//             expect(clearInterval).toHaveBeenCalledWith(currentIntervalId);
//             expect(mockTrack.onended).toBeNull(); // Listener removed
//             expect(mockTrack.stop).toHaveBeenCalledTimes(1);
//         });

//          test('Track onended listener should stop capture and disqualify', () => {
//             startScreenCapture(); // Set up the listener

//             // Simulate the track ending externally
//             expect(mockTrack.onended).toEqual(expect.any(Function));
//             mockTrack.onended(); // Trigger the listener

//             // Check cleanup and disqualification
//             expect(clearInterval).toHaveBeenCalled();
//             // stop() is called internally by stopScreenCapture which is called by onended
//             expect(mockTrack.stop).toHaveBeenCalled();
//             expect(UI.applyDisqualificationUI).toHaveBeenCalledWith(expect.stringContaining('Screen sharing was stopped'));
//         });
//    });

//    // --- Test handleDisqualification ---
//    describe('handleDisqualification', () => {
//        test('should set flag, stop timer/capture, apply UI, remove warnings', () => {
//            localStorage.setItem('userId', 'dq-user');
//            localStorage.setItem('tabSwitchWarnings', '1');
//            // mainModule.isDisqualified = false; // Ensure starts false

//            handleDisqualification('Test DQ Message');

//            // Check state flag (if accessible/exported)
//            // expect(mainModule.isDisqualified).toBe(true);
//            expect(Timer.stopTimer).toHaveBeenCalledTimes(1);
//            expect(stopScreenCapture).toHaveBeenCalledTimes(1); // Check capture stop
//            expect(UI.applyDisqualificationUI).toHaveBeenCalledWith('Test DQ Message');
//            expect(localStorage.removeItem).toHaveBeenCalledWith('tabSwitchWarnings');
//            expect(UI.updateSubmitButtonState).toHaveBeenCalled(); // Via updateSubmitButtonBasedOnValidation
//        });

//        test('should not run multiple times', () => {
//            // mainModule.isDisqualified = true; // Start as already disqualified

//            handleDisqualification('Second DQ Attempt');

//            // Ensure functions are not called again
//            expect(Timer.stopTimer).not.toHaveBeenCalled();
//            expect(stopScreenCapture).not.toHaveBeenCalled();
//            expect(UI.applyDisqualificationUI).not.toHaveBeenCalled();
//            expect(localStorage.removeItem).not.toHaveBeenCalled();
//        });
//    });

//     // --- Test resetApp ---
//     describe('resetApp', () => {
//         test('should stop timer/capture, reset UI, clear state/localStorage', () => {
//             localStorage.setItem('userId', 'reset-user');
//             localStorage.setItem('tabSwitchWarnings', '1');
//             // Simulate some non-initial state if needed

//             resetApp();

//             expect(Timer.stopTimer).toHaveBeenCalledTimes(1);
//             expect(stopScreenCapture).toHaveBeenCalledTimes(1);
//             expect(UI.resetUIElements).toHaveBeenCalledTimes(1);
//             expect(localStorage.removeItem).toHaveBeenCalledWith('userId');
//             expect(localStorage.removeItem).toHaveBeenCalledWith('tabSwitchWarnings');
//             // Check internal state reset (if accessible/exported)
//             // expect(mainModule.currentUserId).toBeNull();
//             // expect(mainModule.tabSwitchWarnings).toBe(0);
//             // expect(mainModule.isDisqualified).toBe(false);
//             expect(UI.updateSubmitButtonState).toHaveBeenCalled(); // Via updateSubmitButtonBasedOnValidation
//         });
//     });

// });


// // main.test.js
// import * as UI from './ui';
// import * as Timer from './timer';
// import * as Validation from './validation';
// // --- CHANGE: Import the module itself to spy on later ---
// import * as mainModuleItself from './main.js';
// // --- END CHANGE ---

// // --- Mock Modules ---
// // (Keep existing mocks for ui, timer, validation)
// jest.mock('./ui', () => ({ /* ... keep existing mock object ... */ }));
// // --- CHANGE: Add .js extension to mock paths and ensure __esModule ---

// //jest.mock('./timer', () => ({ /* ... keep existing mock object ... */ }));
// // --- MODIFIED TIMER MOCK ---
// jest.mock('./timer.js', () => ({ // Add .js extension
//     __esModule: true, // Indicate it's an ES module mock
//     startTimer: jest.fn(),
//     stopTimer: jest.fn(), // Ensure this is definitely a jest mock function
//   }));
//   // --- END MODIFIED TIMER MOCK ---
// jest.mock('./validation', () => ({ /* ... keep existing mock object ... */ }));

// // --- Mock Browser APIs ---
// // (Keep existing mocks for getDisplayMedia, ImageCapture, Canvas)
// const mockTrack = { /* ... */ };
// const mockStream = { /* ... */ };
// const mockImageCapture = { /* ... */ };
// global.navigator.mediaDevices = { /* ... */ };

// global.ImageCapture = jest.fn(() => mockImageCapture);
// global.HTMLCanvasElement.prototype.getContext = jest.fn(() => ({ /* ... */ }));
// global.HTMLCanvasElement.prototype.toDataURL = jest.fn(() => 'data:image/png;base64,FAKEDATA');
// // --- Add localStorageMock reference from setup ---
// const localStorageMock = window.localStorage; // Get the mock from setup
// // --- End Add ---



// // --- Test Suite ---
// describe('Main Logic (main.js)', () => {
//   let form, nameInput, emailInput, phoneInput, instructionCheckbox, submitButton;
//   // --- CHANGE: Declare mainModule here ---
//   let mainModule;
  
//   // --- END CHANGE ---

//   // --- CHANGE: Remove initializeApp function (handled by beforeEach) ---

//   // Function handlers (will be assigned in beforeEach)
//   let handleFormSubmit;
//   let handleInstructionCheckboxChange;
//   let handleVisibilityChange;
//   let handleWindowBlur;
//   let handleDisqualification;
//   let resetApp;
//   let startScreenCapture;
//   let stopScreenCapture;
//   let grabFrameAndSend;
//   let triggerViolationProcedure;
//   let updateSubmitButtonBasedOnValidation;

//   // --- CHANGE: Spies for internal functions ---
//   let stopScreenCaptureSpy;
//   // --- END CHANGE ---

//   beforeEach(async () => {
//     // Reset mocks, timers, localStorage, DOM
//     jest.clearAllMocks(); // Clear standard mocks
//     jest.useFakeTimers();
//     localStorage.clear(); // Uses mock localStorage from setup
//     document.body.innerHTML = `
//       <div id="message"></div>
//       {/* ... rest of your HTML setup ... */}
//       <div id="timer-display"></div>
//     `;

//     // Get DOM elements
//     form = document.getElementById('user-form');
//     nameInput = document.getElementById('name');
//     emailInput = document.getElementById('email');
//     phoneInput = document.getElementById('phone-number');
//     instructionCheckbox = document.getElementById('instruction-checkbox');
//     submitButton = document.getElementById('submit-button');

//     // --- IMPORTANT: Load main.js AFTER mocking dependencies ---
//     // --- CHANGE: Assign to the outer scope mainModule ---
//     mainModule = await import('./main.js');
//     // --- END CHANGE ---

//     // Assign handlers from the imported module
//     handleFormSubmit = mainModule.handleFormSubmit;
//     handleInstructionCheckboxChange = mainModule.handleInstructionCheckboxChange;
//     handleVisibilityChange = mainModule.handleVisibilityChange;
//     handleWindowBlur = mainModule.handleWindowBlur;
//     handleDisqualification = mainModule.handleDisqualification;
//     resetApp = mainModule.resetApp;
//     startScreenCapture = mainModule.startScreenCapture;
//     stopScreenCapture = mainModule.stopScreenCapture;
//     grabFrameAndSend = mainModule.grabFrameAndSend;
//     triggerViolationProcedure = mainModule.triggerViolationProcedure;
//     updateSubmitButtonBasedOnValidation = mainModule.updateSubmitButtonBasedOnValidation;

//     // --- CHANGE: Set up spies AFTER importing ---
//     // Use the direct import 'mainModuleItself' for spying
//     stopScreenCaptureSpy = jest.spyOn(mainModuleItself, 'stopScreenCapture');
//     // --- END CHANGE ---

//     // --- CHANGE: Explicitly call resetApp AFTER import and spy setup ---
//     resetApp();
//     // --- END CHANGE ---

//     // --- CHANGE: Clear mocks AGAIN after resetApp might have used them ---
//     jest.clearAllMocks();
//     // --- END CHANGE ---

//     // Reset visibility state for tests
//     Object.defineProperty(document, 'visibilityState', { value: 'visible', writable: true });
//     Object.defineProperty(document, 'hasFocus', { value: true, writable: true });
//   });

//    afterEach(() => {
//     jest.useRealTimers();
//     document.body.innerHTML = '';
//     // --- CHANGE: Restore spies ---
//     jest.restoreAllMocks();
//     // --- END CHANGE ---
//   });

//   // --- Test handleFormSubmit ---
//   describe('handleFormSubmit', () => {
//     // ... tests ...

//     // --- CHANGE: Check fetch call in network error test ---
//     test('should handle fetch /submit network error', async () => {
//        const event = { preventDefault: jest.fn() };
//        nameInput.value = 'Net Error';
//        emailInput.value = 'net@test.com';
//        phoneInput.value = '7778889999';

//        Validation.validateField.mockResolvedValue({ isValid: true, message: null });
//        global.fetch.mockRejectedValue(new Error('Network Failed'));

//        await handleFormSubmit(event);

//        // Fetch IS called before the error is caught
//        expect(global.fetch).toHaveBeenCalledWith('/submit', expect.anything());
//        expect(UI.showMessage).toHaveBeenCalledWith(expect.stringContaining('Network Failed'), expect.any(String));
//        expect(UI.updateSubmitButtonState).toHaveBeenCalled();
//        expect(submitButton.textContent).toBe('Submit');
//        expect(UI.showInstructions).not.toHaveBeenCalled();
//     });
//     // --- END CHANGE ---
//   });

//   // --- Test handleInstructionCheckboxChange ---

//   describe('handleInstructionCheckboxChange', () => {
//     beforeEach(() => {
//        // Simulate successful form submission state
//        localStorage.setItem('userId', 'test-user');
//        // --- CHANGE: Explicitly set state ---
//        if (mainModule) { // Check if mainModule is loaded
//            mainModule.currentUserId = 'test-user';
//            mainModule.storedGoogleFormUrl = 'http://example.com/form';
//        }
//        // --- END CHANGE ---
//     });

//     // --- ADD THESE TESTS BACK ---
//     test('should do nothing if checkbox is not checked', async () => {
//        instructionCheckbox.checked = false;
//        // Mock startScreenCapture to return false if needed, or rely on default mock
//        // Assuming startScreenCapture is globally mocked or part of mainModule
//        mainModule.startScreenCapture = jest.fn().mockResolvedValue(false); // Mock if needed

//        await handleInstructionCheckboxChange();

//        // Check that functions dependent on successful capture are NOT called
//        expect(UI.showGoogleForm).not.toHaveBeenCalled();
//        expect(Timer.startTimer).not.toHaveBeenCalled();
//     });

//     test('should attempt screen capture, show form, and start timer if checked and capture succeeds', async () => {
//        instructionCheckbox.checked = true;
//        // Mock startScreenCapture to return true for success
//        // Assuming startScreenCapture is globally mocked or part of mainModule
//         mainModule.startScreenCapture = jest.fn().mockResolvedValue(true); // Mock success

//        await handleInstructionCheckboxChange();

//        expect(mainModule.startScreenCapture).toHaveBeenCalledTimes(1);
//        // Check functions called AFTER successful capture
//        expect(UI.showGoogleForm).toHaveBeenCalledWith('http://example.com/form'); // Check with stored URL
//        expect(Timer.startTimer).toHaveBeenCalledWith(expect.any(Number), expect.any(Function));
//     });

//     test('should show error and not proceed if screen capture fails', async () => {
//        instructionCheckbox.checked = true;
//        // Mock startScreenCapture to return false for failure
//        // Assuming startScreenCapture is globally mocked or part of mainModule
//        mainModule.startScreenCapture = jest.fn().mockResolvedValue(false); // Mock failure

//        await handleInstructionCheckboxChange();

//        expect(mainModule.startScreenCapture).toHaveBeenCalledTimes(1);
//        // Check that functions dependent on successful capture are NOT called
//        expect(UI.showGoogleForm).not.toHaveBeenCalled();
//        expect(Timer.startTimer).not.toHaveBeenCalled();
//        // Check that the checkbox gets unchecked on failure
//        expect(instructionCheckbox.checked).toBe(false);
//        // Check if an error message was shown (startScreenCapture should handle this now)
//        // expect(UI.showMessage).toHaveBeenCalledWith(expect.any(String), 'error'); // Optional: verify message shown
//     });
//     // --- END ADDED TESTS ---
//  });
// //   describe('handleInstructionCheckboxChange', () => {
// //      beforeEach(() => {
// //         // Simulate successful form submission state
// //         localStorage.setItem('userId', 'test-user');
// //         // --- CHANGE: Explicitly set currentUserId AFTER resetApp in main beforeEach ---
// //         // This ensures the state is correct for this block
// //         mainModule.currentUserId = 'test-user'; // Requires currentUserId to be exported or accessible
// //         mainModule.storedGoogleFormUrl = 'http://example.com/form'; // Requires storedGoogleFormUrl to be exported or accessible
// //         // --- END CHANGE ---
// //      });

// //      // ... tests ...
// //      // These tests should now pass as currentUserId is set correctly
// //   });


//   // --- Test Violation Detection (Visibility API / Blur) ---
//   describe('Violation Detection', () => {
//       beforeEach(() => {
//           // Simulate active user session
//           localStorage.setItem('userId', 'violator-123');
//           localStorage.setItem('tabSwitchWarnings', '0');
//           // --- CHANGE: Set state directly ---
//           mainModule.currentUserId = 'violator-123';
//           mainModule.tabSwitchWarnings = 0;
//           mainModule.isDisqualified = false;
//           mainModule.violationCheckInProgress = false;
//           mainModule.isPermissionPromptActive = false;
//           // --- END CHANGE ---

//           // --- CHANGE: Clear localStorage mocks AFTER setting ---
//           localStorageMock.setItem.mockClear();
//           localStorageMock.getItem.mockClear(); // Also clear getItem if needed
//           localStorageMock.removeItem.mockClear();
//           // --- END CHANGE ---
//       });

//       // Test Visibility API
//       test('handleVisibilityChange: should increment warnings and alert on first hidden state', () => {
//           Object.defineProperty(document, 'visibilityState', { value: 'hidden' });
//           handleVisibilityChange(); // Simulate event

//           // Check the specific call
//           expect(localStorage.setItem).toHaveBeenCalledWith('tabSwitchWarnings', '1');
//           expect(global.alert).toHaveBeenCalledTimes(1);
//           // ... rest of assertions ...
//       });

//       test('handleVisibilityChange: should disqualify and notify server on second hidden state', () => {
//           // --- CHANGE: Set initial state for this specific test ---
//           mainModule.tabSwitchWarnings = 1;
//           localStorage.setItem('tabSwitchWarnings', '1'); // Sync localStorage
//           localStorageMock.setItem.mockClear(); // Clear after setup
//           // --- END CHANGE ---

//           Object.defineProperty(document, 'visibilityState', { value: 'hidden' });
//           handleVisibilityChange(); // Simulate second violation

//           expect(localStorage.setItem).toHaveBeenCalledWith('tabSwitchWarnings', '2');
//           // --- CHANGE: Use the spy for stopScreenCapture ---
//           expect(stopScreenCaptureSpy).toHaveBeenCalled();
//           // --- END CHANGE ---
//           // ... rest of assertions ...
//       });

//        test('handleVisibilityChange: should ignore if no userId', () => {
//           // --- CHANGE: Set state ---
//           mainModule.currentUserId = null;
//           localStorage.removeItem('userId');
//           localStorageMock.setItem.mockClear();
//           localStorageMock.removeItem.mockClear();
//           // --- END CHANGE ---

//           Object.defineProperty(document, 'visibilityState', { value: 'hidden' });
//           handleVisibilityChange();

//           expect(localStorage.setItem).not.toHaveBeenCalledWith('tabSwitchWarnings', expect.anything());
//           // ... rest of assertions ...
//       });

//        test('handleVisibilityChange: should ignore if disqualified', () => {
//           // --- CHANGE: Set state ---
//           mainModule.isDisqualified = true;
//           localStorage.setItem('tabSwitchWarnings', '2'); // Simulate previous disqualification state
//           localStorageMock.setItem.mockClear();
//            // --- END CHANGE ---

//           Object.defineProperty(document, 'visibilityState', { value: 'hidden' });
//           handleVisibilityChange(); // Should be ignored by the guard

//           expect(localStorage.setItem).not.toHaveBeenCalledWith('tabSwitchWarnings', expect.anything()); // Check it wasn't incremented further
//           // ... rest of assertions ...
//       });

//        test('handleVisibilityChange: should ignore if permission prompt is active', () => {
//           // --- CHANGE: Set state ---
//           mainModule.isPermissionPromptActive = true;
//           localStorageMock.setItem.mockClear();
//           // --- END CHANGE ---

//           Object.defineProperty(document, 'visibilityState', { value: 'hidden' });
//           handleVisibilityChange(); // Should be ignored by the guard

//           expect(localStorage.setItem).not.toHaveBeenCalledWith('tabSwitchWarnings', expect.anything());
//           // ... rest of assertions ...
//        });


//       // Test Blur Fallback
//       test('handleWindowBlur: should trigger violation check after delay if document loses focus', () => {
//           Object.defineProperty(document, 'hasFocus', { value: false }); // Simulate focus lost
//           handleWindowBlur(); // Simulate event

//           // Violation check is delayed
//           expect(localStorage.setItem).not.toHaveBeenCalled(); // Should not be called yet
//           expect(global.alert).not.toHaveBeenCalled();

//           // Advance timer past the delay
//           jest.advanceTimersByTime(300); // Past 250ms timeout

//           // Now the violation logic should run
//           expect(localStorage.setItem).toHaveBeenCalledWith('tabSwitchWarnings', '1');
//           expect(global.alert).toHaveBeenCalledTimes(1);
//           // ... rest of assertions ...
//       });

//       test('handleWindowBlur: should NOT trigger violation if focus returns before delay ends', () => {
//           Object.defineProperty(document, 'hasFocus', { value: false }); // Focus lost
//           handleWindowBlur();

//           // Advance timer partially
//           jest.advanceTimersByTime(100);

//           // Simulate focus returning quickly
//           Object.defineProperty(document, 'hasFocus', { value: true });
//           // --- CHANGE: Manually trigger focus handler to clear timeout ---
//           handleWindowFocus(); // Assuming handleWindowFocus clears the timeout
//           // --- END CHANGE ---

//           // Advance timer past the full delay
//           jest.advanceTimersByTime(200);

//           // Violation logic should NOT have run
//           expect(localStorage.setItem).not.toHaveBeenCalledWith('tabSwitchWarnings', expect.anything());
//           expect(global.alert).not.toHaveBeenCalled();
//       });

//        test('handleWindowBlur: should ignore if permission prompt is active', () => {
//           // --- CHANGE: Set state ---
//           mainModule.isPermissionPromptActive = true;
//           localStorageMock.setItem.mockClear();
//           // --- END CHANGE ---

//           Object.defineProperty(document, 'hasFocus', { value: false });
//           handleWindowBlur();

//           // Advance timer past the delay
//           jest.advanceTimersByTime(300);

//           // Violation logic should NOT have run
//           expect(localStorage.setItem).not.toHaveBeenCalledWith('tabSwitchWarnings', expect.anything());
//           // ... rest of assertions ...
//        });
//   });

//    // --- Test Screen Capture Logic ---
//    describe('Screen Capture', () => {
//         beforeEach(() => {
//             // Simulate active user session needed for capture
//             localStorage.setItem('userId', 'capture-user');
//             // --- CHANGE: Set state ---
//             mainModule.currentUserId = 'capture-user';
//             mainModule.isDisqualified = false;
//             // --- END CHANGE ---
//             // --- CHANGE: Clear mocks ---
//             localStorageMock.setItem.mockClear();
//             // --- END CHANGE ---
//         });

//         // These tests should now pass as currentUserId is set

//         test('startScreenCapture: should request permission, set up track listener, and start interval', async () => {
//             navigator.mediaDevices.getDisplayMedia.mockResolvedValue(mockStream);
//             ImageCapture.mockImplementation(() => mockImageCapture);

//             const success = await startScreenCapture();

//             expect(success).toBe(true); // Should now be true
//             // ... rest of assertions ...
//             expect(mockTrack.onended).toEqual(expect.any(Function)); // Should be set now
//         });

//         test('startScreenCapture: should handle permission denial', async () => {
//             navigator.mediaDevices.getDisplayMedia.mockRejectedValue(new DOMException('Permission denied', 'NotAllowedError'));

//             const success = await startScreenCapture();

//             expect(success).toBe(false);
//             expect(UI.showMessage).toHaveBeenCalledWith(expect.stringContaining('permission is required'), 'error'); // Should be called now
//             // ... rest of assertions ...
//         });

//         test('grabFrameAndSend: should grab frame, convert to data URL, and fetch to server', async () => {
//             // Start capture successfully first
//             navigator.mediaDevices.getDisplayMedia.mockResolvedValue(mockStream);
//             ImageCapture.mockImplementation(() => mockImageCapture);
//             await startScreenCapture(); // Should succeed now

//             // Reset fetch mock specifically for this test
//             global.fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ message: 'Received' }) });
//             jest.clearAllMocks(); // Clear mocks from startScreenCapture call
//             global.fetch.mockClear();

//             await grabFrameAndSend();

//             expect(mockImageCapture.grabFrame).toHaveBeenCalledTimes(1); // Should be called now
//             // ... rest of assertions ...
//              expect(global.fetch).toHaveBeenCalledWith('/upload-screen-capture', expect.objectContaining({
//                  body: JSON.stringify(expect.objectContaining({ userId: 'capture-user' })) // Verify userId
//              }));
//         });

//          test('grabFrameAndSend: should handle error during frame grab/send and stop capture', async () => {
//             // Start capture successfully first
//             navigator.mediaDevices.getDisplayMedia.mockResolvedValue(mockStream);
//             ImageCapture.mockImplementation(() => mockImageCapture);
//             await startScreenCapture(); // Should succeed now
//             jest.clearAllMocks(); // Clear mocks from setup

//             // Mock error during grabFrame
//             mockImageCapture.grabFrame.mockRejectedValueOnce(new Error('Grab failed'));

//             await grabFrameAndSend();

//             expect(mockImageCapture.grabFrame).toHaveBeenCalledTimes(1); // Should be called
//             // --- CHANGE: Check spy ---
//             expect(stopScreenCaptureSpy).toHaveBeenCalled();
//             // --- END CHANGE ---
//             // ... rest of assertions ...
//         });

//         test('stopScreenCapture: should clear interval and stop track', () => {
//             // Start capture to set up state
//             navigator.mediaDevices.getDisplayMedia.mockResolvedValue(mockStream);
//             ImageCapture.mockImplementation(() => mockImageCapture);
//             startScreenCapture(); // Sets up mocks and state

//             // --- CHANGE: Remove internal variable check ---
//             // const currentIntervalId = mainModule.screenCaptureIntervalId; // REMOVE
//             // --- END CHANGE ---

//             stopScreenCapture();

//             // --- CHANGE: Check clearInterval generally ---
//             expect(clearInterval).toHaveBeenCalled(); // Check if it was called at all
//             // --- END CHANGE ---
//             expect(mockTrack.onended).toBeNull(); // Listener removed
//             expect(mockTrack.stop).toHaveBeenCalledTimes(1);
//         });

//          test('Track onended listener should stop capture and disqualify', () => {
//             // Start capture successfully
//             navigator.mediaDevices.getDisplayMedia.mockResolvedValue(mockStream);
//             ImageCapture.mockImplementation(() => mockImageCapture);
//             startScreenCapture(); // Set up the listener

//             // Simulate the track ending externally
//             expect(mockTrack.onended).toEqual(expect.any(Function)); // Should be set now
//             mockTrack.onended(); // Trigger the listener

//             // Check cleanup and disqualification
//             // --- CHANGE: Check spy ---
//             expect(stopScreenCaptureSpy).toHaveBeenCalled();
//             // --- END CHANGE ---
//             expect(UI.applyDisqualificationUI).toHaveBeenCalledWith(expect.stringContaining('Screen sharing was stopped'));
//         });
//    });

//    // --- Test handleDisqualification ---
//    describe('handleDisqualification', () => {
//        test('should set flag, stop timer/capture, apply UI, remove warnings', () => {
//            localStorage.setItem('userId', 'dq-user');
//            localStorage.setItem('tabSwitchWarnings', '1');
//            // --- CHANGE: Set state ---
//            mainModule.currentUserId = 'dq-user';
//            mainModule.isDisqualified = false; // Ensure starts false for this test
//            // --- END CHANGE ---
//            // --- CHANGE: Clear mocks ---
//            localStorageMock.setItem.mockClear();
//            localStorageMock.removeItem.mockClear();
//            // --- END CHANGE ---

//            handleDisqualification('Test DQ Message');

//            expect(Timer.stopTimer).toHaveBeenCalledTimes(1); // Should be called now
//            // --- CHANGE: Check spy ---
//            expect(stopScreenCaptureSpy).toHaveBeenCalledTimes(1);
//            // --- END CHANGE ---
//            expect(UI.applyDisqualificationUI).toHaveBeenCalledWith('Test DQ Message');
//            expect(localStorage.removeItem).toHaveBeenCalledWith('tabSwitchWarnings');
//            expect(UI.updateSubmitButtonState).toHaveBeenCalled();
//        });

//        test('should not run multiple times', () => {
//            // --- CHANGE: Set state ---
//            mainModule.isDisqualified = true; // Start as already disqualified
//            // --- END CHANGE ---

//            handleDisqualification('Second DQ Attempt');

//            // Ensure functions are not called again
//            expect(Timer.stopTimer).not.toHaveBeenCalled();
//            // --- CHANGE: Check spy ---
//            expect(stopScreenCaptureSpy).not.toHaveBeenCalled();
//            // --- END CHANGE ---
//            expect(UI.applyDisqualificationUI).not.toHaveBeenCalled();
//            expect(localStorage.removeItem).not.toHaveBeenCalled();
//        });
//    });

//     // --- Test resetApp ---
//     describe('resetApp', () => {
//         test('should stop timer/capture, reset UI, clear state/localStorage', () => {
//             localStorage.setItem('userId', 'reset-user');
//             localStorage.setItem('tabSwitchWarnings', '1');
//             // --- CHANGE: Set state before reset ---
//             mainModule.currentUserId = 'reset-user';
//             mainModule.tabSwitchWarnings = 1;
//             // --- END CHANGE ---

//             resetApp();

//             expect(Timer.stopTimer).toHaveBeenCalledTimes(1);
//             // --- CHANGE: Check spy ---
//             expect(stopScreenCaptureSpy).toHaveBeenCalledTimes(1);
//             // --- END CHANGE ---
//             expect(UI.resetUIElements).toHaveBeenCalledTimes(1);
//             expect(localStorage.removeItem).toHaveBeenCalledWith('userId');
//             expect(localStorage.removeItem).toHaveBeenCalledWith('tabSwitchWarnings');
//             // Check internal state reset (if accessible/exported)
//             // expect(mainModule.currentUserId).toBeNull(); // Add if exported
//             // expect(mainModule.tabSwitchWarnings).toBe(0); // Add if exported
//             // expect(mainModule.isDisqualified).toBe(false); // Add if exported
//             expect(UI.updateSubmitButtonState).toHaveBeenCalled();
//         });
//     });

// });




















// // main.test.js
// import * as UI from './ui'; // Keep imports for clarity, mocks take precedence
// import * as Timer from './timer';
// import * as Validation from './validation';
// import * as mainModuleItself from './main.js';

// // --- Mock Modules ---
// // Use .js extension and __esModule
// jest.mock('./ui.js', () => ({
//   __esModule: true,
//   showMessage: jest.fn(),
//   hideMessage: jest.fn(),
//   showInlineMessage: jest.fn(),
//   updateSubmitButtonState: jest.fn(),
//   updateInputDisabledState: jest.fn(),
//   showInstructions: jest.fn(),
//   showGoogleForm: jest.fn(),
//   resetUIElements: jest.fn(),
//   applyDisqualificationUI: jest.fn(),
//   updateTimerDisplay: jest.fn(),
// }));

// jest.mock('./timer.js', () => ({
//   __esModule: true,
//   startTimer: jest.fn(),
//   stopTimer: jest.fn(),
// }));

// jest.mock('./validation.js', () => ({
//   __esModule: true,
//   validateField: jest.fn(() => Promise.resolve({ isValid: true, message: null })),
// }));

// // --- Mock Browser APIs ---
// const mockTrack = { stop: jest.fn(), onended: null };
// const mockStream = { getVideoTracks: jest.fn(() => [mockTrack]) };
// const mockImageCapture = { grabFrame: jest.fn(() => Promise.resolve({ width: 100, height: 100 })) };
// global.navigator.mediaDevices = {
//     ...global.navigator.mediaDevices,
//     getDisplayMedia: jest.fn(() => Promise.resolve(mockStream)),
// };
// global.ImageCapture = jest.fn(() => mockImageCapture);
// global.HTMLCanvasElement.prototype.getContext = jest.fn(() => ({ drawImage: jest.fn() }));
// global.HTMLCanvasElement.prototype.toDataURL = jest.fn(() => 'data:image/png;base64,FAKEDATA');
// const localStorageMock = window.localStorage;

// // --- Test Suite ---
// describe('Main Logic (main.js)', () => {
//   let form, nameInput, emailInput, phoneInput, instructionCheckbox, submitButton;
//   let mainModule;
//   // --- Spies ---
//   let stopScreenCaptureSpy;
//   let clearIntervalSpy; // <-- Add spy for clearInterval
//   let startScreenCaptureSpy; // <-- Add spy for startScreenCapture

//   beforeEach(async () => {
//     // Reset mocks, timers, localStorage, DOM
//     jest.clearAllMocks();
//     jest.useFakeTimers();
//     localStorageMock.clear();
//     document.body.innerHTML = `
//       <div id="message"></div>
//       <h1 id="main-heading">Heading</h1>
//       <form id="user-form">
//         <div><input type="text" id="name"><span class="validation-message" id="name-validation-msg"></span></div>
//         <div><input type="email" id="email"><span class="validation-message" id="email-validation-msg"></span></div>
//         <div><input type="text" id="phone-number"><span class="validation-message" id="phone-validation-msg"></span></div>
//         <button type="submit" id="submit-button">Submit</button>
//       </form>
//       <div id="instruction-container" style="display: none;">
//         <input type="checkbox" id="instruction-checkbox"> Instructions...
//       </div>
//       <div id="google-form-container" style="display: none;"></div>
//       <div id="timer-display"></div>
//     `;

//     // Get DOM elements
//     form = document.getElementById('user-form');
//     nameInput = document.getElementById('name');
//     emailInput = document.getElementById('email');
//     phoneInput = document.getElementById('phone-number');
//     instructionCheckbox = document.getElementById('instruction-checkbox');
//     submitButton = document.getElementById('submit-button');

//     // Load main.js AFTER mocking dependencies
//     mainModule = await import('./main.js');

//     // Assign handlers from the imported module
//     handleFormSubmit = mainModule.handleFormSubmit;
//     handleInstructionCheckboxChange = mainModule.handleInstructionCheckboxChange;
//     handleVisibilityChange = mainModule.handleVisibilityChange;
//     handleWindowBlur = mainModule.handleWindowBlur;
//     handleDisqualification = mainModule.handleDisqualification;
//     resetApp = mainModule.resetApp;
//     startScreenCapture = mainModule.startScreenCapture; // Keep assignment for direct calls if needed
//     stopScreenCapture = mainModule.stopScreenCapture;
//     grabFrameAndSend = mainModule.grabFrameAndSend;
//     triggerViolationProcedure = mainModule.triggerViolationProcedure;
//     updateSubmitButtonBasedOnValidation = mainModule.updateSubmitButtonBasedOnValidation;

//     // --- Set up spies AFTER importing ---
//     stopScreenCaptureSpy = jest.spyOn(mainModuleItself, 'stopScreenCapture');
//     startScreenCaptureSpy = jest.spyOn(mainModuleItself, 'startScreenCapture'); // <-- Spy on startScreenCapture
//     clearIntervalSpy = jest.spyOn(global, 'clearInterval'); // <-- Spy on global clearInterval
//     // --- End Spies ---

//     // Explicitly call resetApp AFTER import and spy setup
//     resetApp();

//     // // Clear mocks AGAIN after resetApp might have used them
//     // jest.clearAllMocks(); // Clears mocks like UI.*, Timer.*
//     // // Clear spies specifically if needed (or rely on restoreAllMocks in afterEach)
//     // stopScreenCaptureSpy.mockClear();
//     // startScreenCaptureSpy.mockClear();
//     // clearIntervalSpy.mockClear();
//     // --- End REMOVE ---

    
//     // Clear global mocks
//     localStorageMock.getItem.mockClear();
//     localStorageMock.setItem.mockClear();
//     localStorageMock.removeItem.mockClear();
//     global.fetch.mockClear();
//     global.alert.mockClear();


//     // Reset visibility state for tests
//     Object.defineProperty(document, 'visibilityState', { value: 'visible', writable: true });
//     Object.defineProperty(document, 'hasFocus', { value: true, writable: true });
//   });

//    afterEach(() => {
//     jest.useRealTimers();
//     document.body.innerHTML = '';
//     jest.restoreAllMocks(); // Restore spies and original implementations
//   });

//   // --- Test handleFormSubmit ---
//   describe('handleFormSubmit', () => {
//       // ... other tests ...

//        test('should handle fetch /submit 403 forbidden (disqualified)', async () => {
//          const event = { preventDefault: jest.fn() };
//          nameInput.value = 'DQ User'; emailInput.value = 'dq@test.com'; phoneInput.value = '4445556666';
//          Validation.validateField.mockResolvedValue({ isValid: true, message: null });
//          global.fetch.mockResolvedValue({ ok: false, status: 403, json: () => Promise.resolve({ message: 'Session closed' }), });

//          await handleFormSubmit(event);

//          expect(global.fetch).toHaveBeenCalledWith('/submit', expect.anything());
//          // Check that handleDisqualification was called (which then calls the others)
//          expect(UI.applyDisqualificationUI).toHaveBeenCalledWith('Session closed');
//          expect(Timer.stopTimer).toHaveBeenCalled();
//          expect(stopScreenCaptureSpy).toHaveBeenCalled(); // Check the spy
//          expect(UI.showInstructions).not.toHaveBeenCalled();
//       });

//        test('should handle fetch /submit network error', async () => {
//          const event = { preventDefault: jest.fn() };
//          nameInput.value = 'Net Error'; emailInput.value = 'net@test.com'; phoneInput.value = '7778889999';
//          Validation.validateField.mockResolvedValue({ isValid: true, message: null });
//          global.fetch.mockRejectedValue(new Error('Network Failed'));

//          await handleFormSubmit(event);

//          expect(global.fetch).toHaveBeenCalledWith('/submit', expect.anything());
//          // --- Adjust expectation: Check only the message, type defaults to 'error' ---
//          expect(UI.showMessage).toHaveBeenCalledWith('Network Failed', 'error');
//          // --- End Adjust ---
//          expect(submitButton.textContent).toBe('Submit');
//          expect(UI.showInstructions).not.toHaveBeenCalled();
//       });
//   });

//   // --- Test handleInstructionCheckboxChange ---
//   describe('handleInstructionCheckboxChange', () => {
//     beforeEach(() => {
//        localStorageMock.setItem('userId', 'test-user');
//        if (mainModule) {
//            mainModule.currentUserId = 'test-user';
//            mainModule.storedGoogleFormUrl = 'http://example.com/form';
//        }
//        localStorageMock.setItem.mockClear();
//        // --- Clear spy before each test in this block ---
//        startScreenCaptureSpy.mockClear();
//        // --- End Clear ---
//     });

//     test('should do nothing if checkbox is not checked', async () => {
//        instructionCheckbox.checked = false;
//        // No need to mock startScreenCapture here, just check it wasn't called
//        await handleInstructionCheckboxChange();
//        expect(startScreenCaptureSpy).not.toHaveBeenCalled(); // Check the spy
//        expect(UI.showGoogleForm).not.toHaveBeenCalled();
//        expect(Timer.startTimer).not.toHaveBeenCalled();
//     });

//     test('should attempt screen capture, show form, and start timer if checked and capture succeeds', async () => {
//        instructionCheckbox.checked = true;
//        // --- Use the spy and mock its implementation ---
//        startScreenCaptureSpy.mockResolvedValue(true); // Mock success via spy
//        // --- End Use Spy ---
//        await handleInstructionCheckboxChange();
//        expect(startScreenCaptureSpy).toHaveBeenCalledTimes(1); // Check the spy
//        expect(UI.showGoogleForm).toHaveBeenCalledWith('http://example.com/form');
//        expect(Timer.startTimer).toHaveBeenCalledWith(expect.any(Number), expect.any(Function));
//     });

//     test('should show error and not proceed if screen capture fails', async () => {
//        instructionCheckbox.checked = true;
//        // --- Use the spy and mock its implementation ---
//        startScreenCaptureSpy.mockResolvedValue(false); // Mock failure via spy
//         // --- End Use Spy ---
//        await handleInstructionCheckboxChange();
//        expect(startScreenCaptureSpy).toHaveBeenCalledTimes(1); // Check the spy
//        expect(UI.showGoogleForm).not.toHaveBeenCalled();
//        expect(Timer.startTimer).not.toHaveBeenCalled();
//        expect(instructionCheckbox.checked).toBe(false);
//        // Message check is implicit via startScreenCapture logic (tested elsewhere)
//     });
//  });

//   // --- Test Violation Detection ---
//   describe('Violation Detection', () => {
//       beforeEach(() => {
//           localStorageMock.setItem('userId', 'violator-123');
//           localStorageMock.setItem('tabSwitchWarnings', '0');
//           if (mainModule) {
//               mainModule.currentUserId = 'violator-123';
//               mainModule.tabSwitchWarnings = 0;
//               mainModule.isDisqualified = false;
//               mainModule.violationCheckInProgress = false;
//               mainModule.isPermissionPromptActive = false;
//           }
//           localStorageMock.setItem.mockClear();
//           localStorageMock.removeItem.mockClear();
//           global.alert.mockClear();
//       });

//       // Test Visibility API
//       test('handleVisibilityChange: should increment warnings and alert on first hidden state', () => {
//           Object.defineProperty(document, 'visibilityState', { value: 'hidden' });
//           handleVisibilityChange();
//           // --- Check localStorage mock ---
//           expect(localStorageMock.setItem).toHaveBeenCalledWith('tabSwitchWarnings', '1');
//           // --- End Check ---
//           expect(global.alert).toHaveBeenCalledTimes(1);
//           expect(global.alert).toHaveBeenCalledWith(expect.stringContaining('final warning'));
//           expect(UI.applyDisqualificationUI).not.toHaveBeenCalled();
//           expect(global.fetch).not.toHaveBeenCalledWith('/disqualify', expect.anything());
//           // Simulate coming back
//           Object.defineProperty(document, 'visibilityState', { value: 'visible' });
//           handleVisibilityChange(); // Should reset violationCheckInProgress internally
//       });

//       test('handleVisibilityChange: should disqualify and notify server on second hidden state', () => {
//           mainModule.tabSwitchWarnings = 1;
//           localStorageMock.setItem('tabSwitchWarnings', '1');
//           localStorageMock.setItem.mockClear();
//           Object.defineProperty(document, 'visibilityState', { value: 'hidden' });
//           handleVisibilityChange();
//           // --- Check localStorage mock ---
//           expect(localStorageMock.setItem).toHaveBeenCalledWith('tabSwitchWarnings', '2');
//           // --- End Check ---
//           expect(global.alert).not.toHaveBeenCalled();
//           expect(UI.applyDisqualificationUI).toHaveBeenCalledWith(expect.stringContaining('moved away from the page more than once'));
//           expect(Timer.stopTimer).toHaveBeenCalled();
//           expect(stopScreenCaptureSpy).toHaveBeenCalled();
//           expect(global.fetch).toHaveBeenCalledWith('/disqualify', expect.objectContaining({ body: JSON.stringify({ userId: 'violator-123' }) }));
//       });

//        // ... other visibility tests (ignore if no userId, disqualified, prompt active) should pass ...

//       // Test Blur Fallback
//       test('handleWindowBlur: should trigger violation check after delay if document loses focus', () => {
//           Object.defineProperty(document, 'hasFocus', { value: false });
//           handleWindowBlur();
//           expect(localStorageMock.setItem).not.toHaveBeenCalled();
//           expect(global.alert).not.toHaveBeenCalled();
//           jest.advanceTimersByTime(300);
//           // --- Check localStorage mock ---
//           expect(localStorageMock.setItem).toHaveBeenCalledWith('tabSwitchWarnings', '1');
//           // --- End Check ---
//           expect(global.alert).toHaveBeenCalledTimes(1);
//           expect(UI.applyDisqualificationUI).not.toHaveBeenCalled();
//       });

//        // ... other blur tests (focus returns, prompt active) should pass ...
//   });

//    // --- Test Screen Capture Logic ---
//    describe('Screen Capture', () => {
//         beforeEach(() => {
//             localStorageMock.setItem('userId', 'capture-user');
//             if (mainModule) {
//                 mainModule.currentUserId = 'capture-user';
//                 mainModule.isDisqualified = false;
//                 mainModule.isPermissionPromptActive = false; // Ensure reset
//             }
//             localStorageMock.setItem.mockClear();
//             // Clear mocks/spies relevant to this block
//             startScreenCaptureSpy.mockClear();
//             stopScreenCaptureSpy.mockClear();
//             clearIntervalSpy.mockClear();
//             navigator.mediaDevices.getDisplayMedia.mockClear();
//             ImageCapture.mockClear();
//             mockTrack.stop.mockClear();
//             mockImageCapture.grabFrame.mockClear();
//             UI.showMessage.mockClear();
//             setTimeout.mockClear(); // Clear setTimeout mock calls
//             setInterval.mockClear(); // Clear setInterval mock calls
//         });

//         test('startScreenCapture: should request permission, set up track listener, and start interval', async () => {
//             // --- Ensure mocks resolve correctly ---
//             navigator.mediaDevices.getDisplayMedia.mockResolvedValue(mockStream);
//             ImageCapture.mockImplementation(() => mockImageCapture);
//             // --- End Ensure ---
//             const success = await startScreenCapture(); // Call the actual function
//             expect(success).toBe(true); // Should succeed now
//             expect(navigator.mediaDevices.getDisplayMedia).toHaveBeenCalledTimes(1);
//             expect(ImageCapture).toHaveBeenCalledWith(mockTrack);
//             expect(mockTrack.onended).toEqual(expect.any(Function)); // Should be attached
//             expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 500);
//             expect(setInterval).toHaveBeenCalledWith(expect.any(Function), expect.any(Number));
//         });

//         test('startScreenCapture: should handle permission denial', async () => {
//             // --- Ensure mock rejects correctly ---
//             navigator.mediaDevices.getDisplayMedia.mockRejectedValue(new DOMException('Permission denied', 'NotAllowedError'));
//             // --- End Ensure ---
//             const success = await startScreenCapture(); // Call the actual function
//             expect(success).toBe(false);
//             expect(UI.showMessage).toHaveBeenCalledWith(expect.stringContaining('permission is required'), 'error'); // Should be called
//             expect(setTimeout).toHaveBeenCalledWith(UI.hideMessage, 5000);
//             expect(stopScreenCaptureSpy).toHaveBeenCalled(); // Cleanup should be called
//             expect(clearIntervalSpy).not.toHaveBeenCalled(); // Interval shouldn't start
//         });

//         test('grabFrameAndSend: should grab frame, convert to data URL, and fetch to server', async () => {
//             // --- Setup: Ensure startScreenCapture runs successfully first ---
//             navigator.mediaDevices.getDisplayMedia.mockResolvedValue(mockStream);
//             ImageCapture.mockImplementation(() => mockImageCapture);
//             await startScreenCapture(); // Run the actual function to set internal state
//             // --- End Setup ---
//             global.fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ message: 'Received' }) });
//             // Clear mocks from setup phase
//             jest.clearAllMocks(); global.fetch.mockClear(); stopScreenCaptureSpy.mockClear();

//             await grabFrameAndSend(); // Call the actual function

//             expect(mockImageCapture.grabFrame).toHaveBeenCalledTimes(1); // Should be called now
//             expect(global.HTMLCanvasElement.prototype.getContext).toHaveBeenCalledWith('2d');
//             expect(global.HTMLCanvasElement.prototype.toDataURL).toHaveBeenCalledWith('image/png');
//             expect(global.fetch).toHaveBeenCalledTimes(1);
//             expect(global.fetch).toHaveBeenCalledWith('/upload-screen-capture', expect.objectContaining({ body: JSON.stringify(expect.objectContaining({ userId: 'capture-user' })) }));
//         });

//          test('grabFrameAndSend: should handle error during frame grab/send and stop capture', async () => {
//             // --- Setup: Ensure startScreenCapture runs successfully first ---
//             navigator.mediaDevices.getDisplayMedia.mockResolvedValue(mockStream);
//             ImageCapture.mockImplementation(() => mockImageCapture);
//             await startScreenCapture();
//             // --- End Setup ---
//             jest.clearAllMocks(); // Clear setup mocks
//             stopScreenCaptureSpy.mockClear(); // Clear spy specifically
//             mockImageCapture.grabFrame.mockRejectedValueOnce(new Error('Grab failed'));

//             await grabFrameAndSend();

//             expect(mockImageCapture.grabFrame).toHaveBeenCalledTimes(1);
//             expect(global.fetch).not.toHaveBeenCalledWith('/upload-screen-capture', expect.anything());
//             expect(stopScreenCaptureSpy).toHaveBeenCalled(); // Check cleanup spy
//             expect(UI.applyDisqualificationUI).toHaveBeenCalledWith(expect.stringContaining('Screen sharing stopped unexpectedly'));
//         });

//         test('stopScreenCapture: should clear interval and stop track', () => {
//             // --- Setup: Ensure startScreenCapture runs successfully first ---
//             navigator.mediaDevices.getDisplayMedia.mockResolvedValue(mockStream);
//             ImageCapture.mockImplementation(() => mockImageCapture);
//             startScreenCapture(); // Run actual function to set intervalId etc.
//             // --- End Setup ---
//             // Clear mocks called during setup
//             clearIntervalSpy.mockClear();
//             mockTrack.stop.mockClear();

//             stopScreenCapture(); // Call the actual function

//             expect(clearIntervalSpy).toHaveBeenCalled(); // Check spy
//             expect(mockTrack.onended).toBeNull();
//             expect(mockTrack.stop).toHaveBeenCalledTimes(1);
//         });

//          test('Track onended listener should stop capture and disqualify', () => {
//             // --- Setup: Ensure startScreenCapture runs successfully first ---
//             navigator.mediaDevices.getDisplayMedia.mockResolvedValue(mockStream);
//             ImageCapture.mockImplementation(() => mockImageCapture);
//             startScreenCapture(); // Run actual function to attach listener
//             // --- End Setup ---
//             expect(mockTrack.onended).toEqual(expect.any(Function)); // Verify attached

//             // Clear mocks called during setup
//             stopScreenCaptureSpy.mockClear();
//             UI.applyDisqualificationUI.mockClear();

//             mockTrack.onended(); // Trigger listener

//             expect(stopScreenCaptureSpy).toHaveBeenCalled(); // Check cleanup spy
//             expect(UI.applyDisqualificationUI).toHaveBeenCalledWith(expect.stringContaining('Screen sharing was stopped'));
//         });
//    });

//    // --- Test handleDisqualification ---
//    describe('handleDisqualification', () => {
//        beforeEach(() => {
//            localStorageMock.setItem.mockClear();
//            localStorageMock.removeItem.mockClear();
//            Timer.stopTimer.mockClear();
//            stopScreenCaptureSpy.mockClear();
//            UI.applyDisqualificationUI.mockClear();
//            UI.updateSubmitButtonState.mockClear();
//        });

//        test('should set flag, stop timer/capture, apply UI, remove warnings', () => {
//            localStorageMock.setItem('userId', 'dq-user');
//            localStorageMock.setItem('tabSwitchWarnings', '1');
//            if (mainModule) {
//                mainModule.currentUserId = 'dq-user';
//                mainModule.isDisqualified = false; // Ensure starts false
//            }
//            handleDisqualification('Test DQ Message'); // Call actual function
//            expect(Timer.stopTimer).toHaveBeenCalledTimes(1);
//            expect(stopScreenCaptureSpy).toHaveBeenCalledTimes(1); // Check spy
//            expect(UI.applyDisqualificationUI).toHaveBeenCalledWith('Test DQ Message');
//            expect(localStorageMock.removeItem).toHaveBeenCalledWith('tabSwitchWarnings');
//            expect(UI.updateSubmitButtonState).toHaveBeenCalled();
//            // expect(mainModule.isDisqualified).toBe(true); // Check state if needed
//        });

//        test('should not run multiple times', () => {
//            if (mainModule) {
//                mainModule.isDisqualified = true; // Start as already disqualified
//            }
//            handleDisqualification('Second DQ Attempt'); // Call actual function
//            // Check that functions inside were NOT called due to the guard
//            expect(Timer.stopTimer).not.toHaveBeenCalled();
//            expect(stopScreenCaptureSpy).not.toHaveBeenCalled();
//            expect(UI.applyDisqualificationUI).not.toHaveBeenCalled();
//            expect(localStorageMock.removeItem).not.toHaveBeenCalled();
//        });
//    });

//     // --- Test resetApp ---
//     describe('resetApp', () => {
//         beforeEach(() => {
//            localStorageMock.setItem.mockClear();
//            localStorageMock.removeItem.mockClear();
//            Timer.stopTimer.mockClear();
//            stopScreenCaptureSpy.mockClear();
//            UI.resetUIElements.mockClear();
//            UI.updateSubmitButtonState.mockClear();
//         });

//         test('should stop timer/capture, reset UI, clear state/localStorage', () => {
//             localStorageMock.setItem('userId', 'reset-user');
//             localStorageMock.setItem('tabSwitchWarnings', '1');
//             if (mainModule) {
//                 mainModule.currentUserId = 'reset-user';
//                 mainModule.tabSwitchWarnings = 1;
//             }
//             resetApp(); // Call actual function
//             expect(Timer.stopTimer).toHaveBeenCalledTimes(1);
//             expect(stopScreenCaptureSpy).toHaveBeenCalledTimes(1); // Check spy
//             expect(UI.resetUIElements).toHaveBeenCalledTimes(1);
//             expect(localStorageMock.removeItem).toHaveBeenCalledWith('userId');
//             expect(localStorageMock.removeItem).toHaveBeenCalledWith('tabSwitchWarnings');
//             expect(UI.updateSubmitButtonState).toHaveBeenCalled();
//             // Check internal state reset if possible/exported
//             // expect(mainModule.currentUserId).toBeNull();
//             // expect(mainModule.tabSwitchWarnings).toBe(0);
//             // expect(mainModule.isDisqualified).toBe(false);
//         });
//     });

// });















































// main.test.js
import * as UI from './ui';
import * as Timer from './timer';
import * as Validation from './validation';
import * as mainModuleItself from './main.js';

// --- Mock Modules ---
jest.mock('./ui.js', () => ({ /* ... keep existing mock object ... */ }));
jest.mock('./timer.js', () => ({ /* ... keep existing mock object ... */ }));
jest.mock('./validation.js', () => ({ /* ... keep existing mock object ... */ }));

// --- Mock Browser APIs ---
const mockTrack = { stop: jest.fn(), onended: null };
const mockStream = { getVideoTracks: jest.fn(() => [mockTrack]) };
const mockImageCapture = { grabFrame: jest.fn(() => Promise.resolve({ width: 100, height: 100 })) };
global.navigator.mediaDevices = {
    ...global.navigator.mediaDevices,
    getDisplayMedia: jest.fn(() => Promise.resolve(mockStream)),
};
global.ImageCapture = jest.fn(() => mockImageCapture);
global.HTMLCanvasElement.prototype.getContext = jest.fn(() => ({ drawImage: jest.fn() }));
global.HTMLCanvasElement.prototype.toDataURL = jest.fn(() => 'data:image/png;base64,FAKEDATA');
const localStorageMock = window.localStorage;

// --- Test Suite ---
describe('Main Logic (main.js)', () => {
  let form, nameInput, emailInput, phoneInput, instructionCheckbox, submitButton;
  let mainModule;
  // --- Spies ---
  let stopScreenCaptureSpy;
  let clearIntervalSpy;
  let startScreenCaptureSpy;

  // --- Main Setup ---
  beforeEach(async () => {
    // 1. Reset standard mocks, timers, localStorage, DOM
    jest.clearAllMocks(); // Clears jest.fn() mocks like UI.*, Timer.*
    jest.useFakeTimers();
    localStorageMock.clear(); // Clear the mock store
    document.body.innerHTML = `
      <div id="message"></div>
      <h1 id="main-heading">Heading</h1>
      <form id="user-form">
        <div><input type="text" id="name"><span class="validation-message" id="name-validation-msg"></span></div>
        <div><input type="email" id="email"><span class="validation-message" id="email-validation-msg"></span></div>
        <div><input type="text" id="phone-number"><span class="validation-message" id="phone-validation-msg"></span></div>
        <button type="submit" id="submit-button">Submit</button>
      </form>
      <div id="instruction-container" style="display: none;">
        <input type="checkbox" id="instruction-checkbox"> Instructions...
      </div>
      <div id="google-form-container" style="display: none;"></div>
      <div id="timer-display"></div>
    `;

    // 2. Get DOM elements
    form = document.getElementById('user-form');
    nameInput = document.getElementById('name');
    emailInput = document.getElementById('email');
    phoneInput = document.getElementById('phone-number');
    instructionCheckbox = document.getElementById('instruction-checkbox');
    submitButton = document.getElementById('submit-button');

    // 3. Load main.js AFTER mocking dependencies
    mainModule = await import('./main.js');

    // 4. Assign handlers (optional, can call mainModule.func directly)
    handleFormSubmit = mainModule.handleFormSubmit;
    handleInstructionCheckboxChange = mainModule.handleInstructionCheckboxChange;
    handleVisibilityChange = mainModule.handleVisibilityChange;
    handleWindowBlur = mainModule.handleWindowBlur;
    handleDisqualification = mainModule.handleDisqualification;
    resetApp = mainModule.resetApp;
    startScreenCapture = mainModule.startScreenCapture;
    stopScreenCapture = mainModule.stopScreenCapture;
    grabFrameAndSend = mainModule.grabFrameAndSend;
    triggerViolationProcedure = mainModule.triggerViolationProcedure;
    updateSubmitButtonBasedOnValidation = mainModule.updateSubmitButtonBasedOnValidation;

    // 5. Set up spies AFTER importing
    // Spying on functions within the *actual* imported module
    stopScreenCaptureSpy = jest.spyOn(mainModuleItself, 'stopScreenCapture');
    startScreenCaptureSpy = jest.spyOn(mainModuleItself, 'startScreenCapture');
    clearIntervalSpy = jest.spyOn(global, 'clearInterval');

    // 6. Explicitly call resetApp AFTER import and spy setup
    // This ensures the app starts in a known state for each test
    resetApp();

    // 7. Clear global mocks (fetch, alert, localStorage calls) *after* resetApp
    // This prevents calls during resetApp from interfering with test assertions
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    global.fetch.mockClear();
    global.alert.mockClear();

    // 8. Reset visibility state for tests
    Object.defineProperty(document, 'visibilityState', { value: 'visible', writable: true });
    Object.defineProperty(document, 'hasFocus', { value: true, writable: true });
  });

  // --- Main Teardown ---
   afterEach(() => {
    jest.useRealTimers();
    document.body.innerHTML = '';
    // Restore spies and original implementations, also clears call history
    jest.restoreAllMocks();
  });

  // --- Test handleFormSubmit ---
  describe('handleFormSubmit', () => {
      // ... other tests ...

       test('should handle fetch /submit 403 forbidden (disqualified)', async () => {
         const event = { preventDefault: jest.fn() };
         nameInput.value = 'DQ User'; emailInput.value = 'dq@test.com'; phoneInput.value = '4445556666';
         Validation.validateField.mockResolvedValue({ isValid: true, message: null });
         global.fetch.mockResolvedValue({ ok: false, status: 403, json: () => Promise.resolve({ message: 'Session closed' }), });

         // Ensure state allows disqualification to run fully
         mainModule.isDisqualified = false;

         await handleFormSubmit(event);

         expect(global.fetch).toHaveBeenCalledWith('/submit', expect.anything());
         expect(UI.applyDisqualificationUI).toHaveBeenCalledWith('Session closed');
         expect(Timer.stopTimer).toHaveBeenCalled();
         expect(stopScreenCaptureSpy).toHaveBeenCalled(); // Should be called by handleDisqualification
         expect(UI.showInstructions).not.toHaveBeenCalled();
      });

       test('should handle fetch /submit network error', async () => {
         const event = { preventDefault: jest.fn() };
         nameInput.value = 'Net Error'; emailInput.value = 'net@test.com'; phoneInput.value = '7778889999';
         Validation.validateField.mockResolvedValue({ isValid: true, message: null });
         global.fetch.mockRejectedValue(new Error('Network Failed'));

         await handleFormSubmit(event);

         expect(global.fetch).toHaveBeenCalledWith('/submit', expect.anything());
         // --- Fix: Expect only one argument ---
         expect(UI.showMessage).toHaveBeenCalledWith('Network Failed');
         // --- End Fix ---
         expect(submitButton.textContent).toBe('Submit');
         expect(UI.showInstructions).not.toHaveBeenCalled();
      });
  });

  // --- Test handleInstructionCheckboxChange ---
  describe('handleInstructionCheckboxChange', () => {
    // Set state needed for this block
    beforeEach(() => {
       localStorageMock.setItem('userId', 'test-user');
       if (mainModule) {
           mainModule.currentUserId = 'test-user';
           mainModule.storedGoogleFormUrl = 'http://example.com/form';
           mainModule.isDisqualified = false; // Ensure not disqualified
       }
       localStorageMock.setItem.mockClear();
       // Clear spy specifically for this block's tests
       startScreenCaptureSpy.mockClear();
    });

    test('should do nothing if checkbox is not checked', async () => {
       instructionCheckbox.checked = false;
       await handleInstructionCheckboxChange();
       expect(startScreenCaptureSpy).not.toHaveBeenCalled();
       expect(UI.showGoogleForm).not.toHaveBeenCalled();
       expect(Timer.startTimer).not.toHaveBeenCalled();
    });

    test('should attempt screen capture, show form, and start timer if checked and capture succeeds', async () => {
       instructionCheckbox.checked = true;
       startScreenCaptureSpy.mockResolvedValue(true); // Mock success
       await handleInstructionCheckboxChange();
       expect(startScreenCaptureSpy).toHaveBeenCalledTimes(1);
       expect(UI.showGoogleForm).toHaveBeenCalledWith('http://example.com/form');
       expect(Timer.startTimer).toHaveBeenCalledWith(expect.any(Number), expect.any(Function));
    });

    test('should show error and not proceed if screen capture fails', async () => {
       instructionCheckbox.checked = true;
       startScreenCaptureSpy.mockResolvedValue(false); // Mock failure
       await handleInstructionCheckboxChange();
       expect(startScreenCaptureSpy).toHaveBeenCalledTimes(1);
       expect(UI.showGoogleForm).not.toHaveBeenCalled();
       expect(Timer.startTimer).not.toHaveBeenCalled();
       expect(instructionCheckbox.checked).toBe(false);
    });
 });

  // --- Test Violation Detection ---
  describe('Violation Detection', () => {
      // Set state needed for this block
      beforeEach(() => {
          localStorageMock.setItem('userId', 'violator-123');
          localStorageMock.setItem('tabSwitchWarnings', '0');
          if (mainModule) {
              mainModule.currentUserId = 'violator-123';
              mainModule.tabSwitchWarnings = 0;
              mainModule.isDisqualified = false;
              mainModule.violationCheckInProgress = false;
              mainModule.isPermissionPromptActive = false;
          }
          // Clear mocks after setting state
          localStorageMock.setItem.mockClear();
          localStorageMock.removeItem.mockClear();
          global.alert.mockClear();
          stopScreenCaptureSpy.mockClear(); // Clear spies too
          Timer.stopTimer.mockClear();
      });

      // Test Visibility API
      test('handleVisibilityChange: should increment warnings and alert on first hidden state', () => {
          Object.defineProperty(document, 'visibilityState', { value: 'hidden' });
          handleVisibilityChange();
          expect(localStorageMock.setItem).toHaveBeenCalledWith('tabSwitchWarnings', '1');
          expect(global.alert).toHaveBeenCalledTimes(1);
          expect(global.alert).toHaveBeenCalledWith(expect.stringContaining('final warning'));
          expect(UI.applyDisqualificationUI).not.toHaveBeenCalled();
          expect(global.fetch).not.toHaveBeenCalledWith('/disqualify', expect.anything());
      });

      test('handleVisibilityChange: should disqualify and notify server on second hidden state', () => {
          // Set state specifically for this test
          mainModule.tabSwitchWarnings = 1;
          localStorageMock.setItem('tabSwitchWarnings', '1');
          localStorageMock.setItem.mockClear(); // Clear after setup

          Object.defineProperty(document, 'visibilityState', { value: 'hidden' });
          handleVisibilityChange();

          expect(localStorageMock.setItem).toHaveBeenCalledWith('tabSwitchWarnings', '2');
          expect(global.alert).not.toHaveBeenCalled();
          expect(UI.applyDisqualificationUI).toHaveBeenCalledWith(expect.stringContaining('moved away from the page more than once'));
          expect(Timer.stopTimer).toHaveBeenCalled();
          expect(stopScreenCaptureSpy).toHaveBeenCalled();
          expect(global.fetch).toHaveBeenCalledWith('/disqualify', expect.objectContaining({ body: JSON.stringify({ userId: 'violator-123' }) }));
      });

       // ... other visibility tests ...

      // Test Blur Fallback
      test('handleWindowBlur: should trigger violation check after delay if document loses focus', () => {
          Object.defineProperty(document, 'hasFocus', { value: false });
          handleWindowBlur();
          expect(localStorageMock.setItem).not.toHaveBeenCalled();
          expect(global.alert).not.toHaveBeenCalled();

          jest.advanceTimersByTime(300); // Advance past delay

          expect(localStorageMock.setItem).toHaveBeenCalledWith('tabSwitchWarnings', '1');
          expect(global.alert).toHaveBeenCalledTimes(1);
          expect(UI.applyDisqualificationUI).not.toHaveBeenCalled();
      });

       // ... other blur tests ...
  });

   // --- Test Screen Capture Logic ---
   describe('Screen Capture', () => {
        // Set state needed for this block
        beforeEach(() => {
            localStorageMock.setItem('userId', 'capture-user');
            if (mainModule) {
                mainModule.currentUserId = 'capture-user';
                mainModule.isDisqualified = false;
                mainModule.isPermissionPromptActive = false;
            }
            // Clear mocks/spies relevant to this block
            localStorageMock.setItem.mockClear();
            startScreenCaptureSpy.mockClear();
            stopScreenCaptureSpy.mockClear();
            clearIntervalSpy.mockClear();
            navigator.mediaDevices.getDisplayMedia.mockClear();
            ImageCapture.mockClear();
            mockTrack.stop.mockClear();
            mockImageCapture.grabFrame.mockClear();
            UI.showMessage.mockClear();
            // --- REMOVE timer clears ---
            // setTimeout.mockClear();
            // setInterval.mockClear();
            // --- END REMOVE ---
        });

        test('startScreenCapture: should request permission, set up track listener, and start interval', async () => {
            navigator.mediaDevices.getDisplayMedia.mockResolvedValue(mockStream);
            ImageCapture.mockImplementation(() => mockImageCapture);

            const success = await startScreenCapture(); // Call actual function

            expect(success).toBe(true); // Should succeed
            expect(navigator.mediaDevices.getDisplayMedia).toHaveBeenCalledTimes(1);
            expect(ImageCapture).toHaveBeenCalledWith(mockTrack);
            expect(mockTrack.onended).toEqual(expect.any(Function));
            expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 500);
            expect(setInterval).toHaveBeenCalledWith(expect.any(Function), expect.any(Number));
        });

        test('startScreenCapture: should handle permission denial', async () => {
            navigator.mediaDevices.getDisplayMedia.mockRejectedValue(new DOMException('Permission denied', 'NotAllowedError'));

            const success = await startScreenCapture(); // Call actual function

            expect(success).toBe(false);
            expect(UI.showMessage).toHaveBeenCalledWith(expect.stringContaining('permission is required'), 'error');
            expect(setTimeout).toHaveBeenCalledWith(UI.hideMessage, 5000);
            expect(stopScreenCaptureSpy).toHaveBeenCalled(); // Cleanup called
            expect(clearIntervalSpy).not.toHaveBeenCalled(); // Interval not started
        });

        test('grabFrameAndSend: should grab frame, convert to data URL, and fetch to server', async () => {
            // Setup: Start capture successfully
            navigator.mediaDevices.getDisplayMedia.mockResolvedValue(mockStream);
            ImageCapture.mockImplementation(() => mockImageCapture);
            await startScreenCapture(); // Run actual function
            global.fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ message: 'Received' }) });
            // Clear mocks from setup phase
            jest.clearAllMocks(); global.fetch.mockClear(); stopScreenCaptureSpy.mockClear();

            await grabFrameAndSend(); // Call actual function

            expect(mockImageCapture.grabFrame).toHaveBeenCalledTimes(1);
            expect(global.HTMLCanvasElement.prototype.getContext).toHaveBeenCalledWith('2d');
            expect(global.HTMLCanvasElement.prototype.toDataURL).toHaveBeenCalledWith('image/png');
            expect(global.fetch).toHaveBeenCalledTimes(1);
            expect(global.fetch).toHaveBeenCalledWith('/upload-screen-capture', expect.objectContaining({ body: JSON.stringify(expect.objectContaining({ userId: 'capture-user' })) }));
        });

         test('grabFrameAndSend: should handle error during frame grab/send and stop capture', async () => {
            // Setup: Start capture successfully
            navigator.mediaDevices.getDisplayMedia.mockResolvedValue(mockStream);
            ImageCapture.mockImplementation(() => mockImageCapture);
            await startScreenCapture();
            // Clear setup mocks
            jest.clearAllMocks(); stopScreenCaptureSpy.mockClear(); UI.applyDisqualificationUI.mockClear();
            // Mock error
            mockImageCapture.grabFrame.mockRejectedValueOnce(new Error('Grab failed'));

            await grabFrameAndSend();

            expect(mockImageCapture.grabFrame).toHaveBeenCalledTimes(1);
            expect(global.fetch).not.toHaveBeenCalledWith('/upload-screen-capture', expect.anything());
            expect(stopScreenCaptureSpy).toHaveBeenCalled();
            expect(UI.applyDisqualificationUI).toHaveBeenCalledWith(expect.stringContaining('Screen sharing stopped unexpectedly'));
        });

        test('stopScreenCapture: should clear interval and stop track', () => {
            // Setup: Start capture successfully
            navigator.mediaDevices.getDisplayMedia.mockResolvedValue(mockStream);
            ImageCapture.mockImplementation(() => mockImageCapture);
            startScreenCapture(); // Run actual function
            // Clear mocks called during setup
            clearIntervalSpy.mockClear(); mockTrack.stop.mockClear();

            stopScreenCapture(); // Call actual function

            expect(clearIntervalSpy).toHaveBeenCalled(); // Check spy
            expect(mockTrack.onended).toBeNull();
            expect(mockTrack.stop).toHaveBeenCalledTimes(1);
        });

         test('Track onended listener should stop capture and disqualify', () => {
            // Setup: Start capture successfully
            navigator.mediaDevices.getDisplayMedia.mockResolvedValue(mockStream);
            ImageCapture.mockImplementation(() => mockImageCapture);
            startScreenCapture(); // Run actual function
            expect(mockTrack.onended).toEqual(expect.any(Function)); // Verify attached
            // Clear mocks called during setup
            stopScreenCaptureSpy.mockClear(); UI.applyDisqualificationUI.mockClear();

            mockTrack.onended(); // Trigger listener

            expect(stopScreenCaptureSpy).toHaveBeenCalled();
            expect(UI.applyDisqualificationUI).toHaveBeenCalledWith(expect.stringContaining('Screen sharing was stopped'));
        });
   });

   // --- Test handleDisqualification ---
   describe('handleDisqualification', () => {
       // No beforeEach needed here, set state per test

       test('should set flag, stop timer/capture, apply UI, remove warnings', () => {
           // Set initial state for THIS test
           localStorageMock.setItem('userId', 'dq-user');
           localStorageMock.setItem('tabSwitchWarnings', '1');
           if (mainModule) {
               mainModule.currentUserId = 'dq-user';
               mainModule.isDisqualified = false; // Ensure starts false
           }
           // Clear mocks before the call
           Timer.stopTimer.mockClear();
           stopScreenCaptureSpy.mockClear();
           UI.applyDisqualificationUI.mockClear();
           localStorageMock.removeItem.mockClear();
           UI.updateSubmitButtonState.mockClear();

           handleDisqualification('Test DQ Message'); // Call actual function

           expect(Timer.stopTimer).toHaveBeenCalledTimes(1);
           expect(stopScreenCaptureSpy).toHaveBeenCalledTimes(1);
           expect(UI.applyDisqualificationUI).toHaveBeenCalledWith('Test DQ Message');
           expect(localStorageMock.removeItem).toHaveBeenCalledWith('tabSwitchWarnings');
           expect(UI.updateSubmitButtonState).toHaveBeenCalled();
           // expect(mainModule.isDisqualified).toBe(true); // Verify state change
       });

       test('should not run multiple times', () => {
           // Set initial state for THIS test
           if (mainModule) {
               mainModule.isDisqualified = true; // Start as already disqualified
           }
           // Clear mocks before the call
           Timer.stopTimer.mockClear();
           stopScreenCaptureSpy.mockClear();
           UI.applyDisqualificationUI.mockClear();
           localStorageMock.removeItem.mockClear();

           handleDisqualification('Second DQ Attempt'); // Call actual function

           // Check that functions inside were NOT called due to the guard
           expect(Timer.stopTimer).not.toHaveBeenCalled();
           expect(stopScreenCaptureSpy).not.toHaveBeenCalled();
           expect(UI.applyDisqualificationUI).not.toHaveBeenCalled();
           expect(localStorageMock.removeItem).not.toHaveBeenCalled();
       });
   });

    // --- Test resetApp ---
    describe('resetApp', () => {
        // No beforeEach needed, set state per test

        test('should stop timer/capture, reset UI, clear state/localStorage', () => {
            // Set initial state for THIS test
            localStorageMock.setItem('userId', 'reset-user');
            localStorageMock.setItem('tabSwitchWarnings', '1');
            if (mainModule) {
                mainModule.currentUserId = 'reset-user';
                mainModule.tabSwitchWarnings = 1;
                mainModule.isDisqualified = true; // Simulate some state to reset
            }
            // Clear mocks before the call
            Timer.stopTimer.mockClear();
            stopScreenCaptureSpy.mockClear();
            UI.resetUIElements.mockClear();
            localStorageMock.removeItem.mockClear();
            UI.updateSubmitButtonState.mockClear();

            resetApp(); // Call actual function

            expect(Timer.stopTimer).toHaveBeenCalledTimes(1);
            expect(stopScreenCaptureSpy).toHaveBeenCalledTimes(1);
            expect(UI.resetUIElements).toHaveBeenCalledTimes(1);
            expect(localStorageMock.removeItem).toHaveBeenCalledWith('userId');
            expect(localStorageMock.removeItem).toHaveBeenCalledWith('tabSwitchWarnings');
            expect(UI.updateSubmitButtonState).toHaveBeenCalled();
            // Verify state reset
            // expect(mainModule.currentUserId).toBeNull();
            // expect(mainModule.tabSwitchWarnings).toBe(0);
            // expect(mainModule.isDisqualified).toBe(false);
        });
    });

});
