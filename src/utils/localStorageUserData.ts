import parseJwt from './parseJwt';

export const getUserDataFromLocalStorage = () => {
  const token = localStorage.getItem('token');
  const userData = token ? parseJwt(token) : null;
  return userData;
};

export const removeUserDataFromLocalStorage = () => {
  localStorage.removeItem('token');
};
