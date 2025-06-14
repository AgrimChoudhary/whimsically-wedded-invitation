export const formatPhoneNumber = (phone: string, countryCode: string = '+91'): string => {
  // Remove any non-digits from phone
  const cleanPhone = phone.replace(/\D/g, '');
  
  // If phone already starts with country code, return as is
  if (phone.startsWith('+')) {
    return phone;
  }
  
  // If phone starts with country code without +, add +
  if (cleanPhone.startsWith('91') && cleanPhone.length > 10) {
    return `+${cleanPhone}`;
  }
  
  // Otherwise, combine country code with phone number
  return `${countryCode}${cleanPhone}`;
};

export const normalizePhoneNumber = (phone: string): string => {
  // Remove all non-digits
  const digitsOnly = phone.replace(/\D/g, '');
  
  // If it starts with 91 and has more than 10 digits, it's already normalized
  if (digitsOnly.startsWith('91') && digitsOnly.length > 10) {
    return `+${digitsOnly}`;
  }
  
  // If it's a 10-digit number, add India code
  if (digitsOnly.length === 10) {
    return `+91${digitsOnly}`;
  }
  
  // Otherwise return with + prefix
  return `+${digitsOnly}`;
};

export const displayPhoneNumber = (phone: string): string => {
  const normalized = normalizePhoneNumber(phone);
  
  // Format for display (e.g., +91 98765 43210)
  if (normalized.startsWith('+91')) {
    const number = normalized.slice(3);
    if (number.length === 10) {
      return `+91 ${number.slice(0, 5)} ${number.slice(5)}`;
    }
  }
  
  return normalized;
};

export const validatePhoneNumber = (phone: string): boolean => {
  const normalized = normalizePhoneNumber(phone);
  
  // Basic validation: should be at least 10 digits with country code
  const digitsOnly = normalized.replace(/\D/g, '');
  return digitsOnly.length >= 10 && digitsOnly.length <= 15;
};
