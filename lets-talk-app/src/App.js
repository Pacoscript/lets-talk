import React, { Component } from 'react'
import Footer from './hoc/Footer/Footer'
import Router from './router/Router'

import NavbarComponent from './hoc/NavbarComponent/NavbarComponent'

import logic from './logic'
import { withRouter } from 'react-router-dom'

logic.url = process.env.REACT_APP_API_URL

class App extends Component {
  state = {
    error: null,
    contactId: false,
    contactName: false,
    contactPhotos: undefined
  }

  render () {
    return (
      <>
        <NavbarComponent/>
        <Router/>
        <Footer/>
      </>
    )
  }
}

export default withRouter(App)
