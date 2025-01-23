import { createContext, useContext, useState } from 'react';
import loginService from './login';
import blogService from './blogs';
import { Route, Navigate, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const data = JSON.parse(window.localStorage.getItem('user'));
        if (data) {
          const user = await loginService.getUserDetails(data.token);
          setUser(user);
          blogService.setToken(data.token);
          setLoading(false);
        }
      } catch (exception) {
        console.log('Exception', exception);
        window.localStorage.removeItem('user');
        setUser(null);
        setLoading(false);
      }
      setLoading(false);
    };
    checkUser();
  }, [navigate]);

  // call this function when you want to authenticate the user
  const login = async ({ username, password }) => {
    try {
      const user = await loginService.login({ username, password });
      setUser(user);
      window.localStorage.setItem('user', JSON.stringify(user));
      blogService.setToken(user.token);
      navigate('/blogs');
    } catch (exception) {
      console.log('Exception', exception);
      alert('Login failed: ' + exception.response.data.error);
    }
  };

  // call this function to sign out logged in user
  const logout = () => {
    setUser(null);
    window.localStorage.setItem('user', JSON.stringify(null));
    blogService.setToken(null);
    navigate('/', { replace: true });
  };

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      loading,
    }),
    [user, loading]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useLocalStorage = (keyName, defaultValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const value = window.localStorage.getItem(keyName);
      if (value) {
        return JSON.parse(value);
      } else {
        window.localStorage.setItem(keyName, JSON.stringify(defaultValue));
        return defaultValue;
      }
    } catch (err) {
      return defaultValue;
    }
  });
  const setValue = (newValue) => {
    try {
      window.localStorage.setItem(keyName, JSON.stringify(newValue));
    } catch (err) {
      console.log(err);
    }
    setStoredValue(newValue);
  };
  return [storedValue, setValue];
};

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return <div style={{ backgroundColor: '#f3f3dd' }}></div>;
  }

  if (!user) {
    // user is not authenticated
    return <Navigate to="/login" />;
  }
  return children;
};
