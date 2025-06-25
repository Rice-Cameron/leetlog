import React from "react";
import Select from "react-select";

interface ComplexityOption {
  value: string;
  label: string;
}

interface ComplexityInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

const complexityOptions: ComplexityOption[] = [
  { value: "O(1)", label: "O(1)" },
  { value: "O(log n)", label: "O(log n)" },
  { value: "O(n)", label: "O(n)" },
  { value: "O(n log n)", label: "O(n log n)" },
  { value: "O(n^2)", label: "O(n²)" },
];

export default function ComplexityInput({
  value,
  onChange,
  placeholder,
}: ComplexityInputProps) {
  const handleChange = (option: ComplexityOption | null) => {
    if (option) {
      onChange(option.value);
    }
  };

  return (
    <div className="relative">
      <Select
        value={complexityOptions.find((opt) => opt.value === value)}
        onChange={handleChange}
        options={complexityOptions}
        placeholder={placeholder}
        className="w-full"
        menuPortalTarget={typeof window !== "undefined" ? document.body : null}
        styles={{
          control: (provided) => ({
            ...provided,
            border: "2px solid #e5e7eb",
            borderRadius: "0.5rem",
            padding: "0.5rem",
            minHeight: "2.5rem",
            backgroundColor: "white",
          }),
          menu: (provided) => ({
            ...provided,
            backgroundColor: "#ffffff",
            maxHeight: "160px",
            overflowY: "auto",
            zIndex: 9999,
            position: "absolute",
            width: "100%",
            minWidth: "100%",
            borderRadius: "0.5rem",
            WebkitBorderRadius: "0.5rem",
            MozBorderRadius: "0.5rem",
            boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
            left: 0,
          }),
          menuPortal: (base) => ({
            ...base,
            zIndex: 9999,
          }),
          option: (provided, state) => ({
            ...provided,
            color: "#1f2937",
            backgroundColor: state.isFocused ? "#f3f4f6" : "#ffffff",
            padding: "0.5rem 1rem",
          }),
          singleValue: (provided) => ({
            ...provided,
            color: "#1f2937",
            fontSize: "0.875rem",
          }),
          input: (provided) => ({
            ...provided,
            color: "#1f2937",
            fontSize: "0.875rem",
          }),
          placeholder: (provided) => ({
            ...provided,
            color: "#9ca3af",
            fontSize: "0.875rem",
          }),
        }}
        menuPlacement="auto"
      />
    </div>
  );
}
