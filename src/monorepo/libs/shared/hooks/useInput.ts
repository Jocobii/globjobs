import { useState } from 'react';

export default function useInput<T>({
  validateValue,
  defaultValue,
}: {
  validateValue: (val?: T) => boolean,
  defaultValue?: T,
}) {
  const [enteredValue, setEnteredValue] = useState<T | undefined>(defaultValue);
  const [isTouched, setIsTouched] = useState(false);

  const valueIsValid = validateValue(enteredValue);
  const hasError = !valueIsValid && isTouched;

  const handleValueChange = (value: T) => setEnteredValue(value);
  const handleBlur = () => setIsTouched(true);

  return {
    value: enteredValue,
    isValid: valueIsValid,
    isTouched,
    hasError,
    handleValueChange,
    handleBlur,
  };
}
