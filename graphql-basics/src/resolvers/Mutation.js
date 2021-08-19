import uuidv4 from 'uuid/v4';

const Mutation = {
  createUser: (parent, { data }, { db }, info) => {
    const emailTaken = db.users.some((user) => user.email === data.email);

    if (emailTaken) {
      throw new Error('Email taken.');
    }

    const user = {
      id: uuidv4(),
      ...data,
    };
    db.users.push(user);
    return user;
  },
  deleteUser: (parent, { id }, { db }, info) => {
    const userIndex = db.users.findIndex((user) => user.id === id);
    if (userIndex === -1) throw new Error('User not found');
    const deletedUsers = db.users.splice(userIndex, 1);

    db.posts = db.posts.filter((post) => {
      const match = post.author === id;
      if (match) {
        comments = db.comments.filter((comment) => comment.post !== post.id);
      }

      return !match;
    });
    db.comments = db.comments.filter((comment) => comment.author !== id);

    return deletedUsers[0];
  },
  updateUser: (parent, { id, data }, { db }, info) => {
    const { email, name, age } = data;
    const user = db.users.find((user) => user.id === id);
    if (!user) throw new Error('User not found');

    if (typeof email === 'string') {
      const emailTaken = db.users.some((user) => user.email === email);

      if (emailTaken) throw new Error('Email taken');

      user.email = email;
    }

    if (typeof name === 'string') {
      user.name = name;
    }

    if (typeof age !== 'undefined') {
      user.age = age;
    }

    return user;
  },
  createPost: (parent, { data }, { db }, info) => {
    const userExists = db.users.some((user) => user.id === data.author);

    if (!userExists) {
      throw new Error('User not found');
    }

    const post = {
      id: uuidv4(),
      ...data,
    };
    db.posts.push(post);
    return post;
  },
  deletePost: (parent, { id }, { db }, info) => {
    const postIndex = db.posts.findIndex((post) => post.id === id);
    if (postIndex === -1) throw new Error('Post not found');
    const deletedPosts = db.posts.splice(postIndex, 1);

    db.comments = db.comments.filter((comment) => comment.post !== id);
    return deletedPosts[0];
  },
  updatePost: (parent, { id, data }, { db }, info) => {
    const { title, body, published } = data;
    const post = db.posts.find((post) => post.id === id);
    if (!post) throw new Error('Post not found');

    if (typeof title === 'string') {
      post.title = title;
    }

    if (typeof body === 'string') {
      post.body = body;
    }

    if (typeof published === 'boolean') {
      post.published = published;
    }

    return post;
  },
  createComment: (parent, { data }, { db }, info) => {
    const postExists = db.posts.some((post) => post.id === data.post && post.published);
    const userExists = db.users.some((user) => user.id === data.author);

    if (!postExists || !userExists) throw new Error('Unable to create new comment');
    const comment = {
      id: uuidv4(),
      ...data,
    };
    db.comments.push(comment);
    return comment;
  },
  deleteComment: (parent, { id }, { db }, info) => {
    const commentIndex = db.comments.findIndex((comment) => comment.id === id);
    if (commentIndex === -1) throw new Error('Comment not found');
    const deletedComments = db.comments.splice(commentIndex, 1);
    return deletedComments[0];
  },
  updateComment: (parent, { id, data }, { db }, info) => {
    const { text } = data;
    const comment = db.comments.find((comment) => comment.id === id);
    if (!comment) throw new Error('Comment not found')

    if (typeof text === 'string') {
      comment.text = text;
    }

    return comment;
  },
};

export default Mutation;
