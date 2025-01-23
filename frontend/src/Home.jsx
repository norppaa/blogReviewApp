import { Box, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './services/authentication';

const Home = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await login({ username, password });
    } catch (exception) {
      console.log('Exception', exception);
      alert('Invalid username or password');
    }
  };

  const loginForm = () => (
    <Box
      component="form"
      onSubmit={handleLogin}
      sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}
      noValidate
      autoComplete="off"
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
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <Typography style={{ margin: '20px' }} variant="h4">
        Welcome to the blog app!
      </Typography>
      <Typography>
        Log in to manage all your posts, or view the blogs anonymously.
      </Typography>

      {loginForm()}
      <Button onClick={() => navigate('/signUp')}>Create new user</Button>
    </div>
  );
};

export default Home;
