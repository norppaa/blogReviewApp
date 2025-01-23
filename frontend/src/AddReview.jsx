import { Box, Button, TextField } from '@mui/material';
import { useState } from 'react';
import blogService from './services/blogs';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './services/authentication';

const AddReviewPage = () => {
  const [title, setTitle] = useState('');
  const [review, setReview] = useState('');
  const [url, setUrl] = useState('');

  const { user } = useAuth();

  const navigate = useNavigate();

  const handleCreateReview = async (event) => {
    event.preventDefault();
    try {
      const newblog = await blogService.create({
        title: title,
        review: review,
        url: url,
        author: user.username,
      });
      navigate('/blogs');
    } catch (exception) {
      console.log(exception);
      alert('Failed to create review');
    }
  };

  const reviewForm = () => (
    <Box
      component="form"
      onSubmit={handleCreateReview}
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
      noValidate
      autoComplete="off"
    >
      <div>
        <TextField
          required
          id="Title"
          label="Title"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
        <TextField
          required
          id="Review"
          label="Review"
          value={review}
          onChange={({ target }) => setReview(target.value)}
        />
      </div>
      <div>
        <TextField
          required
          id="url"
          label="URL"
          value={url}
          onChange={({ target }) => setUrl(target.value)}
        />
      </div>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        style={{ marginTop: '10px' }}
      >
        Create Review
      </Button>
    </Box>
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#f3f3dd',
        height: '100vh',
      }}
    >
      <h2>Let's add a new review!</h2>
      {reviewForm()}
    </div>
  );
};

export default AddReviewPage;
