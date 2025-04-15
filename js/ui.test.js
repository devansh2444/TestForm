// ui.test.js
import * as UI from './ui';

describe('UI Module', () => {
  beforeEach(() => {
    // Set up basic HTML structure needed by UI functions
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
    jest.useFakeTimers(); // Use fake timers for functions with setTimeout
  });

   afterEach(() => {
    jest.useRealTimers(); // Restore real timers
    document.body.innerHTML = ''; // Clean up DOM
  });

  // --- Test showMessage / hideMessage ---
  test('showMessage should display message with correct class and visibility', () => {
    const messageDiv = document.getElementById('message');
    UI.showMessage('Test Error', 'error');
    expect(messageDiv.innerHTML).toBe('Test Error');
    expect(messageDiv.classList.contains('error')).toBe(true);
    expect(messageDiv.classList.contains('visible')).toBe(true);

    UI.showMessage('Test Success', 'success');
    expect(messageDiv.innerHTML).toBe('Test Success');
    expect(messageDiv.classList.contains('error')).toBe(false);
    expect(messageDiv.classList.contains('success')).toBe(true);
    expect(messageDiv.classList.contains('visible')).toBe(true);
  });

  test('hideMessage should remove visibility class', () => {
    const messageDiv = document.getElementById('message');
    UI.showMessage('Visible', 'info');
    expect(messageDiv.classList.contains('visible')).toBe(true);
    UI.hideMessage();
    expect(messageDiv.classList.contains('visible')).toBe(false);
  });

  // --- Test showInlineMessage ---
  test('showInlineMessage should display message and add error border', () => {
    const msgElement = document.getElementById('email-validation-msg');
    const inputElement = document.getElementById('email');
    UI.showInlineMessage('email', 'Invalid email');
    expect(msgElement.textContent).toBe('Invalid email');
    expect(msgElement.classList.contains('visible')).toBe(true);
    expect(inputElement.classList.contains('error-border')).toBe(true);
  });

  test('showInlineMessage should clear message and remove error border when message is null/empty', () => {
    const msgElement = document.getElementById('email-validation-msg');
    const inputElement = document.getElementById('email');
    // Set initial error state
    UI.showInlineMessage('email', 'Invalid email');
    expect(msgElement.classList.contains('visible')).toBe(true);
    expect(inputElement.classList.contains('error-border')).toBe(true);

    // Clear the message
    UI.showInlineMessage('email', null);
    expect(msgElement.textContent).toBe('');
    expect(msgElement.classList.contains('visible')).toBe(false);
    expect(inputElement.classList.contains('error-border')).toBe(false);
  });

  // --- Test updateSubmitButtonState ---
  test('updateSubmitButtonState should disable/enable the button', () => {
    const submitButton = document.getElementById('submit-button');
    UI.updateSubmitButtonState(true);
    expect(submitButton.disabled).toBe(true);
    UI.updateSubmitButtonState(false);
    expect(submitButton.disabled).toBe(false);
  });

  // --- Test updateInputDisabledState ---
  test('updateInputDisabledState should disable/enable all form inputs', () => {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone-number');
    UI.updateInputDisabledState(true);
    expect(nameInput.disabled).toBe(true);
    expect(emailInput.disabled).toBe(true);
    expect(phoneInput.disabled).toBe(true);
    UI.updateInputDisabledState(false);
    expect(nameInput.disabled).toBe(false);
    expect(emailInput.disabled).toBe(false);
    expect(phoneInput.disabled).toBe(false);
  });

  // --- Test showInstructions ---
  test('showInstructions should hide form/heading and show instructions', () => {
    const form = document.getElementById('user-form');
    const mainHeading = document.getElementById('main-heading');
    const instructionContainer = document.getElementById('instruction-container');

    UI.showInstructions();

    expect(form.classList.contains('hidden-fade')).toBe(true);
    expect(mainHeading.classList.contains('hidden-fade')).toBe(true);
    expect(instructionContainer.style.display).toBe('block');

    // Fast-forward timers for transitions
    jest.advanceTimersByTime(10); // For instruction visibility transition
    expect(instructionContainer.classList.contains('visible')).toBe(true);

    jest.advanceTimersByTime(500); // For form/heading display:none
    expect(form.style.display).toBe('none');
    expect(mainHeading.style.display).toBe('none');
  });

  // --- Test showGoogleForm ---
  test('showGoogleForm should hide instructions, show container, set iframe src, and style body', () => {
    const instructionContainer = document.getElementById('instruction-container');
    const googleFormContainer = document.getElementById('google-form-container');
    const testUrl = 'http://example.com/form';

    // Assume instructions are visible first
    instructionContainer.style.display = 'block';
    instructionContainer.classList.add('visible');

    UI.showGoogleForm(testUrl);

    expect(instructionContainer.classList.contains('visible')).toBe(false);
    expect(googleFormContainer.style.display).toBe('block');
    expect(googleFormContainer.style.position).toBe('fixed'); // Check a few key styles
    expect(googleFormContainer.style.zIndex).toBe('1000');
    expect(document.body.style.overflow).toBe('hidden');

    const iframe = googleFormContainer.querySelector('iframe');
    expect(iframe).not.toBeNull();
    expect(iframe.src).toBe(testUrl);

    // Fast-forward timers for transitions
    jest.advanceTimersByTime(10); // For google form visibility
    expect(googleFormContainer.classList.contains('visible')).toBe(true);

    jest.advanceTimersByTime(400); // For instruction display:none
    expect(instructionContainer.style.display).toBe('none');
  });

  // --- Test resetUIElements ---
  test('resetUIElements should restore initial UI state', () => {
    // Simulate a non-initial state
    UI.showMessage('Some message', 'warning');
    UI.showInlineMessage('name', 'Some error');
    UI.updateInputDisabledState(true);
    UI.showInstructions(); // Hides form/heading, shows instructions
    jest.advanceTimersByTime(510); // Ensure transitions complete
    const instructionCheckbox = document.getElementById('instruction-checkbox');
    instructionCheckbox.checked = true;

    // Reset
    UI.resetUIElements();

    // Check elements are back to initial state
    expect(document.getElementById('message').classList.contains('visible')).toBe(false);
    expect(document.getElementById('name-validation-msg').classList.contains('visible')).toBe(false);
    expect(document.getElementById('name').classList.contains('error-border')).toBe(false);
    expect(document.getElementById('name').disabled).toBe(false);
    expect(document.getElementById('email').disabled).toBe(false);
    expect(document.getElementById('phone-number').disabled).toBe(false);
    expect(document.getElementById('user-form').style.display).toBe('block');
    expect(document.getElementById('main-heading').style.display).toBe('block');
    expect(document.getElementById('instruction-container').style.display).toBe('none');
    expect(instructionCheckbox.checked).toBe(false);
    expect(document.getElementById('google-form-container').style.display).toBe('none');
    expect(document.getElementById('google-form-container').innerHTML).toBe('');
    expect(document.body.style.overflow).toBe('');
  });

  // --- Test applyDisqualificationUI ---
  test('applyDisqualificationUI should show message, hide elements, disable inputs', () => {
    const form = document.getElementById('user-form');
    const mainHeading = document.getElementById('main-heading');
    const instructionContainer = document.getElementById('instruction-container');
    const googleFormContainer = document.getElementById('google-form-container');
    const messageDiv = document.getElementById('message');
    const submitButton = document.getElementById('submit-button');
    const nameInput = document.getElementById('name');

    // Show google form to have something to hide
    UI.showGoogleForm('http://example.com');
    jest.advanceTimersByTime(410); // Ensure transitions complete

    UI.applyDisqualificationUI('Test Disqualification');

    // Check message
    expect(messageDiv.innerHTML).toBe('Test Disqualification');
    expect(messageDiv.classList.contains('warning')).toBe(true);
    expect(messageDiv.classList.contains('visible')).toBe(true);
    expect(messageDiv.style.position).toBe('fixed');
    expect(messageDiv.style.zIndex).toBe('2000');

    // Check elements start hiding
    expect(form.classList.contains('hidden-fade')).toBe(true);
    expect(mainHeading.classList.contains('hidden-fade')).toBe(true);
    expect(instructionContainer.classList.contains('visible')).toBe(false);
    expect(googleFormContainer.classList.contains('visible')).toBe(false);

    // Check inputs/button disabled
    expect(submitButton.disabled).toBe(true);
    expect(nameInput.disabled).toBe(true);
    expect(document.body.style.overflow).toBe('');

    // Fast-forward timers
    jest.advanceTimersByTime(800); // Longest timeout
    expect(form.style.display).toBe('none');
    expect(mainHeading.style.display).toBe('none');
    expect(instructionContainer.style.display).toBe('none');
    expect(googleFormContainer.style.display).toBe('none');
    expect(googleFormContainer.innerHTML).toBe(''); // Should be cleared
  });

  // --- Test updateTimerDisplay ---
  test('updateTimerDisplay should set text and toggle visibility', () => {
    const timerDisplay = document.getElementById('timer-display');
    UI.updateTimerDisplay('10:00', true);
    expect(timerDisplay.textContent).toBe('10:00');
    expect(timerDisplay.classList.contains('visible')).toBe(true);

    UI.updateTimerDisplay('09:59', true);
    expect(timerDisplay.textContent).toBe('09:59');
    expect(timerDisplay.classList.contains('visible')).toBe(true);

    UI.updateTimerDisplay('00:00', false);
    expect(timerDisplay.textContent).toBe('00:00');
    expect(timerDisplay.classList.contains('visible')).toBe(false);
  });
});
