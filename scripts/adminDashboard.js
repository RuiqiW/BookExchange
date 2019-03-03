import { users } from '../classes/User.js';
import { posts } from '../classes/Post.js';
import { transactions } from '../classes/Transaction.js';

const messages=[];

let postEdited = 0;
let shownUserNum = 0;


// load data on DOM loaded, will use database query instead in Phase 2
document.addEventListener('DOMContentLoaded', function () {
    loadUserNum();
    loadPostNum();
    loadTransactionNum();
    loadMessageNum();
    loadTransaction();
    loadPost();
    loadUserList(0);

});

function loadUserNum() {
    document.querySelector('#userData').innerText = users.length;
}

function loadPostNum() {
    document.querySelector('#postData').innerText = posts.length;
}

function loadTransactionNum() {
    document.querySelector('#transactionData').innerText = transactions.reduce((total, transaction)=>
        total + (transaction.status === 0 ? 1 : 0), 0);
}

function loadMessageNum() {
    document.querySelector('#msgData').innerText = messages.length;
}

function loadTransaction(){
    for(let i=0; i < transactions.length; i++){
        if(transactions[i].status === 0){
            createTransactionEntry(transactions[i]);
        }
    }
}

function loadPost(){
    let j = 5;
    for(let i = 0; i < posts.length; i++){
        if(j > 0){
           if(posts[i].isSold === false){
               createPost(posts[i]);
           }
            j--;
        }else{
            break;
        }
    }

    const deleteItems = document.querySelectorAll('.deleteItem');
    Array.from(deleteItems).forEach(function (element) {
        element.addEventListener('click', deleteItem);
    });
}


function loadUserList(){
    const length = Math.min(users.length - shownUserNum, 3);
    for(let i = 0; i < length; i++){
        createUserList(users[i + shownUserNum]);
    }
    shownUserNum += length;
}



/********** navigation bar and chat box expansion and close ***********/

const main = document.querySelector("#main");
const navExpansion = document.querySelector("#navExpansion");
const navClose = document.querySelector('#navClose');
navExpansion.addEventListener('click', openSideNav);
navClose.addEventListener('click', closeSideNav);

const chatShow = document.querySelector("#chatShow");
const chatHide = document.querySelector("#chatHide");
chatHide.addEventListener('click', hideChatRoom);
chatShow.addEventListener('click', showChatRoom);

function openSideNav(e) {
    e.preventDefault();
    document.querySelector("#sideNav").style.width = "250px";
    main.style.marginLeft = "250px";
}

function closeSideNav(e) {
    e.preventDefault();
    document.querySelector("#sideNav").style.width = "0";
    main.style.marginLeft = "0";
}

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





/***************** Post Management *****************/

const editPost = document.querySelector("#editPost");
editPost.addEventListener('click', changeEditMode);

function changeEditMode(e) {
    e.preventDefault();

    if (postEdited === 0) {
        postEdited = 1;
        editPost.innerText = "save";
        const deleteItems = document.querySelectorAll('.deleteItem');
        for (let i = 0; i < deleteItems.length; i++) {
            deleteItems[i].style.display = "inline-block";
        }
    } else {
        postEdited = 0;
        editPost.innerText = "edit";
        loadPostNum();
        const deleteItems = document.querySelectorAll('.deleteItem');
        for (let i = 0; i < deleteItems.length; i++) {
            deleteItems[i].style.display = "none";
        }
    }
}

function deleteItem(e) {
    e.preventDefault();

    if (window.confirm("Do you want to delete this post?")) {
        // delete post from posts array
        const post = e.target.parentElement.parentElement;
        const postNum = post.lastElementChild.previousSibling;
        const postId = parseInt(postNum.innerText);

        for(let i = 0; i < posts.length; i++){
            if(posts[i].postId === postId){
                posts.splice(i, 1);
                break;
            }
        }
        removePost(e);
        window.alert("You have deleted this post.");
    }
}

function removePost(e) {
    const post = e.target.parentElement.parentElement.parentElement;
    const entry = post.parentElement;
    entry.removeChild(post);
}

function createPost(post){

    const close = document.createElement("span");
    close.className = "deleteItem";
    const icon = document.createElement('i');
    icon.classList.add("fa");
    icon.classList.add("fa-fw");
    icon.classList.add("fa-close");
    close.appendChild(icon);

    const img = document.createElement('img');
    img.src = post.image;
    img.alt = "textbook";
    img.className = "textbookImg";

    const id = document.createElement("span");
    id.className = "postId";
    id.innerText = post.postId;

    const seller = document.createElement("span");
    seller.className = "seller";
    seller.innerText = `seller: ${post.seller.user.username}`;

    const postContainer = document.createElement('div');
    postContainer.className = "post";
    postContainer.appendChild(close);
    postContainer.appendChild(img);
    postContainer.appendChild(id);
    postContainer.appendChild(seller);

    const container = document.createElement('div');
    container.classList.add("col-lg-2");
    container.classList.add("col-md-4");
    container.appendChild(postContainer);

    const viewAll = document.querySelector("#viewAll");
    viewAll.before(container);
}




/******************** User Management ********************/

const userTable = document.querySelector("#userTable");
const sampleViewUser = document.querySelector("#sampleViewUser");
const showLessButton = document.querySelector("#showLessUser");
const showMoreButton = document.querySelector('#showMoreUser');

sampleViewUser.addEventListener('click', viewUserDetail);
showLessButton.addEventListener('click', showLess);
showMoreButton.addEventListener('click', showMore);


function viewUserDetail(e){
    e.preventDefault();

    window.open("../pages/userProfile.html");
}


function showLess(e){
    e.preventDefault();

    const userEntries = document.querySelectorAll('.userEntry');
    const num = shownUserNum;
    for(let i = 1; i <= num; i++){
        try {
            userTable.removeChild(userEntries[i]);
            shownUserNum--;
        }catch(error){}
    }
}


function showMore(e){
    e.preventDefault();

    loadUserList();
}



function createUserList(user){

    const userEntry = document.createElement("div");
    userEntry.className = "userEntry";

    const userContainer = document.createElement('div');
    userContainer.className = "user";
    userEntry.appendChild(userContainer);

    // User Picture
    const userPicContainer = document.createElement('div');
    userPicContainer.className = "userPicContainer";
    userContainer.appendChild(userPicContainer);

    const userPic = document.createElement('img');
    userPic.src = user.avatar;
    userPic.className = "userPic";
    userPic.alt = "userPic";
    userPicContainer.appendChild(userPic);

    // User Description
    const userContent = document.createElement('div');
    userContent.className = "userContent";
    userContainer.appendChild(userContent);

    const username = document.createElement('strong');
    username.innerText = user.user.username;
    userContent.appendChild(username);

    const bio = document.createElement('p');
    bio.innerText = user.bio;
    userContent.appendChild(bio);


    const userAction = document.createElement('div');
    userAction.className = "userAction";
    userEntry.appendChild(userAction);

    const viewUser = document.createElement('button');
    viewUser.className = "viewUserDetail";
    viewUser.innerText = "View Detail";
    userAction.appendChild(viewUser);

    const deleteUser = document.createElement("button");
    deleteUser.className = "deleteUser";
    deleteUser.innerText = "Delete";
    userAction.appendChild(deleteUser);

    userTable.appendChild(userEntry);
}


/***************** Transaction Management *****************/

const approveButtons = document.querySelectorAll(".approve");
const denyButtons = document.querySelectorAll(".deny");

Array.from(approveButtons).forEach(function (element) {
    element.addEventListener('click', checkTransaction);
});
Array.from(denyButtons).forEach(function (element) {
    element.addEventListener('click', checkTransaction);
});

function checkTransaction(e) {
    e.preventDefault();

    if (e.target.classList.contains('approve')) {
        if (window.confirm("Do you want to approve this transaction?")) {

            // change the status of the entry
            const row = e.target.parentElement.parentElement.parentElement;
            const transaction = row.firstElementChild;
            const transactionNum = parseInt(transaction.innerText);
            transactions[transactionNum].status = 1;

            // change num of new transactions
            loadTransactionNum();

            deleteTransactionEntry(e);
            window.alert("You have approved this transaction.");
        }
    } else if (e.target.classList.contains('deny')) {
        if (window.confirm("Do you want to deny this transaction?")) {

            // change the status of the entry
            const row = e.target.parentElement.parentElement.parentElement;
            const transaction = row.firstElementChild;
            const transactionNum = parseInt(transaction.innerText);
            transactions[transactionNum].status = -1;

            // change num of new transactions
            loadTransactionNum();

            deleteTransactionEntry(e);
            window.alert("You have denied this transaction.");
        }
    }
}

function deleteTransactionEntry(e) {
    const row = e.target.parentElement.parentElement.parentElement;
    const tableBody = document.querySelector("#transactionTable").lastElementChild;
    tableBody.removeChild(row);
}

function createTransactionEntry(transaction){

    const row = document.createElement('tr');
    const id = document.createElement('td');
    id.innerText = transaction.id;
    row.appendChild(id);

    const title = document.createElement('td');
    title.innerText = transaction.post.title;
    row.appendChild(title);

    const buyer = document.createElement('td');
    buyer.innerText = transaction.buyer.user.username;
    row.appendChild(buyer);

    const seller = document.createElement('td');
    seller.innerText = transaction.post.seller.user.username;
    row.appendChild(seller);

    const amount = document.createElement('td');
    amount.innerText = transaction.amount;
    row.appendChild(amount);

    const date = document.createElement('td');
    date.innerText = transaction.date;
    row.appendChild(date);

    const action = document.createElement('td');
    const link1 = document.createElement('a');
    link1.href = "#";
    const icon1 = document.createElement('i');
    icon1.classList.add("fa");
    icon1.classList.add("fa-fw");
    icon1.classList.add("fa-check");
    icon1.classList.add("approve");
    icon1.addEventListener('click', checkTransaction);
    link1.appendChild(icon1);
    const link2 = document.createElement('a');
    link2.href = "#";
    const icon2 = document.createElement('i');
    icon2.classList.add("fa");
    icon2.classList.add("fa-fw");
    icon2.classList.add("fa-close");
    icon2.classList.add("deny");
    icon2.addEventListener('click', checkTransaction);
    link2.appendChild(icon2);
    action.append(link1);
    action.appendChild(link2);
    row.appendChild(action);

    const tableBody = document.querySelector("#transactionTable").lastElementChild;
    tableBody.appendChild(row);

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
