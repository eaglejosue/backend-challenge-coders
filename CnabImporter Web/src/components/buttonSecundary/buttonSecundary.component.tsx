import { ButtonProps } from "../buttonPrimary/buttonPrimary.component";

const ButtonSecondary = ({
  text,
  className,
  width = "100%",
  color = "#6D6D6D",
  onClick,
  enabled = true
}: ButtonProps) => {
  return (
    <button className={enabled ? `btn btn-outline-light ${className}` : `btn btn-outline-light ${className} disabled`}
      style={{
        width,
        color,
        borderColor: "#6D6D6D"
      }}
      onClick={onClick}
      type="button"
    >
      {text}
    </button>
  );
}

export default ButtonSecondary;
