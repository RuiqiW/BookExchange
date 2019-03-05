let num_posts = 0;

const sortingOpt = document.querySelector("#sortingOption");
sortingOpt.addEventListener("change", onSortingOptChange);

function onSortingOptChange() {
    const newOption = sortingOpt.value;
    if (newOption === "timeNewToOld") {
        posts.sort(function(a,b) {
            if (a.postingDate <= b.postingDate) {
                return 1;
            } else {
                return -1;
            }
        });
    } else if(newOption === "timeOldToNew") {
        posts.sort(function(a,b) {
            if (a.postingDate <= b.postingDate) {
                return -1;
            } else {
                return 1;
            }
        });
    } else if (newOption === "priceLowToHigh") {
        posts.sort(function(a, b) {
            if (a.price <= b.price) {
                return -1;
            } else {
                return 1;
            }
        });
    } else {//priceHighToLow
        posts.sort(function(a, b) {
            if (a.price <= b.price) {
                return 1;
            } else {
                return -1;
            }
        });
    }
    generateSearchResult(posts, users[0]);
}

function init() {
    // Server call to request the search results to display and the current user
    //Here we use the hard-coded in the data.js as an demonstration
    //By default sorting by posting date from new to old
    const user = users[0];
    posts.sort(function(a,b) {
        if (a.postingDate <= b.postingDate) {
            return 1;
        } else {
            return -1;
        }
    });
    generateSearchResult(posts, user);

    //Server call to request item in the shopping cart
    //Here just use user0;
    const cartNumber = user.shortlist.length;
    updateShoppingCart(cartNumber);
}

function updateShoppingCart(newNumber) {
    const shoppingCartNumber = document.querySelector("#cartNumber");
    shoppingCartNumber.innerText = newNumber;
}

/**
 * Generate the posts onto the page.
 * @param posts the posts should appear on this page
 * @user current user
 */
function generateSearchResult(posts, user) {
    //clear the posts currently displayed on screen
    while (document.querySelector("#posts").lastElementChild) {
        document.querySelector("#posts").removeChild(document.querySelector("#posts").lastElementChild)
    }
    for (let i = 0; i<posts.length; i++) {
        document.querySelector("#posts").appendChild(generatePost(posts[i], user));
    }
    const endOfResults = document.createElement("div");
    endOfResults.id = "endOfResults";
    endOfResults.appendChild(document.createTextNode("End of Results"));
    document.querySelector("#posts").appendChild(endOfResults);

}

/**
 * Generate the div of this post.
 * @param post the post that wanted to be displayed
 * @user the current user, this is used to check whether item is already in the cart.
 */
function generatePost(post, user) {

    const postDiv = document.createElement("div");
    postDiv.className = "post";

    const sellerProfilePhoto = document.createElement("img");
    sellerProfilePhoto.className="profilePhoto";
    sellerProfilePhoto.setAttribute("src", post.seller.avatar);
    sellerProfilePhoto.setAttribute("alt", "sellerPhoto");

    const sellerNameSpan = document.createElement("span");
    sellerNameSpan.className="userName";
    sellerNameSpan.appendChild(document.createTextNode(post.seller.user.firstName + " " + post.seller.user.lastName));

    postDiv.appendChild(sellerProfilePhoto);
    postDiv.appendChild(sellerNameSpan);
    postDiv.appendChild(document.createElement("br"));

    const postIdSpan = document.createElement("span");
    postIdSpan.className = "postId";
    const postIdNumber = document.createElement("span");
    postIdNumber.className = "postIdNumber";
    postIdNumber.appendChild(document.createTextNode(post.postId));
    postIdSpan.appendChild(postIdNumber);
    postDiv.appendChild(postIdSpan);

    const categorySpan = document.createElement("span");
    categorySpan.className = "category";
    categorySpan.appendChild(document.createTextNode(post.title));
    postDiv.appendChild(categorySpan);

    const conditionSpan = document.createElement("span");
    conditionSpan.className = "condition";
    conditionSpan.appendChild(document.createTextNode("Condition: " + post.condition));
    postDiv.appendChild(conditionSpan);

    const timeSpan = document.createElement("span");
    timeSpan.className = "timespan";
    timeSpan.appendChild(document.createTextNode("Posting Time: " + post.postingDate));
    postDiv.appendChild(timeSpan);

    const descriptionDiv = document.createElement("div");
    descriptionDiv.className="description";
    descriptionDiv.appendChild(document.createTextNode(post.description));
    postDiv.appendChild(descriptionDiv);

    const priceDiv = document.createElement("div");
    priceDiv.className = "price";
    priceDiv.appendChild(document.createTextNode("CAD "+post.price));
    postDiv.appendChild(priceDiv);

    if (post.images.length > 0) {
        const pictureContainer = document.createElement("div");
        const lightboxAttr = `pictureSet${num_posts}`;
        for (let k=0;k<post.images.length;k++) {
            const a = document.createElement("a");
            a.setAttribute("href", post.images[k]);
            a.setAttribute("data-lightbox",lightboxAttr);
            const image = document.createElement("img");
            image.className = "itemPicture";
            image.setAttribute("src", post.images[k]);
            a.appendChild(image);
            pictureContainer.appendChild(a);
        }
        postDiv.appendChild(pictureContainer);
    }

    postDiv.appendChild(document.createElement("hr"));

    if (!user.shortlist.includes(post)) {
        const removeButton = document.createElement("button");
        removeButton.className = "addToCart";
        removeButton.appendChild(document.createTextNode("Add to Cart"));
        postDiv.appendChild(removeButton);
    } else {
        const addButton = document.createElement("button");
        addButton.className = "removeFromCart";
        addButton.appendChild(document.createTextNode("remove From Cart"));
        postDiv.appendChild(addButton);
    }

    const contactSeller = document.createElement("button");
    contactSeller.className="contactSeller";
    contactSeller.appendChild(document.createTextNode("Contact the seller"));

    const buyItem = document.createElement("button");
    buyItem.className="buyItem";
    buyItem.appendChild(document.createTextNode("Buy this item"));


    postDiv.appendChild(contactSeller);
    postDiv.appendChild(buyItem);

    return postDiv;



}
init();
const addToCartButtons = document.querySelectorAll(".addToCart");
for (let i = 0; i<addToCartButtons.length; i++) {
    addToCartButtons[i].addEventListener("click", addToCart);
}

function addToCart(e) {
    //Server call to update the shopping cart of the user
    // Here just user0
    const user = users[0];
    const postId = parseInt(e.target.parentElement.querySelector(".postIdNumber").innerHTML);
    user.shortlist.push(posts.filter(function(x) {
        return x.postId === postId;
    })[0]);
    updateShoppingCart(user.shortlist.length);
    //Change the button to remove the item from shopping cart.
    e.target.className = "removeFromCart";
    e.target.innerHTML = "";
    e.target.appendChild(document.createTextNode("Remove From Cart"));
    e.target.removeEventListener("click", addToCart);
    e.target.addEventListener("click", removeFromCart);
}

function removeFromCart(e) {
    //Server call to update the shopping cart of user
    // Here just use user0
    const user = users[0];
    const postId = parseInt(e.target.parentElement.querySelector(".postIdNumber").innerHTML);
    user.shortlist.splice(user.shortlist.indexOf(posts.filter(function(x) {
        return x.postId === postId;
    })[0]), 1);

    e.target.className = "addToCart";
    e.target.innerHTML = "";
    e.target.appendChild(document.createTextNode("Add to Cart"));
    e.target.removeEventListener("click", removeFromCart);
    e.target.addEventListener("click", addToCart);

    updateShoppingCart(user.shortlist.length);
}

