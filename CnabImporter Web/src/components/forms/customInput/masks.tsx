export const handlePercentageChange = (inputValue: string) => {
  if ((inputValue ?? '') === '') return '';
  inputValue = inputValue.replace(/[^0-9]/g, '');
  if (inputValue.length <= 2) {
    inputValue += '%';
  } else {
    const integerPart = inputValue.slice(0, -2);
    const decimalPart = inputValue.slice(-2);
    inputValue = `${integerPart},${decimalPart}%`;
  }
  return inputValue;
};

export const handleNumberChange = (inputValue: string) => {
  if ((inputValue ?? '') === '') return '';
  inputValue = inputValue.replace(/\D/g, '');
  return inputValue;
};

export const handleCnpjChange = (inputValue: string) => {
  if ((inputValue ?? '') === '') return '';
  inputValue = inputValue.replace(/[^0-9]/g, '');
  if (inputValue.length > 14) {
    inputValue = inputValue.slice(0, 14);
  }
  inputValue = inputValue.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
  return inputValue;
};

export const handleTelefoneChange = (inputValue: string) => {
  if ((inputValue ?? '') === '') return '';
  inputValue = inputValue.replace(/[^0-9]/g, '');
  if (inputValue.length > 11) {
    inputValue = inputValue.slice(0, 11);
  }
  inputValue = inputValue.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
  return inputValue;
};

export const handleCepChange = (inputValue: string) => {
  if ((inputValue ?? '') === '') return '';
  inputValue = inputValue.replace(/\D/g, '');
  if (inputValue.length > 8) {
    inputValue = inputValue.slice(0, 8);
  }
  inputValue = inputValue.replace(/(\d{5})(\d{3})/, '$1-$2');
  return inputValue;
};

export const handleCpfChange = (inputValue: string) => {
  if ((inputValue ?? '') === '') return '';
  inputValue = inputValue.replace(/\D/g, '');
  if (inputValue.length > 11) {
    inputValue = inputValue.slice(0, 11);
  }
  inputValue = inputValue.replace(/(\d{3})(\d)/, '$1.$2');
  inputValue = inputValue.replace(/(\d{3})(\d)/, '$1.$2');
  inputValue = inputValue.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  return inputValue;
};

export const handleEmailChange = (inputValue: string) => {
  if ((inputValue ?? '') === '') return '';
  return inputValue.trim().toLowerCase();
};

export const handleMoneyChange = (inputValue: string | number | null | undefined) => {
  if ((inputValue ?? '') === '') return '';
  if (typeof inputValue == 'number') {
    // Se o valor é numérico, formatar conforme a API
    const formattedValue = parseFloat(inputValue.toString()).toFixed(2);
    const parts = formattedValue.split('.');
    let integerPart = parts[0];
    const decimalPart = parts[1];
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `R$ ${integerPart},${decimalPart}`;
  } else {
    // Se o valor é uma string, formatar conforme a digitação
    if (!inputValue) return '';
    let cleaned = inputValue.replace(/\D/g, '');
    if (cleaned.length <= 2) {
      cleaned = cleaned.padStart(3, '0');
    }
    const cents = cleaned.slice(-2);
    const integerPart = cleaned.slice(0, -2);
    const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    const formattedValue = `${formattedIntegerPart},${cents}`;
    // Remove zeros à esquerda, exceto se for "0,"
    const result = 'R$ ' + formattedValue.replace(/^0+(?=\d)/, '');
    return result;
  }
};

export const handleMoney2Change = (inputValue: string) => {
  if ((inputValue ?? '') === '') return '';
  inputValue = inputValue.replace('.', '').replace(',', '').replace(/\D/g, '');
  const result = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 }).format(parseFloat(inputValue) / 100);
  return 'R$ ' + result;
}

export const applyMinutesMask = (totalMinutes: number) => {
  const hours = Math.floor(totalMinutes / 60);// Parte inteira das horas
  const minutes = Math.floor(totalMinutes % 60);// Minutos restantes após subtrair as horas
  const seconds = Math.floor((totalMinutes - Math.floor(totalMinutes)) * 60); // Converte a parte decimal em segundos
  // Formata a saída para "HH:MM:SS"
  const formattedHours = hours.toString().padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedSeconds = seconds.toString().padStart(2, '0');
  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}