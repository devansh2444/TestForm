// jest.setup.js
// Mock localStorage
const localStorageMock = (() => {
    let store = {};
    return {
      getItem: jest.fn((key) => store[key] || null),
      setItem: jest.fn((key, value) => { store[key] = value.toString(); }),
      removeItem: jest.fn((key) => { delete store[key]; }),
      clear: jest.fn(() => { store = {}; }),
    };
  })();
  Object.defineProperty(window, 'localStorage', { value: localStorageMock });
  
  // Mock fetch
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({}),
    })
  );
  
  // Mock alert
  global.alert = jest.fn();
  
  // Mock html2canvas if you were using it
  // global.html2canvas = jest.fn(() => Promise.resolve({ toDataURL: () => 'fake_data_url' }));
  
  // Mock requestAnimationFrame for jsdom environment if needed for transitions/animations
  global.requestAnimationFrame = (callback) => {
      setTimeout(callback, 0);
  };
  global.cancelAnimationFrame = (id) => {
      clearTimeout(id);
  };
  
  // Clear mocks before each test
  beforeEach(() => {
      localStorageMock.clear();
      localStorageMock.getItem.mockClear();
      localStorageMock.setItem.mockClear();
      localStorageMock.removeItem.mockClear();
      global.fetch.mockClear();
      global.alert.mockClear();
      document.body.innerHTML = ''; // Clean the DOM
      jest.useRealTimers(); // Reset timers
  });
  