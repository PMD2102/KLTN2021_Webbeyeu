const regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const signUpValidation = (data) => {
  const { name, username, email, password, password2 } = data;
  let errors = {};

  if (!name) errors = { ...errors, name: "name field is required" };
  if (!username) errors = { ...errors, username: "username field is required" };

  if (!email) errors = { ...errors, email: "email field is required" };
  else if (!regexEmail.test(email))
    errors = { ...errors, email: "invalid email" };

  if (!password) errors = { ...errors, password: "password field is required" };
  if (password !== password2)
    errors = { ...errors, password2: "confirm password is not match" };
  if (!password2)
    errors = { ...errors, password2: "confirm password field is required" };

  return {
    isValid: isEmpty(errors),
    errors,
  };
};

const signInValidation = (data) => {
  const { usernameOrEmail, password } = data;
  let errors = {};
  if (!usernameOrEmail)
    errors = {
      ...errors,
      usernameOrEmail: "username or email field is required",
    };
  if (!password) errors = { ...errors, password: "password field is required" };

  return {
    isValid: isEmpty(errors),
    errors,
  };
};

const isEmpty = (data) =>
  !data ||
  (typeof data === "object" && !Object.keys(data).length) ||
  (Array.isArray(data) && !data.length);

module.exports = {
  signUpValidation,
  signInValidation,
};
