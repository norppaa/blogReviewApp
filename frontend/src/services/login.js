import axios from 'axios';
const baseUrl = '/api/login';

const login = async (credentials) => {
  const response = await axios.post(baseUrl, credentials);
  return response.data;
};

const getUserDetails = async (token) => {
  const response = await axios.get('/api/login/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export default { login, getUserDetails };
