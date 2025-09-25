// src/utils/safeStorage.js
export const safeStorage = {
  get(key) {
    try {
      if (typeof window === "undefined") return null;
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key, val) {
    try {
      if (typeof window === "undefined") return;
      window.localStorage.setItem(key, val);
    } catch {
      // ignore storage error
    }
  },
  del(key) {
    try {
      if (typeof window === "undefined") return;
      window.localStorage.removeItem(key);
    } catch {
      // ignore
    }
  },
};
