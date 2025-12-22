import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { handleCepChange } from './masks';
import { animated, useSpring } from 'react-spring';

export interface CepInputProps {
  setValue: any;
  register: any;
  errors: any;
  name: string;
  validationSchema: any;
  placeholder: string;
  onChange: (value: string) => void;
  buscarCEP: () => void;
  label: string;
}

const CepInput: React.FC<CepInputProps> = ({
  setValue,
  register,
  errors,
  name,
  validationSchema,
  placeholder,
  onChange,
  buscarCEP,
  label
}) => {
  const inputFor = `cpf-input-${uuidv4()}`;
  const [isFocused, setFocused] = useState<boolean>(false);
  const [hasValue, setHasValue] = useState(true);

  const labelProps = useSpring({
    top: hasValue || isFocused ? '-10px' : '10px',
    fontSize: hasValue || isFocused ? '12px' : '16px',
    config: { duration: 200 },
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = event.target.value;

    if (inputValue && inputValue !== '') setHasValue(true);

    inputValue = handleCepChange(inputValue);
    setValue(name, inputValue);
    onChange(inputValue);
  };

  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    buscarCEP();
  };

  return (
    <div className="position-relative form-group">
      <div className="input-group d-flex align-items-center bg-body-bg border rounded ">
        <input
          {...register(name, validationSchema)}
          id={inputFor}
          type="text"
          placeholder={placeholder}
          className={`form-control border-0 ${
            errors && "danger-border"
          }`}
          onChange={handleInputChange}
          onFocus={() => { setFocused(true); }}
          onBlur={() => { setFocused(false); }}
          aria-label="Search field"
          aria-describedby="button-addon1"
        />
        <button className='btn pt-1 pb-0 px-2' onClick={handleButtonClick}>
          <span className="material-symbols-outlined mt-1 text-primary">search</span>
        </button>
      </div>

      <animated.label
        htmlFor={inputFor}
        className={
          !hasValue && !isFocused
            ? `position-absolute start-0 ms-3 f-16 ${errors && "text-danger"}
            z-index-1`
            : `px-1 position-absolute start-0 bottom-90 ${errors && "text-danger"}
            z-index-1 ms-2 f-12 ${errors && "text-danger"}`
        }
        style={labelProps}
      >
        {label}
      </animated.label>

      <animated.label
        htmlFor={inputFor}
        className={
          !hasValue
            ? `position-absolute start-0 ms-3 f-16 ${
                errors && "text-danger"
              } z-index-1`
            : `px-1 position-absolute start-0 bottom-80 bg-white z-index-1 ms-2 f-12 ${
                errors && "text-danger"
              }`
        }
        style={labelProps}
      >
        {label}
      </animated.label>

      {errors && <span className='d-flex justify-content-start text-danger f-12'>{errors.message}</span>}
    </div>
  );
};

export default CepInput;
