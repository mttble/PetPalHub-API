// userValidations.js
import bcrypt from "bcrypt";

export const checkExistingEmail = async (email, UserModel) => {
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    throw new Error("Email is already in use.");
  }
};

export const validateAndHashPassword = async (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (!passwordRegex.test(password)) {
    throw new Error("Password should have at least one uppercase letter, one lowercase letter, one number, and one special character.");
  }

  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};


