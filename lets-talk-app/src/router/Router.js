import React from 'react'
import Landing from '../pages/Landing/Landing'
import Register from '../pages/Register/Register'
import Login from '../pages/Login/Login'
import Candidates from '../pages/Candidates/Candidates'
import Contacts from '../pages/Contacts/Contacts'
import Messages from '../pages/Messages/Messages'

import Profile from '../pages/Profile/Profile'
import Photos from '../pages/Photos/Photos'
import logic from '../logic'
import { Route, withRouter, Redirect } from 'react-router-dom'

const Router = (props) => {
  return (
    <>
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
      <Route path="/candidates" render={() => <Candidates />} />
      <Route
        path="/messages/:id"
        render={(props) => (
          <Messages
            contactId={props.match.params.id}
            contactName={this.state.contactName}
          />
        )}
      />
      <Route path="/contacts" render={() => <Contacts />} />
      <Route path="/profile" render={() => <Profile />} />
      <Route
        path="/photos/:id/:name"
        render={(props) => (
          <Photos
            contactId={props.match.params.id}
            contactName={props.match.params.name}
          />
        )}
      />
    </>
  )
}

export default withRouter(Router)
