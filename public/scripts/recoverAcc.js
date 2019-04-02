/**
 * This module handles recovering an account for a user that forgot their pw.
 */
const log = console.log;



const recoverAccForm = document.querySelector('#recoverAccForm');
recoverAccForm.addEventListener('submit', handleRecovery);





function handleRecovery(event) {

  // Veryify the email is from a proper user
  const email = document.querySelector('#email');

}
