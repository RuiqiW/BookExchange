const thisUser = "will";

// /*********************** Navigation Button ************************/
//
// const chatShow = document.querySelector("#chatShow");
// const chatHide = document.querySelector("#chatHide");
// chatHide.addEventListener('click', hideChatRoom);
// chatShow.addEventListener('click', showChatRoom);
//
// // show the chatroom
// function showChatRoom(e) {
//     e.preventDefault();
//     const chatRoom = document.querySelector('#chatRoom');
//     chatRoom.style.display = "block";
// }
//
// // hide the chatroom
// function hideChatRoom(e) {
//     e.preventDefault();
//     const chatRoom = document.querySelector('#chatRoom');
//     chatRoom.style.display = "none";
// }
//
// /*********************** Chat Box ************************/
//
// const chat = document.querySelector('#chat');
// const sendButton = document.querySelector("#sendButton");
// sendButton.addEventListener('click', sendMessage);
//
// // sends messages
// function sendMessage(e) {
//     e.preventDefault();
//
//     if (e.target.classList.contains("submit")) {
//         const message = document.querySelector("#messageBox").value;
//         if (message.length > 0 && message.length < 200) {
//             addMessage(message);
//         }
//     }
//     chat.scrollTop = chat.scrollHeight;
// }
//
//
// // helper function for sendMessage, add message to chat window
// function addMessage(msg) {
//     const newMessage = document.createElement('p');
//     newMessage.className = "chatOutText";
//     newMessage.innerText = msg;
//     const bubble = document.createElement('div');
//     bubble.className = "chatOutBubble";
//     bubble.appendChild(newMessage);
//     const messageContainer = document.createElement('div');
//     messageContainer.appendChild(bubble);
//     chat.appendChild(messageContainer);
// }

/*********************** Edit Profile Info By Clicking the Edit Buttons ************************/

const profile = document.querySelector('#profile');
const profilePic = document.querySelector('#profilePic');
const userInfo = document.querySelector('#profileInfo');
const picSubmit = document.querySelector("#pic-submit");
const picSelect = document.querySelector("#pic-select");
picSelect.addEventListener("change", (e) => {
    console.log("dsjah");
    picSubmit.disabled = false;
});
userInfo.addEventListener('click', editProfile);

// Modify the info
function editProfile(e) {
    e.preventDefault();
    if (!e.target.classList.contains("textArea")) {
        if (e.target.classList.contains('fa-edit')) {
            addInfoTextBox(e.target.parentElement.firstElementChild);
            e.target.classList.add('fa-save');
            e.target.classList.remove('fa-edit');
        } else if (e.target.classList.contains('fa-save')) {
            removeInfoTextBox(e.target.parentElement.firstElementChild);
            e.target.classList.add('fa-edit');
            e.target.classList.remove('fa-save');
        }
    } else {
        if (e.target.classList.contains('fa-edit')) {
            addInfoTextArea(e.target.parentElement.firstElementChild);
            e.target.classList.add('fa-save');
            e.target.classList.remove('fa-edit');
        } else if (e.target.classList.contains('fa-save')) {
            removeInfoTextArea(e.target.parentElement.firstElementChild);
            e.target.classList.add('fa-edit');
            e.target.classList.remove('fa-save');
        }
    }
}

// Modify info in the text boxes
function addInfoTextBox(infoElement) {
    // Modify info
    const infoTextBox = document.createElement('input');
    infoTextBox.type = 'text';
    if(infoElement.parentElement.className === "boxed") {
        infoTextBox.className = "fill";
    }
    infoTextBox.value = infoElement.innerText;

    infoElement.before(infoTextBox);
    infoElement.parentElement.removeChild(infoElement);
}

// Modify info in the text boxes
function addInfoTextArea(infoElement) {
    // Modify info
    const infoTextBox = document.createElement('textArea');
    infoTextBox.setAttribute("rows", "5");
    infoTextBox.setAttribute("cols", "40");
    if(infoElement.parentElement.className === "boxed") {
        infoTextBox.className = "fill";
    }
    infoTextBox.value = infoElement.innerText;

    infoElement.before(infoTextBox);
    infoElement.parentElement.removeChild(infoElement);
}

// Remove the text boxes
function removeInfoTextBox(infoElement) {
    const newElement = document.createElement('span');
    newElement.innerText = infoElement.value;
    infoElement.parentElement.firstElementChild.before(newElement);
    infoElement.parentElement.removeChild(infoElement);
}

// Remove the text boxes
function removeInfoTextArea(infoElement) {
    const newElement = document.createElement('span');
    newElement.innerText = infoElement.value;
    infoElement.parentElement.firstElementChild.before(newElement);
    infoElement.parentElement.removeChild(infoElement);
}


// closes the select box
function closeAllSelect(elmnt) {
  /*a function that will close all select boxes in the document,
  except the current select box:*/
  const arrNo = [];
  const x = document.getElementsByClassName("select-items");
  const y = document.getElementsByClassName("select-selected");
  for (let i = 0; i < y.length; i++) {
    if (elmnt === y[i]) {
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

/*********************** Display an User Object's Profile Info from an Array of Users ************************/

// Load a user profile by creating new DOM elements from a user profile to replace the default DOM elements
function loadUserProfile(currUser){
    // change the src of the profile picture
    const currPic = profilePic.getElementsByTagName('img')[0];
    currPic.src = currUser.avatar;

    // create the DOM elements in the user profile info for name, username, phone number and email
    const name = document.createElement('h3');
    name.appendChild(document.createTextNode(currUser.firstName + ' ' + currUser.lastName));

    const id = document.createElement('span');
    id.id = "userId";
    id.appendChild(document.createTextNode(currUser.username));

    const phone = document.createElement('span');
    phone.appendChild(document.createTextNode(currUser.phone));

    const email = document.createElement('span');
    email.appendChild(document.createTextNode(currUser.email));

    // modify the DOM elements in the user profile info for name, username, phone number and email
    const currName = profile.getElementsByTagName('h3')[0];
    userInfo.before(name);
    profile.removeChild(currName);

    // display the bio of the user
    const currBio = userInfo.getElementsByTagName('div')[0];
    const spanBio = currBio.getElementsByTagName('span')[0];
    spanBio.innerText = currUser.bio;

    const currId = userInfo.getElementsByTagName('div')[1];
    const spanId = currId.getElementsByTagName('p')[0];
    spanId.removeChild(spanId.getElementsByTagName('span')[0]);
    spanId.appendChild(id);

    const currPhone = userInfo.getElementsByTagName('div')[2];
    const spanPhone = currPhone.getElementsByTagName('p')[0];
    const spanElement = spanPhone.getElementsByTagName('span')[0];
    spanElement.before(phone);
    spanPhone.removeChild(spanElement);

    const currEmail = userInfo.getElementsByTagName('div')[3];
    const spanEmail = currEmail.getElementsByTagName('p')[0];
    const spanElement2 = spanEmail.getElementsByTagName('span')[0];
    spanElement2.before(email);
    spanEmail.removeChild(spanElement2);

    const payment = document.getElementById("payment");
    const select = payment.getElementsByTagName("select")[0];
    const firstOption = select.getElementsByTagName("option")[0];
    const secondOption = select.getElementsByTagName("option")[1];
    if (currUser.byCreditCard) {
        firstOption.innerText = "Handle Transaction by Credit Card";
        secondOption.innerText = "Handle Transaction by Myself"
    } else {
        firstOption.innerText = "Handle Transaction by Myself";
        secondOption.innerText = "Handle Transaction by Credit Card";
    }
}

function init() {
    const request = new Request("/api/getCurrentUser");
    fetch(request).then((result) => {
        return result.json();
    }).then((json) => {
        const user = json.user;
        loadUserProfile(user);
    })
}
init();

/*********************** Jump to the Posts I Made ************************/

// Jump to the posts page
const postIMade = document.querySelector("#postIMade");
postIMade.addEventListener("click", jumpToPostIMade);

function jumpToPostIMade(e) {
    const userId = document.querySelector("#userId").innerHTML.trim();
    console.log(userId);
    //Make a server call and to find all the post this user have made,
    //Which should be stored in the field "user.sell", use the generatePost function
    // in item.js to generate all the result in the items page.
    //Here just jump to items page directly.
    document.location = "../pages/items.html";
}