import { Post } from '../classes/Post.js';
import { users } from '../classes/User.js';

/**
 * This module handles posting a new ad for a user.
 */

const postAdButton = document.querySelector('#postAdButton');
postAdButton.addEventListener('click', handlePostAd);


function handlePostAd(e) {
  e.preventDefault();


  const title = document.querySelector('#adTitle').value;
  console.log(title);

  const selectCat = document.querySelector('#selCategory');
  const category = selectCat.options[selectCat.selectedIndex].value;
  console.log(category);

  const selectCond = document.querySelector('#selCondition');
  const condition = selectCond.options[selectCond.selectedIndex].value;
  console.log(condition);

  const description = document.querySelector('#description').value;
  console.log(description);

  const priceInput = document.querySelector('#priceInput').value;
  const priceRadio = document.querySelectorAll('.radio');
  console.log(priceInput);
  console.log(priceRadio[4].checked);


  // Make sure the user entered all the proper info
  if (title === null || title === undefined) {
    alert('Please add a description to your ad.');
    return;
  } else if (description === null || description === undefined) {
    alert('Please add a description to your ad.');
    return;
  }

  


}
