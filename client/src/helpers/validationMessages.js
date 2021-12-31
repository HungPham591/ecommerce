const validateMessages = {
  required: "${name} is required!",
  types: {
    email: "${name} is not a valid email!",
    number: "${name} is not a valid number!",
  },
  number: {
    range: "${name} must be between ${min} and ${max}",
  },
  string: {
    min: "${name} must be at least ${min} characters",
    max: "${name} cannot be longer than ${max} characters",
    range: "${name} must be between ${min} and ${max} characters",
  },
};

export default validateMessages;