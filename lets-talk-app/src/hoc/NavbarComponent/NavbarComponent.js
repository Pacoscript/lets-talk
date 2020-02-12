import React from 'react'
import logic from '../../logic'
import LandingNavbar from './LandingNavbar'
import Navbar from './Navbar'
import { withRouter } from 'react-router-dom'

const NavbarComponent = props => {
  const navbar = logic.loggedIn ? <LandingNavbar /> : <Navbar/>
  return <>{navbar}</>
}

export default withRouter(NavbarComponent)
