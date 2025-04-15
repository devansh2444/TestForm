// timer.test.js
import { startTimer, stopTimer } from './timer';
import * as UI from './ui'; // Import UI module to mock it

// Mock the UI module
jest.mock('./ui', () => ({
  updateTimerDisplay: jest.fn(),
}));

describe('Timer Module', () => {
  beforeEach(() => {
    // Reset mocks and use fake timers before each test
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Restore real timers after each test
    jest.useRealTimers();
  });

  test('startTimer should initialize display, start interval, and call updateTimerDisplay', () => {
    const duration = 5 * 1000; // 5 seconds
    const onTimeout = jest.fn();

    startTimer(duration, onTimeout);

    // Check initial call
    expect(UI.updateTimerDisplay).toHaveBeenCalledTimes(1);
    expect(UI.updateTimerDisplay).toHaveBeenCalledWith('00:05', true); // Initial display

    // Advance time by 1 second
    jest.advanceTimersByTime(1000);
    expect(UI.updateTimerDisplay).toHaveBeenCalledTimes(2);
    expect(UI.updateTimerDisplay).toHaveBeenCalledWith('00:04', true);

    // Advance time by another 2 seconds
    jest.advanceTimersByTime(2000);
    // --- CHANGE HERE: Expect 4 calls total ---
    expect(UI.updateTimerDisplay).toHaveBeenCalledTimes(4); // 1 (initial) + 1 (after 1s) + 2 (during 2s advance) = 4
    // --- END CHANGE ---
    expect(UI.updateTimerDisplay).toHaveBeenCalledWith('00:02', true); // Check the last update value

    expect(onTimeout).not.toHaveBeenCalled();
  });
//     expect(UI.updateTimerDisplay).toHaveBeenCalledTimes(3); // Called again after 1s, then again after 1s
//     expect(UI.updateTimerDisplay).toHaveBeenCalledWith('00:02', true);

//     expect(onTimeout).not.toHaveBeenCalled();
//   });

  test('startTimer should call onTimeout callback when timer expires', () => {
    const duration = 3 * 1000; // 3 seconds
    const onTimeout = jest.fn();

    startTimer(duration, onTimeout);

    // Check initial call
    expect(UI.updateTimerDisplay).toHaveBeenCalledWith('00:03', true);

    // Advance time past the duration
    jest.advanceTimersByTime(3100); // Go slightly over 3 seconds

    // Check updates happened
    expect(UI.updateTimerDisplay).toHaveBeenCalledWith('00:02', true);
    expect(UI.updateTimerDisplay).toHaveBeenCalledWith('00:01', true);
    // Check final calls after expiry
    expect(UI.updateTimerDisplay).toHaveBeenCalledWith('00:00', false); // stopTimer calls this
    expect(onTimeout).toHaveBeenCalledTimes(1);

    // Ensure interval is cleared (stopTimer should be called internally)
    // Advance time again, no more calls should happen
    jest.advanceTimersByTime(2000);
    expect(onTimeout).toHaveBeenCalledTimes(1); // Still 1
    // updateTimerDisplay was called 1 (initial) + 3 (updates) + 1 (stop) = 5 times
    expect(UI.updateTimerDisplay).toHaveBeenCalledTimes(5);
  });

   test('startTimer should clear existing timer if called again', () => {
    const duration1 = 5000;
    const onTimeout1 = jest.fn();
    const duration2 = 3000;
    const onTimeout2 = jest.fn();

    // Start the first timer
    startTimer(duration1, onTimeout1);
    expect(UI.updateTimerDisplay).toHaveBeenCalledWith('00:05', true);
    const initialIntervalId = setInterval(() => {}, 1000); // Get a reference interval ID
    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');


    // Start the second timer immediately
    startTimer(duration2, onTimeout2);

    // Check that clearInterval was called for the first timer
    expect(clearIntervalSpy).toHaveBeenCalled();
    // Check that the new timer starts correctly
    expect(UI.updateTimerDisplay).toHaveBeenCalledWith('00:03', true);

    // Advance time for the second timer
    jest.advanceTimersByTime(3100);
    expect(onTimeout1).not.toHaveBeenCalled(); // First timeout should not trigger
    expect(onTimeout2).toHaveBeenCalledTimes(1); // Second timeout should trigger

    clearIntervalSpy.mockRestore();
  });

  test('stopTimer should clear interval and hide display', () => {
    const duration = 5000;
    const onTimeout = jest.fn();
    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');

    startTimer(duration, onTimeout);
    expect(UI.updateTimerDisplay).toHaveBeenCalledWith('00:05', true);

    // Advance time partially
    jest.advanceTimersByTime(2000);
    expect(UI.updateTimerDisplay).toHaveBeenCalledWith('00:03', true);

    // Stop the timer
    stopTimer();

    // Check interval was cleared
    expect(clearIntervalSpy).toHaveBeenCalled();
    // Check display was hidden
    expect(UI.updateTimerDisplay).toHaveBeenCalledWith('00:00', false);

    // Advance time further, ensure timeout and updates don't happen
    jest.advanceTimersByTime(4000);
    expect(onTimeout).not.toHaveBeenCalled();
    // Count calls: 1 (start) + 2 (updates) + 1 (stop) = 4
    expect(UI.updateTimerDisplay).toHaveBeenCalledTimes(4);

    clearIntervalSpy.mockRestore();
  });

   test('stopTimer should do nothing if no timer is running', () => {
    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
    stopTimer();
    expect(clearIntervalSpy).not.toHaveBeenCalled();
    expect(UI.updateTimerDisplay).not.toHaveBeenCalled(); // Should not be called if nothing to stop
     clearIntervalSpy.mockRestore();
  });
});
