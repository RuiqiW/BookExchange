"use strict";

// data: will be implemented by database later

const chatShow = document.querySelector("#chatShow");

chatShow.addEventListener('click', showChatRoom);

function showChatRoom(e){
    e.preventDefault();
    const chatRoom = document.querySelector('#chatRoom');
    chatRoom.style.display = "block";
}

/*look for any elements with the class "custom-select":*/
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
/*if the user clicks anywhere outside the select box,
then close all select boxes:*/
document.addEventListener("click", closeAllSelect);

/* Edit Profile */
const editProfile = document.querySelector('#profileInfo');
editProfile.addEventListener('submit', editProfileInfo);

// Edits the text fields
function editProfileInfo(e) {
    e.preventDefault();

    console.log("hi");

    if (e.target.classList.contains('Edit Profile')) {
        const edit = e.target.parentElement;
        const text = edit.getElementsByTagName('textarea')[0];
        text.removeAttribute('readonly');
    }
}