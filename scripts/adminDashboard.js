"use strict";

// data: will be implemented by database later
const users=[];
const posts=[];
const transactions=[];
const messages=[];

let postEdited = 0;


// load data on DOM loaded
document.addEventListener('DOMContentLoaded', function() {
    loadUserNum();
    loadPostNum();
    loadTransactionNum();
    loadMessageNum();

});

function loadUserNum(){
    document.querySelector('#userData').innerText = users.length;
}

function loadPostNum(){
    document.querySelector('#postData').innerText = posts.length;
}

function loadTransactionNum(){
    document.querySelector('#transactionData').innerText = transactions.length;
}

function loadMessageNum(){
    document.querySelector('#msgData').innerText = messages.length;
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
    main.style.marginLeft= "0";
}

function showChatRoom(e){
    e.preventDefault();
    const chatRoom = document.querySelector('#chatRoom');
    chatRoom.style.display = "block";
}

function hideChatRoom(e){
    e.preventDefault();
    const chatRoom = document.querySelector('#chatRoom');
    chatRoom.style.display = "none";
}



/***************** Post Management *****************/

const editPost = document.querySelector("#editPost");
editPost.addEventListener('click', changeEditMode);

const deleteItems = document.querySelectorAll('.deleteItem');

Array.from(deleteItems).forEach(function(element) {
    element.addEventListener('click', deleteItem);
});

function changeEditMode(e){
    e.preventDefault();

    if(postEdited === 0){
        postEdited = 1;
        editPost.innerText = "save";
        for(let i=0; i<deleteItems.length; i++){
            deleteItems[i].style.display = "inline-block";
        }
    }else{
        postEdited = 0;
        editPost.innerText = "edit";
        for(let i=0; i<deleteItems.length; i++){
            deleteItems[i].style.display = "none";
        }
    }
}


function deleteItem(e){
    e.preventDefault();

    if(window.confirm("Do you want to delete this post?")){
        removePost(e);
        window.alert("You have deleted this post.");
    }
}

function removePost(e){
    const post = e.target.parentElement.parentElement;
    const entry = post.parentElement;
    entry.removeChild(post);
}


/***************** Transaction Management *****************/

const approveButtons = document.querySelectorAll(".approve");
const denyButtons = document.querySelectorAll(".deny");

Array.from(approveButtons).forEach(function(element) {
    element.addEventListener('click', checkTransaction);
});
Array.from(denyButtons).forEach(function(element) {
    element.addEventListener('click', checkTransaction);
});

function checkTransaction(e){
    e.preventDefault();

    if(e.target.classList.contains('approve')){
        if(window.confirm("Do you want to approve this transaction?")){
            deleteTransactionEntry(e);
            window.alert("You have approved this transaction.");
        }
    }else if(e.target.classList.contains('deny')){
        if(window.confirm("Do you want to deny this transaction?")){
            deleteTransactionEntry(e);
            window.alert("You have denied this transaction.");
        }
    }
}

function deleteTransactionEntry(e){
    const row = e.target.parentElement.parentElement.parentElement;
    const tableBody = document.querySelector("#transactionTable").lastElementChild;
    tableBody.removeChild(row);
}


/*********************** Chat Box ************************/
const chat = document.querySelector('#chat');
const sendButton = document.querySelector("#sendButton");
sendButton.addEventListener('click', sendMessage);

function sendMessage(e){
    e.preventDefault();

    if(e.target.classList.contains("submit")){
        const message = document.querySelector("#messageBox").value;
        if(message.length > 0 && message.length < 200){
            addMessage(message);
        }
    }
    chat.scrollTop = chat.scrollHeight;
}

function addMessage(msg){
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
