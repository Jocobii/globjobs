import { useState, useEffect } from 'react';

export default function useLocalStorage(key: string, defaultValue: string | number | object) {
  const [storedValue, setStoredValue] = useState(() => {
    const value = localStorage.getItem(key);

    return value !== null ? JSON.parse(value) : defaultValue;
  });

  useEffect(() => {
    const listener = (event: StorageEvent) => {
      if (event.storageArea === localStorage && event.key === key && event.newValue !== null) {
        setStoredValue(JSON.parse(event.newValue));
      }
    };

    window.addEventListener('storage', listener);

    return () => {
      window.removeEventListener('storage', listener);
    };
  }, [key, defaultValue]);

  const setValue = (newValue: (v: object) => void | object) => {
    setStoredValue((currentValue: object) => {
      const valueToStore = newValue instanceof Function ? newValue(currentValue) : newValue;
      localStorage.setItem(key, JSON.stringify(valueToStore));

      return valueToStore;
    });
  };

  return [storedValue, setValue];
}
