import { users } from '../classes/data.js';

/*********************** Navigation Button ************************/

const chatShow = document.querySelector("#chatShow");
const chatHide = document.querySelector("#chatHide");
chatHide.addEventListener('click', hideChatRoom);
chatShow.addEventListener('click', showChatRoom);

function showChatRoom(e) {
    e.preventDefault();
    const chatRoom = document.querySelector('#chatRoom');
    chatRoom.style.display = "block";
}

function hideChatRoom(e) {
    e.preventDefault();
    const chatRoom = document.querySelector('#chatRoom');
    chatRoom.style.display = "none";
}

/*********************** Chat Box ************************/

const chat = document.querySelector('#chat');
const sendButton = document.querySelector("#sendButton");
sendButton.addEventListener('click', sendMessage);

function sendMessage(e) {
    e.preventDefault();

    if (e.target.classList.contains("submit")) {
        const message = document.querySelector("#messageBox").value;
        if (message.length > 0 && message.length < 200) {
            addMessage(message);
        }
    }
    chat.scrollTop = chat.scrollHeight;
}


// helper function for sendMessage, add message to chat window
function addMessage(msg) {
    const newMessage = document.createElement('p');
    newMessage.className = "chatOutText";
    newMessage.innerText = msg;
    const bubble = document.createElement('div');
    bubble.className = "chatOutBubble";
    bubble.appendChild(newMessage);
    const messageContainer = document.createElement('div');
    messageContainer.appendChild(bubble);
    chat.appendChild(messageContainer);
}

/*********************** Edit Profile Picture ************************/

const content = document.querySelector('#content');
const profile = content.querySelector('#profile');
const profilePic = profile.querySelector('#profilePic');

profilePic.addEventListener('file', editProfilePic);

// Reads the input profile picture URL
function editProfilePic(e) {
    e.preventDefault();

    const edit = e.target.parentElement;
    const img = edit.getElementsByTagName('img')[0];
    img.src = e.target.result;

    if (e.files && e.files[0]) {
        const reader = new FileReader();

        reader.onload = function (e) {
            $('.profile-pic').attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]);
    }
}

/*********************** Drop down select ************************/

const x = document.getElementsByClassName("custom-select");
for (let i = 0; i < x.length; i++) {
  const selElmnt = x[i].getElementsByTagName("select")[0];
  /*for each element, create a new DIV that will act as the selected item:*/
  const a = document.createElement("div");
  a.setAttribute("class", "select-selected");
  a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
  x[i].appendChild(a);
  /*for each element, create a new DIV that will contain the option list:*/
  const b = document.createElement("div");
  b.setAttribute("class", "select-items select-hide");
  for (let j = 1; j < selElmnt.length; j++) {
    /*for each option in the original select element,
    create a new div that will act as an option item:*/
    const c = document.createElement("div");
    c.innerHTML = selElmnt.options[j].innerHTML;
    c.addEventListener("click", function(e) {
        /*when an item is clicked, update the original select box,
        and the selected item:*/
        const s = this.parentNode.parentNode.getElementsByTagName("select")[0];
        const h = this.parentNode.previousSibling;
        for (let l = 0; l < s.length; l++) {
          if (s.options[l].innerHTML == this.innerHTML) {
            s.selectedIndex = l;
            h.innerHTML = this.innerHTML;
            const y = this.parentNode.getElementsByClassName("same-as-selected");
            for (let k = 0; k < y.length; k++) {
              y[k].removeAttribute("class");
            }
            this.setAttribute("class", "same-as-selected");
            break;
          }
        }
        h.click();
    });
    b.appendChild(c);
  }
  x[i].appendChild(b);
  a.addEventListener("click", function(e) {
      /*when the select box is clicked, close any other select boxes,
      and open/close the current select box:*/
      e.stopPropagation();
      closeAllSelect(this);
      this.nextSibling.classList.toggle("select-hide");
      this.classList.toggle("select-arrow-active");
    });
}

function closeAllSelect(elmnt) {
  /*a function that will close all select boxes in the document,
  except the current select box:*/
  const arrNo = [];
  const x = document.getElementsByClassName("select-items");
  const y = document.getElementsByClassName("select-selected");
  for (let i = 0; i < y.length; i++) {
    if (elmnt == y[i]) {
      arrNo.push(i)
    } else {
      y[i].classList.remove("select-arrow-active");
    }
  }
  for (let j = 0; j < x.length; j++) {
    if (arrNo.indexOf(j)) {
      x[j].classList.add("select-hide");
    }
  }
}

// Close all select boxes if the user clickes outside of the box
document.addEventListener("click", closeAllSelect);

/*********************** Display User Objects Profile Info ************************/
const userInfo = profile.querySelector('#profileInfo');

// Load a user profile
function loadUserProfile(user){
    const currPic = profilePic.getElementsByTagName('img')[0];
    currPic.src = user.picture;

    const currName = profile.getElementsByTagName('h3')[0];
    currName.innerText = document.createTextNode(user.firstName + ' ' + user.lastName);

    const currDescrip = userInfo.getElementsByTagName('textarea')[0];
    currDescrip.innerText = document.createTextNode(user.bio);

    // create the DOM elements in the user profile info
    const id = document.createElement('span');
    id.appendChild(document.createTextNode(user.username));

    const phone = document.createElement('span');
    phone.appendChild(document.createTextNode(user.phone));

    const email = document.createElement('span');
    email.appendChild(document.createTextNode(user.email));

    // modify the DOM elements in the user profile info
    const currId = userInfo.getElementsByTagName('div')[1];
    const spanId = currId.getElementsByTagName('p')[0];
    spanId.removeChild(spanId.getElementsByTagName('span')[0]);
    spanId.appendChild(id);

    const currPhone = userInfo.getElementsByTagName('div')[1];
    const spanPhone = currPhone.getElementsByTagName('p')[0];
    spanPhone.removeChild(spanPhone.getElementsByTagName('span')[0]);
    spanPhone.appendChild(phone);

    const currEmail = userInfo.getElementsByTagName('div')[2];
    const spanEmail = currEmail.getElementsByTagName('p')[0];
    spanEmail.removeChild(spanEmail.getElementsByTagName('span')[0]);
    spanEmail.appendChild(email);
}