export class BirthDateValidator {
  static isAdult = (birthDate: string): boolean | string => {
    const today = new Date();
    const [year, month, day] = birthDate.split('-').map(part => parseInt(part, 10));
    //const birth = new Date(Date.UTC(year, month - 1, day));

    let age = today.getFullYear() - year;
    const monthDiff = (today.getMonth() + 1) - month;
    const dayDiff = today.getDate() - day;

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0))
      age--;

    return age > 17 || 'Você deve ter pelo menos 18 anos';
  };
}