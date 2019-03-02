/**
 * This module contains a Book class with some inheritable methods
 */
export default class Book {
  constructor(title, author, year, price) {
    // --- Private attributes ---
    this._title = title;
    this._author = author;
    this._year = year;
    this._price = price;
  }

  // --- Public Methods ---
  get title() {
    return this._title;
  }

  set title(newTitle) {
    this._title = newTitle;
  }

  get author() {
    return this._author;
  }

  set author(newAuthor) {
    this._author = newAuthor;
  }

  get year() {
    return this._year;
  }

  set year(newYear) {
    this._year = newYear;
  }

  get price() {
    return this._price;
  }

  set price(newPrice) {
    this._price = newPrice;
  }

}


/**
 * Create some static Books for the purpose of phase 1
 */
const books = [];




export { books };