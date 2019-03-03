"use strict";

// data: will be implemented by database later
// let userId = 0;
let postId = 0;
let transactionId = 0;
let date = new Date();

import {users} from "../classes/User.js";

// class User {
//     constructor(firstName, lastName, userName, email, password) {
//         this.firstName = firstName;
//         this.lastName = lastName;
//         this.userName = userName;
//         this.email = email;
//         this.password = password;
//     }
// }
//
// class UserProfile {
//     constructor(user) {
//         this.userId = userId;
//         this.user = user;
//         this.avatar = ""; // src of avatar
//         this.bio = "";
//         this.phone = "1234567890";
//         this.sell = []; // selling items
//         this.purchase = []; // purchased items
//         this.shortlist = []; // Add to Cart items
//         userId++;
//     }
// }

class Post {
    constructor(title, seller) {
        this.postId = postId;
        this.title = title;
        this.seller = seller;
        this.image = "";
        this.category = "Textbook";
        this.condition = "New";
        this.description = "";
        this.price = "$10";
        postId++;
        this.isSold = 0;
        //Should bind with the corresponding transaction if there is one
        this.transaction = null;
        seller.sell.push(this);
    }
}

class Transaction {
    constructor(post, buyer, amount) {
        this.id = transactionId;
        this.post = post;
        this.buyer = buyer;
        this.amount = amount;
        this.date = date.toDateString();
        this.status = 0;    // 0 for uncompleted, 1 for completed
        transactionId++;
        post.isSold = 1;
        post.transaction = this;
        buyer.purchase.push(post);

    }
}

// // User Profiles
// const users = [];
// const defaultUser = new User("user", "user", "user", "user@example.com", "user");
// users.push(new UserProfile(defaultUser));
// const user1 = new User("user1", "user1", "user1", "user1@example.com", "user1");
// users.push(new UserProfile(user1));

// Posts
const posts = [];
const post1 = new Post("Calculus", users[0]);
post1.image = "../images/admin/textbook1.jpg";
posts.push(post1);

const post2 = new Post("Algorithms", users[1]);
post2.image = "../images/admin/textbook2.jpg";
posts.push(post2);

const post3 = new Post("Chez Nous", users[1]);
post3.image = "../images/admin/textbook3.jpg";
posts.push(post3);

const post4 = new Post("Microeconomics", users[0]);
post4.image = "../images/admin/textbook4.jpg";
posts.push(post4);

const post5 = new Post("Statistics", users[0]);
post5.image = "../images/admin/textbook5.jpg";
posts.push(post5);

const post6 = new Post("Web Programming", users[0]);
posts.push(post6);

const post7 = new Post("Linear Algebra", users[1]);
posts.push(post7);

const transactions = [];
transactions.push(new Transaction(post6, users[0], "$45"));
transactions.push(new Transaction(post7, users[1], "$24"));
const messages = [];


let postEdited = 0;


// load data on DOM loaded, will use database query instead in Phase 2
document.addEventListener('DOMContentLoaded', function () {
    loadUserNum();
    loadPostNum();
    loadTransactionNum();
    loadMessageNum();
    loadTransaction();

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

function openSideNav() {
    document.querySelector("#sideNav").style.width = "250px";
    main.style.marginLeft = "250px";
}

function closeSideNav() {
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

const deleteItems = document.querySelectorAll('.deleteItem');

Array.from(deleteItems).forEach(function (element) {
    element.addEventListener('click', deleteItem);
});

function changeEditMode(e) {
    e.preventDefault();

    if (postEdited === 0) {
        postEdited = 1;
        editPost.innerText = "save";
        for (let i = 0; i < deleteItems.length; i++) {
            deleteItems[i].style.display = "inline-block";
        }
    } else {
        postEdited = 0;
        editPost.innerText = "edit";
        for (let i = 0; i < deleteItems.length; i++) {
            deleteItems[i].style.display = "none";
        }
    }
}


function deleteItem(e) {
    e.preventDefault();

    if (window.confirm("Do you want to delete this post?")) {
        removePost(e);
        window.alert("You have deleted this post.");
    }
}

function removePost(e) {
    const post = e.target.parentElement.parentElement;
    const entry = post.parentElement;
    entry.removeChild(post);
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
    buyer.innerText = transaction.buyer.user.userName;
    row.appendChild(buyer);

    const seller = document.createElement('td');
    seller.innerText = transaction.post.seller.user.userName;
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
