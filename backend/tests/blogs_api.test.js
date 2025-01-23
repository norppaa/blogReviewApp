const { test, after, beforeEach, describe } = require('node:test');
const { blogsInDb } = require('./test_helper');
const Blog = require('../models/blog');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const { createWriteStream } = require('fs');

const User = require('../models/user');
const { usersInDb } = require('./test_helper');
const bcrypt = require('bcrypt');
const { title } = require('node:process');

console.log = async (message) => {
  const tty = createWriteStream('/dev/tty');
  const msg =
    typeof message === 'string' ? message : JSON.stringify(message, null, 2);
  return tty.write(msg + '\n');
};

const api = supertest(app);

const initialBlogs = [
  {
    title: 'böbbeli',
    author: 'Noora',
    url: 'huutista joka tuutista',
    likes: 6,
  },
  {
    title: 'hihhulihei',
    author: 'Noora',
    url: 'tuutista joka huutista',
    likes: 19,
  },
];

beforeEach(async () => {
  await User.deleteMany({});
  await Blog.deleteMany({});

  const passwordHash = await bcrypt.hash('1234', 10);
  const user = new User({ username: 'noora', passwordHash });

  await user.save();

  const blogs = initialBlogs.map(
    (blog) =>
      new Blog({
        ...blog,
        user: user._id,
      })
  );

  const promiseArray = blogs.map((blog) => {
    user.blogs = user.blogs.concat(blog._id);
    return blog.save();
  });
  await Promise.all(promiseArray);
  await user.save();
});

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('the first blog is written by noora', async () => {
  const response = await api.get('/api/blogs');

  const author = response.body.map((e) => e.author);
  assert(author.includes('Noora'));
});

describe('Viewing blogs', () => {
  test(`there are ${initialBlogs.length}  blogs`, async () => {
    const response = await api.get('/api/blogs');

    assert.strictEqual(response.body.length, initialBlogs.length);
  });

  test('Identifier is named id', async () => {
    const blogs = await blogsInDb();

    const blogKeyes = Object.keys(blogs[0]);

    assert(blogKeyes.includes('title'));
  });
});

describe('Adding a blog', () => {
  test('a valid note can be added by an authorized user ', async () => {
    const user = {
      username: 'noora',
      password: '1234',
    };

    const loginUser = await api.post('/api/login').send(user);

    const newBlog = {
      title: 'hihhulihei',
      author: 'Noora',
      url: 'tuutista joka huutista',
      likes: 19,
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${loginUser.body.token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const response = await api.get('/api/blogs');

    const author = response.body.map((r) => r.author);

    assert.strictEqual(response.body.length, initialBlogs.length + 1);

    assert(author.includes('Noora'));
  });

  test('a valid note cannot be added by a user that is not logged in ', async () => {
    const newBlog = {
      title: 'hihhulihei',
      author: 'boora',
      url: 'tuutista joka huutista',
      likes: 19,
    };

    const responser = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/);

    const response = await api.get('/api/blogs');

    const author = response.body.map((r) => r.author);

    assert.strictEqual(response.body.length, initialBlogs.length);

    assert(!author.includes('boora'));
  });

  test('fails with statuscode 400 if data is invalid', async () => {
    const user = {
      username: 'noora',
      password: '1234',
    };

    const loginUser = await api.post('/api/login').send(user);

    const newBlog = {
      author: 'Floora',
      url: 'huutista',
      likes: 19,
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${loginUser.body.token}`)
      .expect(400);

    const blogsAtEnd = await blogsInDb();

    assert.strictEqual(blogsAtEnd.length, initialBlogs.length);
  });

  test('Defaults likes to 0 if it is not specified', async () => {
    const user = {
      username: 'noora',
      password: '1234',
    };

    const loginUser = await api.post('/api/login').send(user);

    const newBlog = {
      title: 'Koiruliini',
      author: 'Noora',
      url: 'tuutista joka huutista',
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${loginUser.body.token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await blogsInDb();
    const addedBlog = blogsAtEnd.find((blog) => blog.title === 'Koiruliini');
    assert.strictEqual(addedBlog.likes, 0);
  });
});

describe('Deleting a blog', async () => {
  test('succeeeds with a status 204 if id is valid', async () => {
    const user = {
      username: 'noora',
      password: '1234',
    };

    const loginUser = await api.post('/api/login').send(user);

    const blogsAtStart = await blogsInDb();
    const firstId = blogsAtStart[0].id;

    await api
      .delete(`/api/blogs/${firstId}`)
      .expect(204)
      .set('Authorization', `Bearer ${loginUser.body.token}`);

    const blogsAtEnd = await blogsInDb();

    assert(!blogsAtEnd.map((blog) => blog.id).includes(firstId));

    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1);
  });
});

describe('Changing a blog', async () => {
  test('a valid note can be updated', async () => {
    const user = {
      username: 'noora',
      password: '1234',
    };

    const loginUser = await api.post('/api/login').send(user);

    const blogsAtStart = await blogsInDb();

    const firstBlog = blogsAtStart[0];

    const updatedBlog = {
      ...firstBlog,
      likes: firstBlog.likes + 1,
    };

    await api
      .put(`/api/blogs/${firstBlog.id}`)
      .send(updatedBlog)
      .set('Authorization', `Bearer ${loginUser.body.token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await blogsInDb();
    const addedBlog = blogsAtEnd.find((blog) => blog.id === firstBlog.id);

    assert.strictEqual(addedBlog.likes, firstBlog.likes + 1);
  });
});

after(async () => {
  await mongoose.connection.close();
});
