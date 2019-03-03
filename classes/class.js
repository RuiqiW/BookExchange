
import { users } from "./User.js";

let postId = 0;
let transactionId = 0;
let date = new Date();


export class Post{

    constructor(title, seller){
        this._postId = postId;
        this._image = "";
        this._category = "Textbook";
        this._condition = "New";
        this._description = "";
        this._price = "$10";
        postId ++;
        this._isSold = 0;
        //Should bind with the corresponding transaction if there is one
        this._transaction = null;
        seller.sell.push(this);
        this._title = title;
        this._seller = seller;
    }

    get title() {
        return this._title;
    }


    get seller() {
        return this._seller;
    }


    get postId() {
        return this._postId;
    }


    get image() {
        return this._image;
    }

    set image(value) {
        this._image = value;
    }

    get category() {
        return this._category;
    }

    set category(value) {
        this._category = value;
    }

    get condition() {
        return this._condition;
    }

    set condition(value) {
        this._condition = value;
    }

    get description() {
        return this._description;
    }

    set description(value) {
        this._description = value;
    }

    get price() {
        return this._price;
    }

    set price(value) {
        this._price = value;
    }

    get isSold() {
        return this._isSold;
    }

    set isSold(value) {
        this._isSold = value;
    }

    get transaction() {
        return this._transaction;
    }

    set transaction(value) {
        this._transaction = value;
    }
}

export class Transaction{

    constructor(post, buyer, amount){
        this._id = transactionId;
        this._date = date.toDateString();
        this._status = 0;    // 0 for uncompleted, 1 for completed
        transactionId ++;
        post.isSold = 1;
        post.transaction = this;
        buyer.purchase.push(post);
        this._post = post;
        this._buyer = buyer;
        this._amount = amount;
    }

    get post() {
        return this._post;
    }


    get buyer() {
        return this._buyer;
    }


    get amount() {
        return this._amount;
    }

    get id() {
        return this._id;
    }


    get date() {
        return this._date;
    }


    get status() {
        return this._status;
    }

    set status(value) {
        this._status = value;
    }
}

// Posts
const posts =[];
const post1 = new Post("Calculus", users[0]);
post1.image = "../images/admin/textbook1.jpg";
posts.push(post1);

const post2 = new Post("Algorithms", users[2]);
post2.image = "../images/admin/textbook2.jpg";
posts.push(post2);

const post3 = new Post("Chez Nous", users[2]);
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

const post7 = new Post("Linear Algebra", users[2]);
posts.push(post7);

const transactions =[];
transactions.push(new Transaction(post6, users[2], "$45"));
transactions.push(new Transaction(post7, users[0], "$24"));

export{ posts };
export{ transactions };