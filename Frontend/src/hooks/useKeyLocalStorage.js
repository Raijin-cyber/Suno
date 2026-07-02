import { useState, useCallback } from "react";

const useKeyLocalStorage = (key, initialValue) => {
  const [error, setError] = useState(null);
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (err) {
      console.error(err);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value) => {
      try {
        setStoredValue(value);
        localStorage.setItem(key, JSON.stringify(value));
        setError(null);
      } catch (err) {
        console.error(err);
        setError(err);
      }
    },
    [key]
  );

  const clearKey = useCallback(() => {
    try {
      localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (err) {
      console.error(err);
      setError(err);
    }
  }, [key, initialValue]);

  return { storedValue, setValue, clearKey, error };
};

export default useKeyLocalStorage;
