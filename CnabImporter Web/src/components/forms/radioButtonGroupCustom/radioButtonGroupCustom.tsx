import { v4 as uuidv4 } from "uuid";
import styles from "./RadioButtonGroupCustom.module.scss";

interface Option<T> {
  label: string;
  value: T;
}

interface RadioButtonGroupProps<T> {
  title: string;
  options: Option<T>[];
  register: any;
  errors: any;
  name: string;
  validationSchema: any;
  setValue: any;
}

const RadioButtonGroupCustom = <T,>({
  title,
  options,
  register,
  errors,
  name,
  validationSchema,
  setValue
}: RadioButtonGroupProps<T>) => {
  const radioGroupName = uuidv4();

  const handleChange = (value: string) => {
    setValue(name, value);
  };

  return (
    <div>
      <div className="d-flex align-items-center">
        <p className="f-16 text-dark mb-0">{title}</p>
      </div>

      <div className="d-flex">
        {options.map((option, index) => (
          <div key={index} className={`me-4 ${styles["radio-custom"]}`}>
            <input
              {...register(name, validationSchema)}
              type="radio"
              id={`radio-${radioGroupName}-${index}`}
              name={"radio-group-" + radioGroupName}
              value={String(option.value)}
              onChange={() => handleChange(String(option.value))}
            />
            <label
              htmlFor={`radio-${radioGroupName}-${index}`}
              className="ms-1"
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>

      {errors && <span className="text-danger">{errors.message}</span>}
    </div>
  );
};

export default RadioButtonGroupCustom;
