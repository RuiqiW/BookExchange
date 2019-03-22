
/**
 * Module to collect and handle payment information
 */
const form = document.querySelector('#paymentForm');
form.addEventListener('submit', handlePayment);

const payButton = document.querySelector('#payButton');
payButton.addEventListener('click',continueOrder);

function continueOrder(e){
  e.preventDefault();

  document.location = "../pages/placeOrder.html";
}


function handlePayment(e) {
  e.preventDefault();

  // Contact info
  const firstName = form[0].value;
  const lastName = form[1].value;
  const email = form[2].value;

  // Payment info
  const cardType = form[3].value;
  const cardNumber = form[4].value;
  const cardCVV = form[5].value;
  const cardExpDate = form[6].value;

  // Check that entered values are correctly formatted
      // This will be completed in phase 2 when we can properly pass these values somewhere


  // Redirect user to profile back
  document.location = '../pages/userProfile.html';
}
