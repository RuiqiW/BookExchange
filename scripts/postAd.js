import { Post, posts } from '../classes/Post.js';
import { users } from '../classes/User.js';

/**
 * This module handles posting a new ad for a user.
 */

const postAdButton = document.querySelector('#postAdButton');
postAdButton.addEventListener('click', handlePostAd);


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


  // TODO: grab the uploaded photos
  let images = [];


  // Create the new Post
  // TODO: How to get the seller?
  const post = new Post(title, "SELLER??", price, category, condition, description);
  posts.push(post);


  // Redirect back to their profile page
  document.location = '../pages/userProfile.html';

}
