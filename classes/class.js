let postId = 0;
let transactionId = 0;
let date = new Date();

import {users} from "./User";

class Post{
    constructor(title, seller){
        this.postId = postId;
        this.title = title;
        this.seller = seller;
        this.image = [];
        this.category = "Textbook";
        this.condition = "New";
        this.description = "";
        this.price = "$10";
        postId ++;
        this.isSold = 0;
        //Should bind with the corresponding transaction if there is one
        this.transaction = null;
        seller.sell.push(this);
    }
}

class Transaction{
    constructor(post, buyer, amount){
        this.id = transactionId;
        this.post = post;
        this.buyer = buyer;
        this.amount = amount;
        this.date = date.toDateString();
        this.status = 0;    // 0 for uncompleted, 1 for completed
        transactionId ++;
        post.isSold = 1;
        post.transaction = this;
        buyer.purchase.push(post);
    }
}

// Posts
const posts =[];
const post1 = new Post("Calculus", users[0]);
post1.image.push("../images/admin/textbook1.jpg");
posts.push(post1);

const post2 = new Post("Algorithms", users[1]);
post2.image.push("../images/admin/textbook2.jpg");
posts.push(post2);

const post3 = new Post("Chez Nous", users[1]);
post3.image.push("../images/admin/textbook3.jpg");
posts.push(post3);

const post4 = new Post("Microeconomics", users[0]);
post4.image.push("../images/admin/textbook4.jpg");
posts.push(post4);

const post5 = new Post("Statistics", users[0]);
post5.image.push("../images/admin/textbook5.jpg");
posts.push(post5);

const post6 = new Post("Web Programming", users[0]);
posts.push(post6);

const post7 = new Post("Linear Algebra", users[1]);
posts.push(post7);

const transactions =[];
transactions.push(new Transaction(post6, users[0], "$45"));
transactions.push(new Transaction(post7, users[1], "$24"));