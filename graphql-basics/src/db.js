const users = [
  {
    id: '1',
    name: 'Charles',
    email: 'test@test.com',
    age: 19,
  },
  {
    id: '2',
    name: 'Liu',
    email: 'Liu@test.com',
    age: 3,
  },
  {
    id: '3',
    name: 'Meow',
    email: 'Cat@test.com',
  },
];

const posts = [
  {
    id: '11',
    title: 'Charles is cool',
    body: '<3',
    published: true,
    author: '1',
  },
  {
    id: '12',
    title: 'I love Charles',
    body: '',
    published: false,
    author: '3',
  },
  {
    id: '13',
    title: 'Bark bark',
    body: ':D',
    published: true,
    author: '1',
  },
];

const comments = [
  {
    id: '101',
    text: 'wow',
    author: '1',
    post: '13',
  },
  {
    id: '102',
    text: 'I love Charles',
    author: '3',
    post: '13',
  },
  {
    id: '103',
    text: 'awesome',
    author: '3',
    post: '12',
  },
  {
    id: '104',
    text: 'so cool',
    author: '2',
    post: '11',
  },
];

const db = {
  users,
  posts,
  comments,
};

export { db as default };
