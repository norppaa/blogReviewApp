const logger = require('./logger');
var _ = require('lodash');
// Load the core build.
// var _ = require('lodash/core');

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) =>
  blogs
    .map((b) => (isNaN(parseInt(b?.likes)) ? 0 : parseInt(b?.likes)))
    .reduce((sum, a) => sum + a, 0);

const favoriteBlog = (blogs) =>
  blogs.length === 0
    ? undefined
    : blogs.reduce(
        (favorite, b) => (b.likes > favorite.likes ? b : favorite),
        blogs[0]
      );

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return undefined;
  }

  const blogsByAuthor = _.groupBy(blogs, ({ author }) => author);

  const bestAuthor = _.entries(blogsByAuthor).reduce(
    ([author, blogs], [a, b]) =>
      b.length > blogs.length ? [a, b] : [author, blogs]
  );

  return {
    author: bestAuthor[0],
    blogs: bestAuthor[1].length,
  };
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return undefined;
  }

  const authorLikes = {};

  blogs.forEach((blog) => {
    if (authorLikes[blog.author]) {
      authorLikes[blog.author] += blog.likes;
    } else {
      authorLikes[blog.author] = blog.likes;
    }
  });

  let maxLikes;
  let bestAuthor;

  for (const author in authorLikes) {
    if (authorLikes[author] > maxLikes) {
      maxLikes = authorLikes[author];
      bestAuthor = author;
    }
  }

  return {
    author: bestAuthor,
    likes: authorLikes[bestAuthor],
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
