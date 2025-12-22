export interface ButtonProps {
  text: string;
  className?: string;
  width?: string;
  color?: string;
  onClick?: any;
  enabled?: boolean;
}

const ButtonPrimary = ({
  text,
  className,
  width = "100%",
  onClick,
  enabled = true
}: ButtonProps) => {
  return (
    <button
      className={enabled ? `btn ${className ? className : ''}` : `btn ${className ? className : ''} disabled`}
      style={{
        width,
        color: enabled ? "white" : "#6D6D6D",
        border: enabled ? "none" : "",
        borderColor: "#6D6D6D"
      }}
      onClick={onClick}
      type="button"
    >
      {text}
    </button>
  );
}

export default ButtonPrimary;
