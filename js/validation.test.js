// validation.test.js
import { validateField } from './validation';

// Mock fetch (already done in setup, but we'll override implementation per test)
// Mock the disqualification callback
const mockHandleDisqualification = jest.fn();

describe('Validation Module - validateField', () => {
  beforeEach(() => {
    // Reset mocks and DOM before each test
    jest.clearAllMocks();
    document.body.innerHTML = `
      <div><input type="text" id="name" value=""></div>
      <div><input type="email" id="email" value=""></div>
      <div><input type="text" id="phone-number" value=""></div>
    `;
    // Reset fetch mock implementation for each test
    global.fetch = jest.fn(() => Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ exists: false }), // Default: user is unique
    }));
  });

  test('should return invalid if field is required and empty', async () => {
    const nameInput = document.getElementById('name');
    nameInput.value = ' '; // Empty after trim

    const result = await validateField('name', mockHandleDisqualification);

    expect(result.isValid).toBe(false);
    expect(result.message).toBe('Name is required.');
    expect(global.fetch).not.toHaveBeenCalled();
    expect(mockHandleDisqualification).not.toHaveBeenCalled();
  });

  test('should return valid if field is not found', async () => {
    const result = await validateField('nonexistent', mockHandleDisqualification);
    expect(result.isValid).toBe(true);
    expect(result.message).toBeNull();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test('should call fetch with correct URL for email check', async () => {
    const emailInput = document.getElementById('email');
    emailInput.value = 'test@example.com';

    await validateField('email', mockHandleDisqualification);

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      `/check-user?field=email&value=${encodeURIComponent('test@example.com')}`
    );
  });

   test('should call fetch with correct URL for phone check', async () => {
    const phoneInput = document.getElementById('phone-number');
    phoneInput.value = '1234567890';

    await validateField('phone', mockHandleDisqualification);

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      `/check-user?field=phone&value=${encodeURIComponent('1234567890')}`
    );
  });

  test('should return valid if fetch returns 404 (user not found)', async () => {
    const emailInput = document.getElementById('email');
    emailInput.value = 'new@example.com';

    global.fetch.mockImplementationOnce(() => Promise.resolve({
      ok: false, // 404 is not ok
      status: 404,
      json: () => Promise.resolve({ message: 'Not Found' }), // Simulate server response
    }));

    const result = await validateField('email', mockHandleDisqualification);

    expect(result.isValid).toBe(true);
    expect(result.message).toBeNull();
    expect(mockHandleDisqualification).not.toHaveBeenCalled();
  });

  test('should return invalid if fetch returns 200 OK with exists: true, disqualified: false', async () => {
    const emailInput = document.getElementById('email');
    emailInput.value = 'exists@example.com';

    global.fetch.mockImplementationOnce(() => Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ exists: true, disqualified: false, message: 'User already exists.' }),
    }));

    const result = await validateField('email', mockHandleDisqualification);

    expect(result.isValid).toBe(false);
    expect(result.message).toBe('User already exists.');
    expect(mockHandleDisqualification).not.toHaveBeenCalled();
  });

  test('should return invalid and call callback if fetch returns 200 OK with exists: true, disqualified: true', async () => {
    const phoneInput = document.getElementById('phone-number');
    phoneInput.value = '9876543210';

    global.fetch.mockImplementationOnce(() => Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ exists: true, disqualified: true, message: 'User disqualified.' }),
    }));

    const result = await validateField('phone', mockHandleDisqualification);

    expect(result.isValid).toBe(false);
    expect(result.message).toBe('User disqualified.');
    expect(mockHandleDisqualification).toHaveBeenCalledTimes(1);
    expect(mockHandleDisqualification).toHaveBeenCalledWith('User disqualified.');
  });

   test('should return invalid and call callback if fetch returns non-OK (e.g., 409) with exists: true, disqualified: true', async () => {
    const emailInput = document.getElementById('email');
    emailInput.value = 'disqualified@example.com';

    global.fetch.mockImplementationOnce(() => Promise.resolve({
      ok: false,
      status: 409, // Example conflict status
      json: () => Promise.resolve({ exists: true, disqualified: true, message: 'Conflict: User disqualified.' }),
    }));

    const result = await validateField('email', mockHandleDisqualification);

    expect(result.isValid).toBe(false);
    expect(result.message).toBe('Conflict: User disqualified.');
    expect(mockHandleDisqualification).toHaveBeenCalledTimes(1);
    expect(mockHandleDisqualification).toHaveBeenCalledWith('Conflict: User disqualified.');
  });

   test('should return invalid if fetch returns non-OK (e.g., 409) with exists: true, disqualified: false', async () => {
    const emailInput = document.getElementById('email');
    emailInput.value = 'conflict@example.com';

    global.fetch.mockImplementationOnce(() => Promise.resolve({
      ok: false,
      status: 409, // Example conflict status
      json: () => Promise.resolve({ exists: true, disqualified: false, message: 'Conflict: User exists.' }),
    }));

    const result = await validateField('email', mockHandleDisqualification);

    expect(result.isValid).toBe(false);
    expect(result.message).toBe('Conflict: User exists.');
    expect(mockHandleDisqualification).not.toHaveBeenCalled();
  });


  test('should return invalid if fetch throws a network error', async () => {
    const nameInput = document.getElementById('name');
    nameInput.value = 'Network Error Test';

    const networkError = new Error('Network connection failed');
    global.fetch.mockImplementationOnce(() => Promise.reject(networkError));

    const result = await validateField('name', mockHandleDisqualification);

    expect(result.isValid).toBe(false);
    expect(result.message).toBe('Could not verify name. Check connection.');
    expect(mockHandleDisqualification).not.toHaveBeenCalled();
  });

   test('should return invalid if fetch response is not valid JSON (non-404 error)', async () => {
    const emailInput = document.getElementById('email');
    emailInput.value = 'badjson@example.com';

    global.fetch.mockImplementationOnce(() => Promise.resolve({
      ok: false,
      status: 500, // Internal Server Error
      // Simulate non-JSON response
      json: () => Promise.reject(new SyntaxError("Unexpected token < in JSON at position 0")),
      // Or text: () => Promise.resolve('<html>Server Error</html>')
    }));

    const result = await validateField('email', mockHandleDisqualification);

    expect(result.isValid).toBe(false);
    // It falls into the generic error handling in the catch block of validateField
    expect(result.message).toContain('Could not verify email.');
    expect(mockHandleDisqualification).not.toHaveBeenCalled();
  });

   test('should return valid if fetch returns 200 OK with exists: false', async () => {
    const emailInput = document.getElementById('email');
    emailInput.value = 'unique@example.com';

    // Default mock implementation already covers this
    // global.fetch.mockImplementationOnce(() => Promise.resolve({
    //   ok: true,
    //   status: 200,
    //   json: () => Promise.resolve({ exists: false }),
    // }));

    const result = await validateField('email', mockHandleDisqualification);

    expect(result.isValid).toBe(true);
    expect(result.message).toBeNull();
    expect(mockHandleDisqualification).not.toHaveBeenCalled();
  });
});
