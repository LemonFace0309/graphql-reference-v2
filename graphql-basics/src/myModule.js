const message = 'Some message from myModule.js';

const name = 'Charles';

const location = 'Toronto';

const getGreeting = (name) => {
  return `Welcome to the course ${name}`;
}

export { message, name, getGreeting, location as default };