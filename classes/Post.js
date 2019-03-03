import { users } from "./User.js";


/**
 * This module contains a Post class for user's when they post an ad.
 */

let postId = 0;
export class Post {
  constructor(title, seller, price, category, condition, description) {
    this._postId = postId++;
    this._title = title;
    this._seller = seller;
    seller.sell.push(this);
    this._image = "";
    this._category = category;
    this._condition = condition;
    this._description = description;
    this._price = price;
    this._isSold = false;
    //Should bind with the corresponding transaction if there is one
    this._transaction = null;
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


// Constant Posts for phase 1
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





export{ posts };