"use strict";

const navExpansion = document.querySelector("#navExpansion");
const navClose = document.querySelector('#navClose');
const chatShow = document.querySelector("#chatShow");
const main = document.querySelector("#main");

navExpansion.addEventListener('click', openSideNav);
navClose.addEventListener('click', closeSideNav);
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