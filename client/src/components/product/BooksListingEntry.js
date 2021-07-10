import './BooksListing.css';
import PropTypes from 'prop-types';
import React from 'react';

function BooksListingEntry(props) {
  const book = props.book;
  return (
    <>
      <h4>
        {book.title} - By {book.author}
      </h4>
    </>
  );
}

BooksListingEntry.propTypes = {
  book: PropTypes.shape({
    bookId: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
    averageRating: PropTypes.number.isRequired,
  }),
};

export default BooksListingEntry;
