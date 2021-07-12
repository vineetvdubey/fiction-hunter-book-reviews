import './BookDetails.css';
import React from 'react';
import PropTypes from 'prop-types';

class BookDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = { book: {} };
  }

  fetchBookDetails = (bookId) => {
    fetch(`/api/books/${bookId}`)
      .then((response) => response.json())
      .then((data) => {
        this.setState({ book: data });
      });
  };

  componentDidMount() {
    this.fetchBookDetails(this.props.match.params.bookId);
  }

  render() {
    const book = this.state.book;
    return (
      <>
        <div className="book-img">
          <img
            src={book.imageUrl ? book.imageUrl : '/book-covers/default-cover.svg'}
            height="375px"
            width="275px"
            alt="book cover"
          />
        </div>
        <div className="book-details">
          <div>{book.title}</div>
          <div>- by {book.author}</div>
          <div>{book.averageRating === 0 ? 'Be the first to rate!' : `Rated: ${book.averageRating}/5`}</div>
        </div>
        <div>
          {book.description}
        </div>
        <div>
          {book.reviews}
        </div>
      </>
    );
  }
}

BookDetails.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      bookId: PropTypes.string,
    }),
  }).isRequired,
};

export default BookDetails;
