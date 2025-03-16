const VerifPassword =
  (formData: { password: string }, confirmPassword: string): Array<string> => {
    const errors: Array<string> = [];

    if (formData.password !== confirmPassword) {
      errors.push('Password don\'t match');
    }

    const validations = [
      {
        test: /[A-Z]/,
        message: 'At least one uppercase letter required',
      },
      {
        test: /[a-z]/,
        message: 'At least one lowercase letter required',
      },
      {
        test: /[0-9]/,
        message: 'At least one number required',
      },
      {
        test: /[#?!@$%^&*-]/,
        message: 'At least one special character (#?!@$%^&*-) required',
      },
      {
        test: /.{12,}/,
        message: 'Password must be at least 12 characters long',
      },
    ];

    for (const validation of validations) {
      if (!validation.test.test(formData.password)) {
        errors.push(validation.message);
      }
    }
    return errors;
  };

export default VerifPassword;