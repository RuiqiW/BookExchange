/**
 * This module handles posting a new ad for a user.
 */
const log = console.log;


const postAdForm = document.querySelector('#postAdForm');
postAdForm.addEventListener('submit', handlePostAd);
// log(postAdForm);

const price = document.querySelector('#price');
price.addEventListener('input', handlePrice);


function handlePrice(event) {
  // log(event.target.value);
  // log(event);

  if (event.target.value !== '') {
    document.getElementById("freeRadio").checked = false;
    document.getElementById("freeRadio").disabled = true;
    document.getElementById("contactRadio").checked = false;
    document.getElementById("contactRadio").disabled = true;

  } else {
    document.getElementById("freeRadio").disabled = false;
    document.getElementById("contactRadio").disabled = false;
  }
}



function handlePostAd(event) {
  event.preventDefault();

  // Ad details
  const title = document.querySelector('#adTitle').value;
  const isbn = document.querySelector('#isbn').value;
  const edition = document.querySelector('#edition').value;
  const description = document.querySelector('#description').value;

  // Photos

  // Price

}
























































// // DOM event listeners
// const postAdButton = document.querySelector('#postAdButton');
// postAdButton.addEventListener('click', handlePostAd);

// const uploads = document.querySelectorAll('.file-input');
// uploads[0].addEventListener('change', (e) => updateFileName(e, 0));
// uploads[1].addEventListener('change', event => updateFileName(event, 1));
// uploads[2].addEventListener('change', e => updateFileName(e, 2));
// uploads[3].addEventListener('change', e => updateFileName(e, 3));
// const postAdFrom = document.querySelector("#postAdForm");


// // Price radio buttons
// const priceInput = document.querySelector('#priceInput').value;
// const priceRadio = document.querySelectorAll('.radio');
// // log(priceInput);
// // log(priceRadio);




// function handlePostAd(e) {
//   e.preventDefault();

//   // DOM elements
//   const title = document.querySelector('#adTitle').value;

//   const isbn = document.querySelector('#isbn').value;

//   const edition = document.querySelector('#edition').value;

//   const selectCond = document.querySelector('#selCondition');
//   const condition = selectCond.options[selectCond.selectedIndex].value;

//   const description = document.querySelector('#description').value;

//   const priceInput = document.querySelector('#priceInput').value;
//   const priceRadio = document.querySelectorAll('.radio');




//   // Make sure the user entered all the proper info
//   if (title === null || title === undefined || title === "") {
//     alert('Please add a description to your ad.');
//     return;
//   } else if (description === null || description === undefined || description === "") {
//     alert('Please add a description to your ad.');
//     return;
//   }

//   /**
//    * If the user entered a price, then use that. Otherwise, use
//    * the radio button value. Return error message if neither was
//    * chosen.
//    */
//   let priceNum = parseInt(priceInput);
//   let priceStr = "";
//   if (isNaN(priceNum)) {
//     for (let i = 1; i < priceRadio.length - 1; i++) {
//       if (priceRadio[i + 1].checked) {
//         priceStr = priceRadio[i].textContent.trim();
//         break;
//       }
//     }
//   }
//   if (isNaN(priceNum) && priceStr === "") {
//     alert('Please enter a price or select a price option.');
//     return;
//   }
//   let price = isNaN(priceNum) ? priceStr : priceNum;    // isNaN -> is not a number


//   let images = [];
//   for (let i = 0; i < uploads.length; i++) {
//     if (uploads[i].files[0] !== null && uploads[i].files[0] !== undefined) {
//       images.push(uploads[i].files[0]);
//     }
//   }


//   // Create the new Post
//   // TODO: How to get the seller that is making the new Post? Not necessary for phase 1
//   // const post = new Post(title, "SELLER??", price, category, condition, description, images, false);
//   // posts.push(post);

//   postAdFrom.submit();
//   // Redirect back to their profile page
//   //document.location = '../pages/userProfile.html';

// }


// /**
//  * Updates the file name when a user adds a photo.
//  */
// function updateFileName(event, index) {
//   event.preventDefault();


//   const fileNames = document.querySelectorAll('.file-name');
//   fileNames[index].textContent = event.target.files[0].name;
// }

// /**
//  * Jump back to the posts page.
//  */
// const backToPostButton = document.querySelector("#backToPostButton");
// backToPostButton.addEventListener("click", backToPost);

// function backToPost(e) {
//   // Jump back to the posts page
//   document.location = "../pages/items.html";
// }
