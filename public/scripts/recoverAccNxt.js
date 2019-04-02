




const recoverAccNxtForm = document.querySelector('#recoverAccNxtForm');
recoverAccNxtForm.addEventListener('submit', handleRecovery);



function handleCreateAccount(e) {
    e.preventDefault();
    // Collect the entered fields
    const code = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    const confirm = document.querySelector('#confirm').value;


    // Confirm that the code is correct




    // Check if password matches confirm
    if (password !== confirm) {
        alert('Password does not match');
        return;
    }
}
