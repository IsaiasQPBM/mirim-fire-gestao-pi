
/**
 * Validation utilities for the student registration form
 */

/**
 * Generates a registration number for a new student
 * Format: YYYYXXX where YYYY is the current year and XXX is a sequential number
 */
export const generateRegistrationNumber = (): string => {
  const currentYear = new Date().getFullYear();
  const randomNumber = Math.floor(Math.random() * 900) + 100; // Random 3-digit number
  
  return `${currentYear}${randomNumber}`;
};

/**
 * Validates a CPF (Brazilian ID number)
 */
export const validateCPF = (cpf: string): boolean => {
  // Remove non-numeric characters
  cpf = cpf.replace(/[^\d]/g, '');
  
  // Check if it has 11 digits
  if (cpf.length !== 11) return false;
  
  // Check if all digits are the same (invalid CPF)
  if (/^(\d)\1+$/.test(cpf)) return false;
  
  // Calculate the first check digit
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  
  let remainder = sum % 11;
  const digit1 = remainder < 2 ? 0 : 11 - remainder;
  
  // Calculate the second check digit
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  
  remainder = sum % 11;
  const digit2 = remainder < 2 ? 0 : 11 - remainder;
  
  // Check if the calculated check digits match the actual ones
  return (parseInt(cpf.charAt(9)) === digit1 && parseInt(cpf.charAt(10)) === digit2);
};

/**
 * Validates a Brazilian phone number
 */
export const validatePhone = (phone: string): boolean => {
  // Remove non-numeric characters
  const cleanPhone = phone.replace(/[^\d]/g, '');
  
  // Check if it has 10 or 11 digits (with or without the 9 digit)
  return cleanPhone.length >= 10 && cleanPhone.length <= 11;
};

/**
 * Validates an email address
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Formats a CPF with mask (000.000.000-00)
 */
export const formatCPF = (cpf: string): string => {
  // Remove non-numeric characters
  cpf = cpf.replace(/[^\d]/g, '');
  
  // Apply mask
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

/**
 * Formats a phone number with mask
 * For 10 digits: (00) 0000-0000
 * For 11 digits: (00) 00000-0000
 */
export const formatPhone = (phone: string): string => {
  // Remove non-numeric characters
  phone = phone.replace(/[^\d]/g, '');
  
  if (phone.length === 11) {
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (phone.length === 10) {
    return phone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  
  return phone;
};

/**
 * Formats a CEP (Brazilian ZIP code) with mask (00000-000)
 */
export const formatCEP = (cep: string): string => {
  // Remove non-numeric characters
  cep = cep.replace(/[^\d]/g, '');
  
  // Apply mask
  return cep.replace(/(\d{5})(\d{3})/, '$1-$2');
};
