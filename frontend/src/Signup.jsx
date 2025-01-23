import { Box, Button, TextField } from '@mui/material';
import createAccount from './services/createAccount';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleCreateAccount = async (event) => {
    event.preventDefault();

    try {
      await createAccount.createAccount({
        username,
        password,
      });
      console.log('Creating account for', username);
      navigate('/login');
    } catch (exception) {
      console.log('Exception', exception);
      alert('Creation failed: ' + exception.response.data.error);
    }
  };

  const signUpForm = () => (
    <Box
      component="form"
      onSubmit={handleCreateAccount}
      sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}
      noValidate
      autoComplete="off"
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <div>
        <TextField
          required
          id="username"
          label="Username"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        <TextField
          required
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <Button type="submit" variant="contained" color="primary">
        login
      </Button>
    </Box>
  );

  return (
    <div
      style={{
        backgroundColor: '#f3f3dd',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <h2>Sign Up</h2>
      {signUpForm()}
    </div>
  );
};

export default SignUp;
