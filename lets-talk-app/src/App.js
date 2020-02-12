import React, { Component } from 'react'
import Footer from './hoc/Footer/Footer'
import Landing from './pages/Landing/Landing'
import NavbarComponent from './hoc/NavbarComponent/NavbarComponent'
import Register from './pages/Register/Register'
import Login from './pages/Login/Login'
import Candidates from './pages/Candidates/Candidates'
import Contacts from './pages/Contacts/Contacts'
import Messages from './pages/Messages/Messages'
// import Navbar from './components/Navbar'
import Profile from './pages/Profile/Profile'
import Photos from './pages/Photos/Photos'
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
        <NavbarComponent/>
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
        <Footer/>
      </>
    )
  }
}

export default withRouter(App)
