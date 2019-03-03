import {users} from "./User";



let transactionId = 0;
let date = new Date();

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



const transactions =[];
transactions.push(new Transaction(post6, users[2], "$45"));
transactions.push(new Transaction(post7, users[0], "$24"));





export{ transactions };