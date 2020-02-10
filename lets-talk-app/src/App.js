import React, { Component } from 'react'
import LandingNavbar from './components/LandingNavbar'
import Footer from './components/Footer'
import Landing from './components/Landing'
import Register from './pages/Register/Register'
import Login from './pages/Login/Login'
import Candidates from './components/Candidates'
import Contacts from './pages/Contacts/Contacts'
import Messages from './pages/Messages/Messages'
import Navbar from './components/Navbar'
import Profile from './components/Profile'
import Photos from './components/Photos'
import logic from './logic'
import { Route, withRouter, Redirect } from 'react-router-dom'

logic.url = process.env.REACT_APP_API_URL

class App extends Component {
  state = {
    error: null,
    contactId: false,
    contactName: false,
    contactPhotos: undefined,
  }

  render() {
    return (
      <>
        {logic.loggedIn && <LandingNavbar />}
        {!logic.loggedIn && <Navbar />}
        <Route
          exact
          path="/"
          render={() =>
            logic.loggedIn ? <Landing /> : <Redirect to="/candidates" />
          }
        />
        <Route
          path="/register"
          render={() =>
            logic.loggedIn ? <Register /> : <Redirect to="/candidates" />
          }
        />
        <Route
          path="/login"
          render={() =>
            logic.loggedIn ? <Login /> : <Redirect to="/candidates" />
          }
        />
        <Route
          path="/candidates"
          render={() => <Candidates/>}
        />
        <Route
          path="/messages/:id"
          render={props => (
            <Messages
              contactId={props.match.params.id}
              contactName={this.state.contactName}
            />
          )}
        />
        <Route
          path="/contacts"
          render={() => <Contacts/>}
        />
        <Route path="/profile" render={() => <Profile />} />
        <Route
          path="/photos/:id/:name"
          render={props => (
            <Photos
              contactId={props.match.params.id}
              contactName={props.match.params.name}
            />
          )}
        />
        <Route path="/" render={() => <Footer />} />
      </>
    )
  }
}

export default withRouter(App)
