import React, { useEffect, useState } from "react";
import Spinner from "react-bootstrap/esm/Spinner";
import { useSpring, animated } from "react-spring";
import { v4 as uuidv4 } from "uuid";

interface CustomSelectProps {
  register: any;
  errors: any;
  name: string;
  validationSchema: any;
  options: Array<{ value: string | number; label: string }>;
  disabled?: boolean;
  label: string;
  loading?: boolean;
  divClassName?: string;
  selectedValue?:any;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  register,
  errors,
  name,
  validationSchema,
  options,
  disabled = false,
  divClassName = '',
  label,
  loading,
  selectedValue
}) => {
  const inputFor = `custom-select-${uuidv4()}`;
  const styles = { paddingTop: "0.75rem", paddingBottom: "0.5rem" };
  const [selectedOption, setSelectedOption] = useState("");
  const [hasValue, setHasValue] = useState(true);
  
  const labelProps = useSpring({
    top: hasValue ? "-10px" : "10px",
    fontSize: hasValue ? "12px" : "16px",
    config: { duration: 200 },
  });

  useEffect(() => {
    setHasValue(true);
  }, [selectedOption]);

  return (
    <div className={`position-relative w-100 ${divClassName}`}>
      {!loading ? (
        <select
          id={inputFor}
          style={styles}
          className={`bg-white w-100 rounded ${
            errors && "danger-border"
          }`}
          onChange={(e) => setSelectedOption(e.target.value)}
          disabled={disabled}
          {...(register !== undefined ? register(name, validationSchema) : {})}
        >
          <option value=""></option>
          {options?.map((option, index) => (
            <option key={index} value={option.value} selected={selectedValue == option.value} >
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <Spinner animation="border" size="sm" />
      )}
      <animated.label
        htmlFor={inputFor}
        className={
          !hasValue
            ? `position-absolute start-0 ms-3 f-16 ${
                errors && "text-danger f-12"
              } z-index-1`
            : `px-1 position-absolute start-0 bottom-80 bg-white z-index-1 ms-2 f-12 ${
                errors && "text-danger f-12"
              }`
        }
        style={labelProps}
      >
        {label}
      </animated.label>

      {errors && <span className="text-danger f-12">{errors.message}</span>}
    </div>
  );
};

export default CustomSelect;
