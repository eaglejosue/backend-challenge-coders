import React, { useState } from 'react';

export interface DropdownSelectProps {
  options: { label: string; value: string }[]; // As opções para o dropdown
  placeholder: string; // Placeholder que age como label
  startValue?: string; // Valor inicial
  onChange: (value: string) => void; // Função para tratar a mudança de seleção
  disabled?: boolean;
}

const DropdownSelect: React.FC<DropdownSelectProps> = ({
  options,
  placeholder,
  startValue,
  onChange,
  disabled = false
}) => {
  const [selectedValue, setSelectedValue] = useState( startValue ?? '');

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedValue(e.target.value);
    onChange(e.target.value);
  };

  return (
    <div className="input-group d-flex align-items-center bg-body-bg p-2 rounded">
      <select
        className="form-select border-0"
        value={selectedValue}
        onChange={handleSelectChange}
        aria-label="Dropdown select"
        disabled={disabled}
      >
        <option value="" disabled defaultValue='1'>
          {placeholder}
        </option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DropdownSelect;
