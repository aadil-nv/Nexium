import React, { useState, useEffect } from "react";

interface DebouncedInputProps {
  value: string;
  onChange: (value: string) => void;
  className: string;
  placeholder: string;
}

const DebouncedInput: React.FC<DebouncedInputProps> = ({
  value: initialValue,
  onChange,
  className,
  placeholder,
}) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, 500);
    return () => clearTimeout(timeout);
  }, [value, onChange]);

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className={className}
      placeholder={placeholder}
    />
  );
};

export default DebouncedInput;
