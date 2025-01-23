import BlogList from './components/BlogList';
import { Button, Container, Typography } from '@mui/material';
import { useAuth } from './services/authentication';
import { useNavigate } from 'react-router-dom';

const BlogPage = () => {
  const navigate = useNavigate();

  const { logout, user } = useAuth();

  const handleLogOut = () => {
    try {
      logout();
    } catch (exception) {
      console.log(exception);
      alert('Failed to log out');
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#f3f3dd',
        margin: '0',
        padding: '0',
        height: '100vh',
      }}
    >
      <Container>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Button
            onClick={() => handleLogOut()}
            style={{ alignSelf: 'flex-end', p: '2rem' }}
          >
            Log out
          </Button>

          <Typography variant="h3" style={{ marginTop: '1rem' }}>
            Blogs
          </Typography>
          <Typography variant="h6" style={{ marginTop: '1rem' }}>
            Welcome {user.username}!
          </Typography>
          <Typography style={{ marginTop: '1rem' }}>
            Ready for another review?
          </Typography>

          <Button onClick={() => navigate('/addReview')}>
            Create new review
          </Button>
          <BlogList user={user}></BlogList>
        </div>
      </Container>
    </div>
  );
};

export default BlogPage;
