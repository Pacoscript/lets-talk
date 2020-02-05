import React from 'react'
import { withRouter } from 'react-router-dom'

function LandingNavbar(props) {
  const handleGoLanding = () => {
    return props.history.push('/')
  }
  const handleGoRegister = () => {
    return props.history.push('/register')
  }

  const handleGoLogin = () => {
    return props.history.push('/login')
  }
  return (
    <header>
      <div className="header__logo">
        <i className="fas fa-hand-holding-heart"></i>
      </div>

      <div className="header__title">
        <h1>LET´S TALK</h1>
      </div>

      <div className="header__menu">
        <div className="dropdown">
          <button className="dropbtn">Menu</button>
          <div className="dropdown-content">
            <button className="drop__button" onClick={handleGoLanding}>
              Landing
            </button>
            <br />
            <button
              className="drop__button"
              onClick={handleGoRegister}
            >
              Register
            </button>
            <br />
            <button
              className="drop__button"
              onClick={handleGoLogin}
            >
              Login
            </button>
          </div>
        </div>
      </div>
      <div className="header__menu_2">
        <button className="menu__button" onClick={handleGoLanding}>
          Landing
        </button>
        <br />
        <button
          className="menu__button"
          onClick={handleGoRegister}
        >
          Register
        </button>
        <br />
        <button className="menu__button" onClick={handleGoLogin}>
          Login
        </button>
      </div>
    </header>
  )
}

export default withRouter(LandingNavbar)
