const removeButtons = document.querySelectorAll(".removeFromCart");
for (let i = 0; i<removeButtons.length;i++) {
    removeButtons[i].addEventListener("click", removeCartItem);
}

function removeCartItem(e) {
    const target = e.target;
    const posts = document.querySelector("#posts");
    posts.removeChild(target.parentElement);
    //Check whether the shopping cart is empty, replace with an
    // information if there is no item in shopping cart.
    const currentPosts = document.querySelectorAll(".post");
    if (currentPosts.length === 0) {
        const endOfResult = document.querySelector("#endOfResults");
        posts.removeChild(endOfResult);

        const emptyInfoDiv = document.createElement("div");
        emptyInfoDiv.id = "emptyInformation";
        const text = document.createTextNode("Your shopping cart is currently empty");

        emptyInfoDiv.appendChild(text);
        document.querySelector("#posts").appendChild(emptyInfoDiv);
    }
}