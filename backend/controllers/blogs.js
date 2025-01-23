const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const middleware = require('../utils/middleware');

blogsRouter.get('/', async (_request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body;
  console.log(body);
  const user = request.user;

  if (!user) {
    return response.status(401).json({ error: 'user missing' });
  }

  const newBlog = new Blog({
    title: body.title,
    review: body.review,
    url: body.url,
    author: body.author,
    likes: body.likes,
    user: user._id,
  });

  const savedBlog = await newBlog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog);
});

blogsRouter.delete(
  '/:id',
  middleware.userExtractor,
  async (request, response) => {
    const blog = await Blog.findById(request.params.id);

    if (blog.user.toString() === request.user._id.toString()) {
      await Blog.findByIdAndDelete(request.params.id);
      response.status(204).end();
    } else {
      return response.status(401).json({ error: 'Unauthorized' });
    }
  }
);

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body;
  console.log(request.params.id);

  const updatedBlog = {
    title: body.title,
    review: body.review,
    url: body.url,
    author: body.author,
    likes: body.likes,
  };
  const res = await Blog.findByIdAndUpdate(request.params.id, updatedBlog, {
    new: true,
  });
  response.json(res);
});

module.exports = blogsRouter;
