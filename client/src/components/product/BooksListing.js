import './BooksListing.css';
import React from 'react';

class BooksListing extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props);
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
        <h2>Product listing</h2>
      </>
    );
  }
}

export default BooksListing;
