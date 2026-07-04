import { useState, useEffect } from 'react';

export const useLocalStorage = (key, initialValue) => {
  // 1. സ്റ്റേറ്റ് സെറ്റ് ചെയ്യുന്നു
  const [value, setValue] = useState(() => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : initialValue;
  });

  // 2. വാല്യൂ മാറുമ്പോൾ ലോക്കൽ സ്റ്റോറേജിലേക്ക് സേവ് ചെയ്യുന്നു
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};