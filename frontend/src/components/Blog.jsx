import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Accordion,
  AccordionSummary,
  AccordionActions,
  AccordionDetails,
  Container,
  Typography,
  Button,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const Blog = ({ blog, user, updateLikes, deleteBlog }) => {
  const [userIsAuthor] = useState(blog.user.id === user.id);

  const deleteButton = (blog) => {
    if (userIsAuthor) {
      return <Button onClick={() => deleteBlog(blog)}>Delete</Button>;
    }
  };

  return (
    <Accordion key={blog.id}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1-content"
        id="panel1-header"
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Typography style={{ flexGrow: 4 }}>{blog.title}</Typography>
        <Container style={{ maxWidth: '7rem' }}>
          <Typography>likes: {blog.likes}</Typography>
        </Container>
      </AccordionSummary>
      <AccordionDetails
        style={{
          display: 'flex',
          flexDirection: 'column',
          maxWidth: '85%',
        }}
      >
        <Typography>{blog.review}</Typography>
      </AccordionDetails>
      <AccordionActions
        style={{
          justifyContent: 'space-between',
          paddingLeft: '16px',
          paddingRight: '16px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.8rem',
          }}
        >
          <a href={blog.url} style={{ fontSize: '0.8rem' }}>
            Read this blog
          </a>
          <Typography style={{ fontSize: '0.8rem' }}>
            Authored by: {blog.author}
          </Typography>
        </div>
        <div>
          <Button onClick={() => updateLikes(blog)}>add like</Button>
          {deleteButton(blog)}
        </div>
      </AccordionActions>
    </Accordion>
  );
};

Blog.propTypes = {
  user: PropTypes.object.isRequired,
  blog: PropTypes.object.isRequired,
  updateLikes: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
};

export default Blog;
