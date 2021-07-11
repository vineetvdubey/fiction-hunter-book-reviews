import './BooksListingEntry.css';
import PropTypes from 'prop-types';
import React from 'react';

function BooksListingEntry(props) {
  const book = props.book;
  return (
    <>
      <div className="book-details-container">
        <div className="book-img">
          <img
            src={book.imageUrl ? book.imageUrl : '/book-covers/default-cover.svg'}
            height="150px"
            width="110px"
            alt="book cover"
          />
        </div>
        <div className="book-details">
          <div>{book.title}</div>
          <div>- by {book.author}</div>
          <div>{book.averageRating === 0 ? 'Be the first to rate!' : `Rated: ${book.averageRating}/5`}</div>
        </div>
      </div>
    </>
  );
}

BooksListingEntry.propTypes = {
  book: PropTypes.shape({
    bookId: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    imageUrl: PropTypes.string,
    averageRating: PropTypes.number.isRequired,
  }),
};

export default BooksListingEntry;
