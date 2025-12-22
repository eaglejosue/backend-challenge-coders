import React, { CSSProperties, useState, useEffect, useRef } from 'react';
import { useSpring, animated } from 'react-spring';
import { v4 as uuidv4 } from 'uuid';
import './customInput.scss';

import {
  handleCnpjChange,
  handlePercentageChange,
  handleNumberChange,
  handleTelefoneChange,
  handleCepChange,
  handleCpfChange,
  handleEmailChange,
  handleMoneyChange,
} from './masks';

type InputType =
  | 'text'
  | 'percentage'
  | 'number'
  | 'cnpj'
  | 'password'
  | 'email'
  | 'telefone'
  | 'date'
  | 'datetime'
  | 'cep'
  | 'money'
  | 'cpf';

interface Suggestion {
  id: number;
  value: string;
}

interface CustomInputProps {
  setValue: any;
  register: any;
  errors: any;
  type: InputType;
  disabled?: boolean;
  label?: string;
  placeholder?: string;
  name: string;
  validationSchema?: any;
  customValidation?: (value: string) => boolean | string;
  minLength?: number | undefined;
  maxLength?: number | undefined;
  divClassName?: string;
  inputStyle?: CSSProperties | undefined;
  passBtnLeft?: string;
  onFetchSuggestions?: (query: string) => any;
  onBlur?: () => void;
  onEnter?: () => void;
}

const CustomInput: React.FC<CustomInputProps> = ({
  setValue,
  register,
  errors,
  type,
  disabled = false,
  label,
  placeholder,
  name,
  validationSchema,
  customValidation,
  minLength,
  maxLength,
  divClassName = '',
  inputStyle,
  passBtnLeft,
  onFetchSuggestions,
  onBlur,
  onEnter
}) => {
  const [isFocused, setFocused] = useState<boolean>(false);
  const [hasValue, setHasValue] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const inputFor = `custom-input-${uuidv4()}`;
  const containerRef = useRef<HTMLDivElement>(null);

  const validate = customValidation
    ? (value: string) => {
      const customValidationResult = customValidation(value);
      return customValidationResult === true || customValidationResult || validationSchema?.validate?.(value);
    }
    : validationSchema?.validate;

  useEffect(() => {
    if (type === 'money') {
      setValue(name, 'R$ 0,00');
    }
  }, [setValue, name, type]);

  const formatDateTime = (value: string) => {
    if (!value) {
      return '0000-00-00T00:00';
    }
    const [date, time] = value.split('T');
    const formattedDate = date || '0000-00-00';
    const formattedTime = time || '00:00';
    return `${formattedDate}T${formattedTime}`;
  };

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;

    if (inputValue && inputValue !== '') setHasValue(true);

    switch (type) {
      case "percentage":
        setValue(name, handlePercentageChange(inputValue));
        break;
      case "number":
        setValue(name, handleNumberChange(inputValue));
        break;
      case "cnpj":
        setValue(name, handleCnpjChange(inputValue));
        break;
      case "telefone":
        setValue(name, handleTelefoneChange(inputValue));
        break;
      case "cep":
        setValue(name, handleCepChange(inputValue));
        break;
      case "cpf":
        setValue(name, handleCpfChange(inputValue));
        break;
      case "email":
        setValue(name, handleEmailChange(inputValue));
        break;
      case "money":
        setValue(name, handleMoneyChange(inputValue));
        break;
      case "datetime":
        setValue(name, formatDateTime(inputValue));
        break;
      default:
        setValue(name, inputValue);
        break;
    }

    onFetchSuggestions && setSuggestions(onFetchSuggestions(inputValue));
  };

  const handleFocus = () => {
    setFocused(true);
    if (onFetchSuggestions) {
      setSuggestions(onFetchSuggestions(''));
    }
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    setFocused(false);
    const inputValue = event.target.value;
    if (type === 'datetime' && !inputValue) {
      setValue(name, formatDateTime(''));
    }
    onBlur && onBlur();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const inputValue = (e.target as HTMLInputElement).value;
      if (type === 'datetime' && !inputValue) {
        setValue(name, formatDateTime(''));
      }
      onEnter && onEnter();
    }
  };

  const labelProps = useSpring({
    top: hasValue || isFocused ? '-10px' : '10px',
    fontSize: hasValue || isFocused ? '12px' : '16px',
    config: { duration: 200 },
  });

  const getStyles = (disabled: boolean, errors: boolean) => {
    let bgColor = 'bg-white';
    let borderColor = 'border';
    let textColor = 'custom-gray';

    if (disabled) {
      bgColor = 'bg-white mouse-no-drop';
      borderColor = 'border';
      textColor = 'text-custom-gray ';
    } else if (errors) {
      borderColor = 'danger-border';
      textColor = 'text-danger f-12';
    }

    return { bgColor, borderColor, textColor };
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setValue(name, suggestion.value);
    setSuggestions([]);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
      setSuggestions([]);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef} className={`position-relative ${divClassName}`}>
      {register ? (
        <div className='input-group'>
          <input
            {...register(name, { ...validationSchema, validate } )}
            id={inputFor}
            type={type === 'password' ? (showPassword ? 'text' : 'password') :
              (type === 'date' ? 'date' : type === 'datetime' ? 'datetime-local' : 'text')
            }
            placeholder={type === 'money' ? '' : placeholder}
            className={`p-2 w-100 rounded f-14
              ${getStyles(disabled, errors).bgColor}
              ${getStyles(disabled, errors).borderColor}`
            }
            disabled={disabled}
            autoComplete='off'
            
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            style={inputStyle}
            minLength={minLength}
            maxLength={maxLength}
          />
          {type === 'password' && (
            <button className='btn d-flex align-items-center'
              type='button'
              style={{
                position: 'absolute',
                top: '10%',
                left: (passBtnLeft ?? '87%')
              }}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword
                ?
                <span className='material-symbols-outlined fs-5'>
                  visibility
                </span>
                :
                <span className='material-symbols-outlined fs-5' >
                  visibility_off
                </span>
              }
            </button>
          )}
        </div>
      ) : null}

      {label &&
        <animated.label
          htmlFor={inputFor}
          className={
            !hasValue && !isFocused
              ? `position-absolute start-0 ms-3 f-16 ${getStyles(disabled, errors).textColor
              } z-index-1`
              : `px-1 position-absolute start-0 bottom-90 ${getStyles(disabled, errors).bgColor
              } z-index-1 ms-2 f-12 ${getStyles(disabled, errors).textColor}`
          }
          style={labelProps}
        >
          {label}
        </animated.label>
      }

      {suggestions.length > 0 && (
        <ul className="suggestions-list position-absolute bg-white w-100 p-0 list-unstyled border" style={{ zIndex: 1000 }}>
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="p-2 border-bottom suggestion-item"
              style={{ cursor: 'pointer' }}
              onMouseDown={() => handleSuggestionClick(suggestion)}
            >
              {suggestion.value}
            </li>
          ))}
        </ul>
      )}

      {errors && <span className='d-flex justify-content-start text-danger f-12'>{errors.message}</span>}
    </div>
  );
};

export default CustomInput;
