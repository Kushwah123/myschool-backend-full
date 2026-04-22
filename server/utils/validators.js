// ✅ Comprehensive Validation Utilities



const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateMobileNumber = (mobile) => {
  const mobileRegex = /^[6-9]\d{9}$/; // Indian mobile number
  return mobileRegex.test(mobile);
};

const validateUsername = (username) => {
  if (!username || username.trim() === '') return false;
  // allow alphanumeric and underscores, between 3 and 30 chars
  const re = /^[a-zA-Z0-9_]{3,30}$/;
  return re.test(username);
};

const validatePassword = (password) => {
  if (!password || typeof password !== 'string') return false;
  // minimum 8 characters, at least one uppercase, one lowercase, one digit and one special character
  const re = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  return re.test(password);
};

const validateAadhar = (aadhar) => {
  const aadharRegex = /^\d{12}$/;
  return aadharRegex.test(aadhar);
};

const validateRollNumber = (rollNumber) => {
  if (!rollNumber || rollNumber.toString().trim() === '') {
    return { isValid: false, error: 'Roll number is required' };
  }
  return { isValid: true };
};

const validateStudentData = (data) => {
  const errors = [];

  if (!data.fullName || data.fullName.trim() === '') {
    errors.push('Full name is required');
  }
  if (!data.gender || ['male', 'female', 'other'].indexOf(data.gender.toLowerCase()) === -1) {
    errors.push('Valid gender is required (male/female/other)');
  }
  if (!data.dob) {
    errors.push('Date of birth is required');
  }
  if (data.aadharNumber && !validateAadhar(data.aadharNumber)) {
    errors.push('Invalid Aadhar number (must be 12 digits)');
  }
  if (!data.mobile || !validateMobileNumber(data.mobile)) {
    errors.push('Valid mobile number is required');
  }
  if (!data.address || data.address.trim() === '') {
    errors.push('Address is required');
  }
  if (!data.fatherName || data.fatherName.trim() === '') {
    errors.push('Father name is required');
  }
  if (!data.motherName || data.motherName.trim() === '') {
    errors.push('Mother name is required');
  }
  if (!data.classId) {
    errors.push('Class ID is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

const validateTeacherData = (data) => {
  const errors = [];

  if (!data.name || data.name.trim() === '') {
    errors.push('Name is required');
  }
  if (!data.mobile || !validateMobileNumber(data.mobile)) {
    errors.push('Valid mobile number is required');
  }
  if (!data.qualification || data.qualification.trim() === '') {
    errors.push('Qualification is required');
  }
  if (data.experience && isNaN(data.experience)) {
    errors.push('Experience must be a number');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

const validateParentData = (data) => {
  const errors = [];

  if (!data.name || data.name.trim() === '') {
    errors.push('Name is required');
  }
  if (!data.mobile || !validateMobileNumber(data.mobile)) {
    errors.push('Valid mobile number is required');
  }
  if (data.email && !validateEmail(data.email)) {
    errors.push('Valid email is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

const validateClassData = (data) => {
  const errors = [];

  if (!data.className || data.className.trim() === '') {
    errors.push('Class name is required');
  }
  if (!data.section || data.section.trim() === '') {
    errors.push('Section is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

const validateFeeStructure = (data) => {
  const errors = [];

  if (!data.classId) {
    errors.push('Class ID is required');
  }
  if (!data.amount || data.amount <= 0) {
    errors.push('Amount must be greater than 0');
  }
  if (!data.installments || data.installments <= 0) {
    errors.push('Installments must be greater than 0');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = {
  validateEmail,
  validateMobileNumber,
  validateUsername,
  validatePassword,
  validateAadhar,
  validateRollNumber,
  validateStudentData,
  validateTeacherData,
  validateParentData,
  validateClassData,
  validateFeeStructure
};
