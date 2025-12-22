export const handleCepChange = (inputValue: string) => {
  inputValue = inputValue.replace(/\D/g, "");

  if (inputValue.length > 8) {
    inputValue = inputValue.slice(0, 8);
  }

  if (inputValue.length > 5) {
    inputValue = inputValue.replace(/(\d{5})(\d{1,3})/, "$1-$2");
  } else if (inputValue.length > 0) {
    inputValue = inputValue.replace(/(\d{1,5})/, "$1");
  }

  return inputValue;
};
