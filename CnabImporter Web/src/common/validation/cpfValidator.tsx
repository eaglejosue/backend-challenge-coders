export class CpfValidator {
  static isValidCPF(cpf: string): boolean | string {
    // Remove caracteres não numéricos
    cpf = cpf.replace(/[^\d]/g, '');

    // Verifica se o CPF tem 11 dígitos
    if (cpf.length !== 11) return false;

    // Verifica se todos os dígitos são iguais (ex: 111.111.111-11)
    if (/^(\d)\1+$/.test(cpf)) return false;

    // Calcula os dígitos verificadores
    const calcCheckDigit = (base: string) => {
      let sum = 0;
      for (let i = 0; i < base.length; i++) {
        sum += parseInt(base[i]) * (base.length + 1 - i);
      }
      let result = (sum * 10) % 11;
      return result === 10 || result === 11 ? 0 : result;
    };

    const baseCPF = cpf.substring(0, 9);
    const firstCheckDigit = calcCheckDigit(baseCPF);
    const secondCheckDigit = calcCheckDigit(baseCPF + firstCheckDigit);

    // Verifica os dígitos verificadores calculados com os do CPF
    return (
      firstCheckDigit === parseInt(cpf[9]) &&
      secondCheckDigit === parseInt(cpf[10])
    ) || 'CPF inválido';
  }
}