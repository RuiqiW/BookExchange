/**
 * This module handles posting a new ad for a user.
 */

const postAdButton = document.querySelector('#postAdButton');
postAdButton.addEventListener('click', handlePostAd);

const uploads = document.querySelectorAll('.file-input');
uploads[0].addEventListener('change', (e) => updateFileName(e, 0));
uploads[1].addEventListener('change', event => updateFileName(event, 1));
uploads[2].addEventListener('change', e => updateFileName(e, 2));
uploads[3].addEventListener('change', e => updateFileName(e, 3));



function handlePostAd(e) {
  e.preventDefault();

  // DOM elements
  const title = document.querySelector('#adTitle').value;

  const selectCat = document.querySelector('#selCategory');
  const category = selectCat.options[selectCat.selectedIndex].value;

  const selectCond = document.querySelector('#selCondition');
  const condition = selectCond.options[selectCond.selectedIndex].value;

  const description = document.querySelector('#description').value;

  const priceInput = document.querySelector('#priceInput').value;
  const priceRadio = document.querySelectorAll('.radio');




  // Make sure the user entered all the proper info
  if (title === null || title === undefined || title === "") {
    alert('Please add a description to your ad.');
    return;
  } else if (description === null || description === undefined || description === "") {
    alert('Please add a description to your ad.');
    return;
  }

  /**
   * If the user entered a price, then use that. Otherwise, use
   * the radio button value. Return error message if neither was
   * chosen.
   */
  let priceNum = parseInt(priceInput);
  let priceStr = "";
  if (isNaN(priceNum)) {
    for (let i = 1; i < priceRadio.length - 1; i++) {
      if (priceRadio[i + 1].checked) {
        priceStr = priceRadio[i].textContent.trim();
        break;
      }
    }
  }
  if (isNaN(priceNum) && priceStr === "") {
    alert('Please enter a price or select a price option.');
    return;
  }
  let price = isNaN(priceNum) ? priceStr : priceNum;    // isNaN -> is not a number


  // TODO: grab the uploaded photos.
  let images = [];


  // Create the new Post
  // TODO: How to get the seller that is making the new Post?
  const post = new Post(title, "SELLER??", price, category, condition, description, images);
  posts.push(post);


  // Redirect back to their profile page
  document.location = '../pages/userProfile.html';

}


/**
 * Updates the file name when a user adds a photo.
 */
function updateFileName(event, index) {
  event.preventDefault();


  const fileNames = document.querySelectorAll('.file-name');
  fileNames[index].textContent = event.target.files[0].name;
}