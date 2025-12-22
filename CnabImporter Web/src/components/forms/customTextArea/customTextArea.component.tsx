import React, { CSSProperties, useState } from 'react';
import { useSpring, animated } from 'react-spring';
import { v4 as uuidv4 } from 'uuid';

type InputType = 'text';

interface CustomTextAreaProps {
  setValue: any;
  register: any;
  errors: any;
  type: InputType;
  disabled?: boolean;
  label: string;
  placeholder?: string;
  name: string;
  validationSchema?: any;
  divClassName?: string;
  style?: CSSProperties | undefined;
  minLength?: number | undefined;
  maxLength?: number | undefined;
  rows?:number
}

const CustomTextArea: React.FC<CustomTextAreaProps> = ({
  setValue,
  register,
  errors,
  disabled = false,
  label,
  placeholder,
  name,
  validationSchema,
  divClassName = '',
  style: inputStyle,
  minLength,
  maxLength,
  rows
}) => {
  const [isFocused, setFocused] = useState<boolean>(false);
  const [hasValue, setHasValue] = useState(true);
  const inputFor = `custom-input-${uuidv4()}`;

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = event.target.value;

    if (inputValue && inputValue !== '') setHasValue(true);

    setValue(name, inputValue);
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
      textColor = 'text-danger';
    }

    return { bgColor, borderColor, textColor };
  };

  return (
    <div className={`position-relative  ${divClassName}`}>
      {register ? (
        <div className='input-group'>
          <textarea
            {...register(name, validationSchema)}
            id={inputFor}
            placeholder={placeholder}
            className={`p-2 w-100 rounded
              ${getStyles(disabled, errors).bgColor}
              ${getStyles(disabled, errors).borderColor}`
            }
            disabled={disabled}
            onChange={handleChange}
            rows={rows}
            onFocus={() => { setFocused(true); }}
            onBlur={() => { setFocused(false); }}
            style={inputStyle}
            minLength={minLength}
            maxLength={maxLength}
          />
        </div>
      ) : null}

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

      {errors && <span className='d-flex justify-content-start text-danger f-12'>{errors.message}</span>}
    </div>
  );
};

export default CustomTextArea;
