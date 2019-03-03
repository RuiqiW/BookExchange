let userId = 0;
let postId = 0;
let transactionId = 0;
let date = new Date();

class User{
    constructor(firstName, lastName, userName, email, password) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.userName = userName;
        this.email = email;
        this.password = password;
    }
}

class UserProfile{
    constructor(user){
        this.userId = userId;
        this.user = user;
        this.avatar = ""; // src of avatar
        this.bio = "";
        this.phone = "1234567890";
        this.sell = []; // selling items
        this.purchase = []; // purchased items
        this.shortlist = []; // Add to Cart items
        userId++;
    }
}

class Post{
    constructor(title, seller){
        this.postId = postId;
        this.title = title;
        this.seller = seller;
        this.image = "";
        this.category = "Textbook";
        this.condition = "New";
        this.description = "";
        this.price = "$10";
        postId ++;
    }
}

class Transaction{
    constructor(item, buyer, amount){
        this.id = transactionId;
        this.item = item;
        this.buyer = buyer;
        this.amount = amount;
        this.date = date.getTime();
        this.status = 0;    // 0 for uncompleted, 1 for completed
        transactionId ++;
    }
}

// User Profiles
const users = [];
const defaultUser = new User("user", "user", "user", "user@example.com", "user");
users.push(new UserProfile(defaultUser));
