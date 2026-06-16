/// <reference types="vitest/globals" />
import '@testing-library/jest-dom/vitest';

// jsdom doesn't implement ResizeObserver; provide a global mock
class ResizeObserverMock {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}
vi.stubGlobal('ResizeObserver', ResizeObserverMock);
