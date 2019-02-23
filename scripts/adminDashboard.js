"use strict";

// data: will be implemented by database later
const users=[];
const posts=[];
const transactions=[];
const messages=[];

let postEdited = 0;

const navExpansion = document.querySelector("#navExpansion");
const navClose = document.querySelector('#navClose');
const chatShow = document.querySelector("#chatShow");
const main = document.querySelector("#main");
const editPost = document.querySelector("#editPost");

navExpansion.addEventListener('click', openSideNav);
navClose.addEventListener('click', closeSideNav);
chatShow.addEventListener('click', showChatRoom);
editPost.addEventListener('click', changeEditMode);

function changeEditMode(e){
    e.preventDefault();

    if(postEdited === 0){
        postEdited = 1;
        editPost.innerText = "save";
    }else{
        postEdited = 0;
        editPost.innerText = "edit";
    }
}
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
