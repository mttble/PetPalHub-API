// userValidations.js
import bcrypt from "bcrypt";

export const checkExistingEmail = async (email, UserModel) => {
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    return !!existingUser
  }
}

export const validateAndHashPassword = async (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (!passwordRegex.test(password)) {
    return false
    // throw new Error("Password should have at least one uppercase letter, one lowercase letter, one number, and one special character.");
  }

  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};



export const validateDateOfBirth = (dateString) => {
    // Check the format using regex
    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;

    if (!dateRegex.test(dateString)) {
        throw new Error("Date of Birth should be in the format DD/MM/YYYY.");
    }

    // Split the string to extract day, month, and year
    const [day, month, year] = dateString.split("/").map(str => parseInt(str, 10));

    // Check if it's a valid date (e.g., 30/02/2021 would be invalid)
    const dateObj = new Date(year, month - 1, day); // month is 0-indexed
    if (dateObj.getFullYear() !== year || dateObj.getMonth() + 1 !== month || dateObj.getDate() !== day) {
        throw new Error("Invalid Date of Birth provided.");
    }
};
