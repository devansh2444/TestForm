// js/ui.js

// --- Exported UI Functions ---

export function showMessage(text, type = 'error') {
    const messageDiv = document.getElementById('message');
    if (!messageDiv) return; // Guard clause
    messageDiv.innerHTML = text;
    messageDiv.className = ''; // Clear previous classes first
    messageDiv.classList.add(type);
    messageDiv.classList.add('visible');
}

export function hideMessage() {
    const messageDiv = document.getElementById('message');
    if (!messageDiv) return;
    messageDiv.classList.remove('visible');
}

export function showInlineMessage(field, message) {
    let elementId, inputId;
    if (field === 'name') { elementId = 'name-validation-msg'; inputId = 'name'; }
    else if (field === 'email') { elementId = 'email-validation-msg'; inputId = 'email'; }
    else if (field === 'phone') { elementId = 'phone-validation-msg'; inputId = 'phone-number'; }
    else { return; }

    const element = document.getElementById(elementId);
    const inputElement = document.getElementById(inputId);
    if (!element) return; // Guard clause

    element.textContent = message || ''; // Set text or clear

    if (message) {
        element.classList.add('visible');
        if (inputElement) inputElement.classList.add('error-border');
    } else {
        element.classList.remove('visible');
        if (inputElement) inputElement.classList.remove('error-border');
    }
}

export function updateSubmitButtonState(isDisabled) {
    const submitButton = document.getElementById('submit-button');
    if (!submitButton) return;
    submitButton.disabled = isDisabled;
}

export function updateInputDisabledState(isDisabled) {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone-number');
    if (nameInput) nameInput.disabled = isDisabled;
    if (emailInput) emailInput.disabled = isDisabled;
    if (phoneInput) phoneInput.disabled = isDisabled;
}

export function showInstructions() {
    const form = document.getElementById('user-form');
    const mainHeading = document.getElementById('main-heading');
    const instructionContainer = document.getElementById('instruction-container');
    if (!form || !mainHeading || !instructionContainer) return;

    form.classList.add('hidden-fade');
    mainHeading.classList.add('hidden-fade');
    setTimeout(() => {
        if (form.classList.contains('hidden-fade')) form.style.display = 'none';
        if (mainHeading.classList.contains('hidden-fade')) mainHeading.style.display = 'none';
    }, 500);

    instructionContainer.style.display = 'block';
    setTimeout(() => {
        instructionContainer.classList.add('visible');
    }, 10);
}

export function showGoogleForm(googleFormUrl) {
    const instructionContainer = document.getElementById('instruction-container');
    const googleFormContainer = document.getElementById('google-form-container');
    if (!instructionContainer || !googleFormContainer) return;

    instructionContainer.classList.remove('visible');
    setTimeout(() => { if (!instructionContainer.classList.contains('visible')) instructionContainer.style.display = 'none'; }, 400);

    googleFormContainer.style.position = 'fixed';
    googleFormContainer.style.top = '0';
    googleFormContainer.style.left = '0';
    googleFormContainer.style.width = '100vw';
    googleFormContainer.style.height = '100vh';
    googleFormContainer.style.margin = '0';
    googleFormContainer.style.padding = '0';
    googleFormContainer.style.border = 'none';
    googleFormContainer.style.boxShadow = 'none';
    googleFormContainer.style.background = 'white';
    googleFormContainer.style.zIndex = '1000';

    googleFormContainer.innerHTML = `<iframe src="${googleFormUrl}" style="width: 100%; height: 100%; border: none;" frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe>`;

    googleFormContainer.style.display = 'block';
    setTimeout(() => {
        googleFormContainer.classList.add('visible');
    }, 10);

    document.body.style.overflow = 'hidden';
}

export function resetUIElements() {
    const form = document.getElementById('user-form');
    const mainHeading = document.getElementById('main-heading');
    const instructionContainer = document.getElementById('instruction-container');
    const instructionCheckbox = document.getElementById('instruction-checkbox');
    const googleFormContainer = document.getElementById('google-form-container');

    hideMessage();
    showInlineMessage('name', null); // Use null to clear
    showInlineMessage('email', null);
    showInlineMessage('phone', null);

    if (form) {
        form.classList.remove('hidden-fade');
        form.style.display = 'block';
    }
    if (mainHeading) {
        mainHeading.classList.remove('hidden-fade');
        mainHeading.style.display = 'block';
    }
    if (instructionContainer) {
        instructionContainer.classList.remove('visible');
        instructionContainer.style.display = 'none';
    }
    if (instructionCheckbox) {
        instructionCheckbox.checked = false;
    }
    if (googleFormContainer) {
        googleFormContainer.innerHTML = '';
        googleFormContainer.style.cssText = '';
        googleFormContainer.classList.remove('visible');
        googleFormContainer.style.display = 'none';
    }

    document.body.style.overflow = '';
    updateInputDisabledState(false); // Re-enable inputs
}

export function applyDisqualificationUI(message) {
    const form = document.getElementById('user-form');
    const mainHeading = document.getElementById('main-heading');
    const instructionContainer = document.getElementById('instruction-container');
    const googleFormContainer = document.getElementById('google-form-container');
    const messageDiv = document.getElementById('message'); // Needed for positioning

    showMessage(message, 'warning'); // Show final disqualification message

    if (form) {
        form.classList.add('hidden-fade');
        setTimeout(() => {
             if (form.classList.contains('hidden-fade')) form.style.display = 'none';
        }, 500);
    }
     if (mainHeading) {
        mainHeading.classList.add('hidden-fade');
        setTimeout(() => {
             if (mainHeading.classList.contains('hidden-fade')) mainHeading.style.display = 'none';
        }, 500);
    }
    if (instructionContainer) {
        instructionContainer.classList.remove('visible');
        setTimeout(() => { if (!instructionContainer.classList.contains('visible')) instructionContainer.style.display = 'none'; }, 400);
    }
    if (googleFormContainer) {
        googleFormContainer.classList.remove('visible');
        googleFormContainer.innerHTML = '';
        googleFormContainer.style.cssText = '';
        setTimeout(() => {
             if (!googleFormContainer.classList.contains('visible')) googleFormContainer.style.display = 'none';
        }, 800);
    }

    document.body.style.overflow = '';
    if (messageDiv) {
        messageDiv.style.position = 'fixed'; // Ensure it stays fixed for centering
        messageDiv.style.zIndex = '2000';
    }
    updateSubmitButtonState(true); // Disable submit button
    updateInputDisabledState(true); // Disable inputs
}

export function updateTimerDisplay(timeString, isVisible) {
    const timerDisplay = document.getElementById('timer-display');
    if (!timerDisplay) return;
    timerDisplay.textContent = timeString;
    if (isVisible) {
        timerDisplay.classList.add('visible');
    } else {
        timerDisplay.classList.remove('visible');
    }
}
