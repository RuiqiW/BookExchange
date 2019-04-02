let user;
let basket;

init();

const removeButtons = document.querySelectorAll(".removeFromCart");
for (let i = 0; i<removeButtons.length;i++) {
    removeButtons[i].addEventListener("click", removeCartItem);
}

function removeCartItem(e) {
    const target = e.target;
    const posts = document.querySelector("#posts");
    posts.removeChild(target.parentElement.previousElementSibling);
    posts.removeChild(target.parentElement);
    updateOrderSummary();

    //Make a server call to remove the item
    //Check whether the shopping cart is empty, replace with an
    // information if there is no item in shopping cart.
    const currentPosts = document.querySelectorAll(".post");
    if (currentPosts.length === 0) {
        const emptyInfoDiv = document.createElement("div");
        emptyInfoDiv.id = "emptyInformation";
        const text = document.createTextNode("Your shopping cart is currently empty");

        emptyInfoDiv.appendChild(text);
        document.querySelector("#posts").appendChild(emptyInfoDiv);
    }
}

function init() {
    //Get the User from server here
    //User users[0] as an demonstration.
    //Update the profile photo on top right corner
    const request = new Request("/api/getCurrentUser");
    fetch(request).then((result) => {
       return result.json();
    }).then((json) => {
        user = json.user;
        const userInfoDiv = document.querySelector("#userInfo");
        userInfoDiv.removeChild(userInfoDiv.lastElementChild);
        const a = document.createElement("a");
        a.setAttribute("href", "./userProfile.html");
        const image = document.createElement("img");
        image.setAttribute("src", user.avatar);
        image.setAttribute("alt", "user profile photo");
        image.className = "loginProfilePhoto";
        a.appendChild(image);
        userInfoDiv.appendChild(a);

        const orderSummary = document.getElementById("checkout");
        const h4 = orderSummary.getElementsByTagName("h4")[0];
        const spanCount = h4.getElementsByTagName("span")[0];
        const count = spanCount.getElementsByTagName("b")[0];
        count.innerText = 0;

        const summary = document.getElementById("summary");
        const costSpan = summary.getElementsByTagName("span")[0];
        const cost = costSpan.getElementsByTagName("b")[0];
        cost.innerText = "$0.00";

        const books = document.getElementsByClassName("book");
        const len = books.length;
        for (let c = 0; c < len; c++) {
            orderSummary.removeChild(books[0]);
        }

        basket = user.shortlist;
        //Remove items hard-coded in the html file
        const posts = document.querySelector("#posts");
        while (posts.lastElementChild) {
            posts.removeChild(posts.lastElementChild);
        }
        if (user.shortlist.length === 0) {
            const emptyInfoDiv = document.createElement("div");
            emptyInfoDiv.id = "emptyInformation";
            const text = document.createTextNode("Your shopping cart is currently empty");

            emptyInfoDiv.appendChild(text);
            document.querySelector("#posts").appendChild(emptyInfoDiv);
        } else {
            for (let i = 0; i<basket.length;i++) {
                const label = document.createElement("label");
                label.setAttribute("class", "container");
                const input = document.createElement("input");
                input.setAttribute("type", "checkbox");
                input.setAttribute("checked", "checked");
                input.setAttribute("class", "check");
                input.addEventListener("click", updateOrderSummary);
                label.appendChild(input);
                const spanInLabel = document.createElement("span");
                spanInLabel.setAttribute("class", "checkmark");
                label.appendChild(spanInLabel);

                const book = document.createElement("p");
                book.setAttribute("class", "book");
                book.appendChild(document.createTextNode(`Book ${i+1}`));
                const spanElement = document.createElement("span");
                spanElement.setAttribute("class", "amount");
                const bElement = document.createElement("b");
                bElement.appendChild(document.createTextNode(`$${basket[i].price}`));
                spanElement.appendChild(bElement);
                book.appendChild(spanElement);
                const hrElement = document.getElementsByTagName("hr");
                hrElement[hrElement.length-1].before(book);
                const newCost = parseFloat(cost.innerText.slice(1)) + parseFloat(basket[i].price);
                cost.innerText = `$${newCost}`;
                count.innerText = parseInt(count.innerText) + 1;

                const postDiv = document.createElement("div");
                postDiv.className = "post";

                const sellerProfilePhoto = document.createElement("img");
                sellerProfilePhoto.className="profilePhoto";
                sellerProfilePhoto.setAttribute("src", basket[i].seller.avatar);
                sellerProfilePhoto.setAttribute("alt", "sellerPhoto");

                const sellerNameSpan = document.createElement("span");
                sellerNameSpan.className="userName";
                sellerNameSpan.appendChild(document.createTextNode(basket[i].seller.firstName + " " + basket[i].seller.lastName));

                postDiv.appendChild(sellerProfilePhoto);
                postDiv.appendChild(sellerNameSpan);
                postDiv.appendChild(document.createElement("br"));

                const postIdSpan = document.createElement("span");
                postIdSpan.className = "postId";
                const postIdNumber = document.createElement("span");
                postIdNumber.className = "postIdNumber";
                postIdNumber.appendChild(document.createTextNode(basket[i].postId));
                postIdSpan.appendChild(postIdNumber);
                postDiv.appendChild(postIdSpan);

                const categorySpan = document.createElement("span");
                categorySpan.className = "category";
                categorySpan.appendChild(document.createTextNode(basket[i].title));
                postDiv.appendChild(categorySpan);

                const conditionSpan = document.createElement("span");
                conditionSpan.className = "condition";
                conditionSpan.appendChild(document.createTextNode("Condition: " + basket[i].condition));
                postDiv.appendChild(conditionSpan);

                const timeSpan = document.createElement("span");
                timeSpan.className = "timespan";
                timeSpan.appendChild(document.createTextNode("Posting Time: " + basket[i].postingDate));
                postDiv.appendChild(timeSpan);

                const descriptionDiv = document.createElement("div");
                descriptionDiv.className="description";
                descriptionDiv.appendChild(document.createTextNode(basket[i].description));
                postDiv.appendChild(descriptionDiv);

                const priceDiv = document.createElement("div");
                priceDiv.className = "price";
                priceDiv.appendChild(document.createTextNode("CAD "+basket[i].price));
                postDiv.appendChild(priceDiv);

                if (basket[i].image.length > 0) {
                    const pictureContainer = document.createElement("div");
                    const lightboxAttr = `pictureSet${i}`;
                    for (let k=0;k<basket[i].image.length;k++) {
                        const a = document.createElement("a");
                        a.setAttribute("href", basket[i].image[k]);
                        a.setAttribute("data-lightbox",lightboxAttr);
                        const image = document.createElement("img");
                        image.className = "itemPicture";
                        image.setAttribute("src", basket[i].image[k]);
                        a.appendChild(image);
                        pictureContainer.appendChild(a);
                    }
                    postDiv.appendChild(pictureContainer);
                }

                postDiv.appendChild(document.createElement("hr"));

                const removeButton = document.createElement("button");
                removeButton.className="removeFromCart";
                removeButton.appendChild(document.createTextNode("Remove from Cart"));

                const contactSeller = document.createElement("button");
                contactSeller.className="contactSeller";
                contactSeller.appendChild(document.createTextNode("Contact the Seller"));

                postDiv.appendChild(removeButton);
                postDiv.appendChild(contactSeller);

                const posts = document.querySelector("#posts");
                posts.appendChild(label);
                posts.appendChild(postDiv);

            }
        }
    });
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

/*********************** Contact Seller by User "user" for Phase 1 ************************/

// Show / Hide chatbox
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

const contactButton = document.querySelectorAll('.contactSeller');

// as explained in phase1.txt, we are showing how the button should behave from "user1 user1"'s post for phase 1
contactButton[1].addEventListener("click", contactTheSeller);

function contactTheSeller(e) {
    showChatRoom(e);
}

/*********************** Select Books for Checkout ************************/


function updateOrderSummary(e) {
    const orderSummary = document.getElementById("checkout");
    const h4 = orderSummary.getElementsByTagName("h4")[0];
    const spanCount = h4.getElementsByTagName("span")[0];
    const count = spanCount.getElementsByTagName("b")[0];
    count.innerText = 0;
    const summary = document.getElementById("summary");
    const costSpan = summary.getElementsByTagName("span")[0];
    const cost = costSpan.getElementsByTagName("b")[0];
    cost.innerText = "$0.00";

    const books = document.getElementsByClassName("book");
    const len = books.length;
    for (let c = 0; c < len; c++) {
        orderSummary.removeChild(books[0]);
    }

    // we only handle transactions online when both user and seller selected handle by credit card
    let needToAlert = false;

    if (user.shortlist.length !== 0) {
        for (let i = 0; i<basket.length;i++) {
            if (document.getElementsByClassName("check")[i].checked) {
                if (!basket[i].byCreditCard) {
                    needToAlert = true;
                } else {
                    const book = document.createElement("p");
                    book.setAttribute("class", "book");
                    book.appendChild(document.createTextNode(`Book ${i+1}`));
                    const spanElement = document.createElement("span");
                    spanElement.setAttribute("class", "amount");
                    const bElement = document.createElement("b");
                    bElement.appendChild(document.createTextNode(`$${basket[i].price}`));
                    spanElement.appendChild(bElement);
                    book.appendChild(spanElement);
                    const hrElement = document.getElementsByTagName("hr");
                    hrElement[hrElement.length-1].before(book);
                    const newCost = parseFloat(cost.innerText.slice(1)) + parseFloat(basket[i].price);
                    cost.innerText = `$${newCost}`;
                    count.innerText = parseInt(count.innerText) + 1;
                }
            }
        }
    }

    if (needToAlert) {
        alert("Some selected book(s) cannot be handled online.");
    }
}