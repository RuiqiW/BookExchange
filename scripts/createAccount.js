import { User, users } from '../classes/User.js';


/**
 * This module handles creating a new account for a user.
 */
const createAccountForm = document.querySelector('#createAccountForm');
createAccountForm.addEventListener('submit', handleCreateAccount);



function handleCreateAccount(e) {
  e.preventDefault();


  // Collect the entered fields
  const firstName = document.querySelector('#firstName').value;
  const lastName = document.querySelector('#lastName').value;
  const username = document.querySelector('#username').value;
  const email = document.querySelector('#email').value;
  const password = document.querySelector('#password').value;
  const confirm = document.querySelector('#confirm').value;

  // Check if password matches confirm
  if (password !== confirm) {
    alert('Password does not match');
    return;
  }

  // Check if the username or email already exist
  if (users.some((user) => user.username === username)) {
    alert(`${username} already exists`);
    return;

  } else if (users.some((user) => {
    return user.email === email;
  })) {
    // Body of else if
    alert(`${email} already exists`);
    return;
  }

  // Check that the other fields are correct. We can make these more precise later
  let nameRegex = /^[a-zA-Z]+$/;
  let emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  if (!nameRegex.test(firstName) || !nameRegex.test(lastName) || !nameRegex.test(username) || !emailRegex.test(email.toString())) {
    alert('Please correct fields and try again.');
    return;
  }

  // Create the new User
  const user = new User(firstName, lastName, username, email, password);

  // We would send to database here
  users.push(user);

  // Redirect the page to login
  document.location = '../pages/login.html';
}
