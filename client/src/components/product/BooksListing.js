import './BooksListing.css';
import React from 'react';
import BooksListingEntry from './BooksListingEntry';

class BooksListing extends React.Component {
  constructor(props) {
    super(props);
    this.state = { books: [] };
  }

  componentDidMount() {
    this.fetchAllBooks();
  }

  fetchAllBooks = () => {
    fetch(`/api/books`)
      .then((response) => response.json())
      .then((data) => {
        this.setState({ books: data });
      });
  };

  render() {
    return (
      <>
        <div className="books-listing-entry-container">
          {this.state.books.map((book) => (
            <BooksListingEntry key={book.bookId} book={book} />
          ))}
        </div>
      </>
    );
  }
}

export default BooksListing;
