import './App.css';
import React from 'react';
import BooksListing from './components/product/product-listing/BooksListing';
import BookDetails from './components/product/product-details/BookDetails';
import Header from './components/generic/Header';
import Footer from './components/generic/Footer';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { user: {} };
  }

  updateSession = (data) => {
    this.setState({ user: data });
  };

  deleteSession = () => {
    this.setState({ user: {} });
  };

  fetchSession = () => {
    fetch(`/api/users/me`)
      .then((response) => response.json())
      .then((data) => {
        if (!data.error) {
          this.updateSession(data);
        }
      });
  };

  componentDidMount() {
    this.fetchSession();
  }

  render() {
    const user = this.state.user;
    return (
      <>
        <Header user={user} updateSession={this.updateSession} deleteSession={this.deleteSession} />
        <Router>
          <Switch>
            <Route exact path="/details/:bookId" render={(props) => <BookDetails user={user} {...props} />} />
            <Route exact path="/" render={(props) => <BooksListing user={user} {...props} />} />
          </Switch>
        </Router>
        <Footer />
      </>
    );
  }
}

export default App;
