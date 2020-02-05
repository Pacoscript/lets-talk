import React, { Component } from 'react'
import LandingNavbar from './components/LandingNavbar'
import Footer from './components/Footer'
import Landing from './components/Landing'
import Register from './components/Register'
import Login from './components/Login'
import Candidates from './components/Candidates'
import Contacts from './components/Contacts'
import Messages from './components/Messages'
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

  handleRegister = (
    name,
    surname,
    username,
    password,
    sex,
    age,
    city,
    presentation,
    minAgePref,
    maxAgePref
  ) => {
    try {
      logic
        .registerUser(
          name,
          surname,
          username,
          password,
          sex,
          age,
          city,
          presentation,
          minAgePref,
          maxAgePref
        )
        .then(() => {
          this.setState({ error: null }, () =>
            this.props.history.push('/login')
          )
        })
        .catch(err => this.setState({ error: err.message }))
    } catch (err) {
      this.setState({ error: err.message })
    }
  }

  handleLogin = (username, password) => {
    try {
      logic
        .login(username, password)
        .then(() => {
          this.setState({ error: null }, () =>
            this.props.history.push('/candidates')
          )
        })
        .catch(err => this.setState({ error: err.message }))
    } catch (err) {
      this.setState({ error: err.message })
    }
  }

  handleLogout = () => {
    logic.logout()
    this.props.history.push('/')
  }

  handleProfile = () => {
    this.props.history.push('/profile')
  }

  handleCandidates = () => {
    this.props.history.push('/candidates')
  }

  handleContacts = () => {
    this.props.history.push('/contacts')
  }

  handleMessage = (idContact, nameContact) => {
    try {
      logic
        .addContact(idContact)
        .then(() => {
          this.setState({ error: null }, () =>
            this.props.history.push(`/messages/${idContact}`)
          )
        })
        .catch(err => this.setState({ error: err.message }))
    } catch (err) {
      this.setState({ error: err.message })
    }
    const contactName = nameContact
    this.setState({ contactName })
  }

  handleGoContact = (contactId, contactName) => {
    this.setState({ contactId, contactName }, () =>
      this.props.history.push(`/messages/${contactId}`)
    )
  }

  handleGoPhotos = (contactId, contactName) => {
    this.setState({ contactId, contactName })
    this.props.history.push(`/photos/${contactId}/${contactName}`)
  }

  render() {
    return (
      <>
        {logic.loggedIn && (
          <LandingNavbar
            onGoRegisterClick={this.handleGoRegister}
            // onGoLandingClick={this.handleGoLanding}
            onGoLoginClick={this.handleGoLogin}
          />
        )}
        {!logic.loggedIn && (
          <Navbar
            onLogoutClick={this.handleLogout}
            onGoProfileClick={this.handleProfile}
            onGoCandidatesClick={this.handleCandidates}
            onGoContactsClick={this.handleContacts}
          />
        )}
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
            logic.loggedIn ? (
              <Register
                onRegister={this.handleRegister}
                error={this.state.error}
              />
            ) : (
              <Redirect to="/candidates" />
            )
          }
        />
        <Route
          path="/login"
          render={() =>
            logic.loggedIn ? (
              <Login onLogin={this.handleLogin} error={this.state.error} />
            ) : (
              <Redirect to="/candidates" />
            )
          }
        />
        <Route
          path="/candidates"
          render={() => <Candidates onMessage={this.handleMessage} />}
        />
        <Route
          path="/messages/:id"
          render={props => (
            <Messages
              contactId={props.match.params.id}
              contactName={this.state.contactName}
              onGoPhotos={this.handleGoPhotos}
            />
          )}
        />
        <Route
          path="/contacts"
          render={() => <Contacts onGoContact={this.handleGoContact} />}
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
