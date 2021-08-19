const Query = {
  users: (parent, { query }, { db }, info) => {
    if (!query) return db.users;

    return db.users.filter((user) => user.name.toLowerCase().includes(query.toLowerCase()));
  },
  posts: (parent, { query }, { db }, info) => {
    if (!query) return db.posts;

    return db.posts.filter((post) => {
      const isTitlematch = post.title.toLowerCase().includes(query.toLowerCase());
      const isBodyMatch = post.body.toLowerCase().includes(query.toLowerCase());
      return isTitlematch || isBodyMatch;
    });
  },
  comments: (parent, args, { db }, info) => {
    return db.comments;
  },
  me: () => {
    return {
      id: 'abc123',
      name: 'Charles',
      email: 'test@test.com',
      age: '19',
    };
  },
  post: () => ({
    id: 'def456',
    title: 'cool post',
    body: 'foo bar baz',
    published: true,
  }),
};

export default Query;
