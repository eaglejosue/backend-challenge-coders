import React from 'react';

export interface SearchInputProps {
  placeholder: string;
  onChange: (value: string) => void;
  onEnter?: () => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  placeholder,
  onChange,
  onEnter
}) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <div className="input-group d-flex align-items-center bg-body-bg p-2 rounded ">
      <span className="material-symbols-outlined px-2">search</span>
      <input
        type="text"
        className="form-control border-0"
        placeholder={placeholder}
        onChange={handleInputChange}
        onKeyDown={(e) => {e.key === 'Enter' && onEnter && onEnter()}}
        aria-label="Search field"
        aria-describedby="button-addon1"
      />
    </div>
  );
};

export default SearchInput;
