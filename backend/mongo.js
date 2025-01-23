const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('give password as argument');
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://noorapuhakka02:${password}@clusterfs-3.stedmjx.mongodb.net/testBlogApp?retryWrites=true&w=majority`;

mongoose.set('strictQuery', false);
mongoose.connect(url).then(() => {
  const blogSchema = mongoose.Schema({
    title: String,
    review: String,
    url: String,
    author: String,
    likes: Number,
  });

  const Blog = mongoose.model('Blog', blogSchema);

  const blog = new Blog({
    title: 'böbbeli',
    review: 'böö',
    url: 'huutista joka tuutista',
    author: 'Noora',
    likes: 6,
  });

  blog.save().then((result) => {
    console.log('blog saved!');
    mongoose.connection.close();
  });

  Blog.find({}).then((result) => {
    result.forEach((blog) => {
      console.log(blog);
    });
    mongoose.connection.close();
  });
});
