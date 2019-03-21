// import { users } from '../classes/data.js';


/**
 * DOM elements
 */
const signInForm = document.querySelector('#signIn');
signInForm.addEventListener('submit', handleLogin);


function handleLogin(e) {
  e.preventDefault();
  // Get their entered email and password. (We need .value and not innerText or textContent)
  const username = document.getElementById('email').value;
  const password = document.querySelector('#password').value;

  // Check if it matches with a User in our database
  // This is hardcoded for phase 1
  const user = users.find((user) => user.user.username === username);
  if (user === null || user === undefined || user.user.password !== password) {
    alert(`Login failed.`);
    return;

  } else {
    alert(`Welcome back ${user.user.firstName}`);
  }

  // Success. Bring the user to their profile page
  // This will be changed in phase 2
  if (user.user.isAdmin) {
    document.location = '../pages/adminDashboard.html';
  } else {
    document.location = '../pages/userProfile.html';
  }

}
