import { useState } from 'react';
import blogService from '../services/blogs';
import { useEffect } from 'react';
import { useAuth } from '../services/authentication';
import Blog from './Blog';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchBlogs = async () => {
      const blogs = await blogService.getAll();
      setBlogs(blogs);
    };

    fetchBlogs();
  }, []);

  const updateLikes = (blog) => {
    console.log(blog);
    const newBlogObject = {
      likes: blog.likes + 1,
      review: blog.review,
      url: blog.url,
      author: blog.author,
      title: blog.title,
    };
    blogService.update(blog.id, newBlogObject).then((returnedBlog) => {
      setBlogs(blogs.map((b) => (b.id !== blog.id ? b : returnedBlog)));
    });
  };

  const deleteBlog = (blog) => {
    if (window.confirm(`remove ${blog.title} by ${blog.author}?`))
      blogService.remove(blog.id).then((returned) => {
        setBlogs(blogs.filter((b) => b.id !== blog.id));
      });
  };

  return (
    <div style={{ minWidth: '70%', paddingTop: '6rem' }}>
      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            user={user}
            updateLikes={updateLikes}
            deleteBlog={deleteBlog}
          ></Blog>
        ))}
    </div>
  );
};

export default BlogList;
