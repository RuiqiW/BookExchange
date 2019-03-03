/**
 * This module contains a Post class for user's when they post an ad.
 */

let postId = 0;
export class Post {
  constructor(title, seller, price, category, condition, description, images) {
    this._postId = postId++;
    this._title = title;
    this._seller = seller;
    seller.sell.push(this);
    this._images = images === [] ? [] : images;
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


  get images() {
    return this._images;
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
