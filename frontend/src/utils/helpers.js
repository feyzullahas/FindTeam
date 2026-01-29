// Position options for football players
export const POSITIONS = [
  'Kaleci',
  'Defans',
  'Orta Saha',
  'Forvet'
];

// Turkish cities
export const CITIES = [
  'İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Adana', 'Gaziantep',
  'Konya', 'Antalya', 'Diyarbakır', 'Mersin', 'Kayseri', 'Eskişehir',
  'Şanlıurfa', 'Samsun', 'Denizli', 'Malatya', 'Trabzon', 'Van',
  'Balıkesir', 'Manisa', 'Sakarya', 'Kocaeli', 'Aydın', 'Kahramanmaraş'
];

// Post types
export const POST_TYPES = [
  { value: 'team', label: 'Takım Arıyorum' },
  { value: 'player', label: 'Oyuncu Arıyorum' }
];

// Format date
export const formatDate = (dateString) => {
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(dateString).toLocaleDateString('tr-TR', options);
};

// Format phone number
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format as 0XXX XXX XX XX
  if (cleaned.length === 10) {
    return `0${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 8)} ${cleaned.slice(8)}`;
  }
  
  return phone;
};

// Validate form data
export const validateForm = (data, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const value = data[field];
    const fieldRules = rules[field];
    
    if (fieldRules.required && !value) {
      errors[field] = `${fieldRules.label || field} alanı zorunludur`;
    }
    
    if (fieldRules.minLength && value && value.length < fieldRules.minLength) {
      errors[field] = `${fieldRules.label || field} en az ${fieldRules.minLength} karakter olmalıdır`;
    }
    
    if (fieldRules.pattern && value && !fieldRules.pattern.test(value)) {
      errors[field] = `${fieldRules.label || field} formatı hatalı`;
    }
  });
  
  return errors;
};
