import React, { Component } from 'react'
import Error from '../../components/Error'
import logic from '../../logic'
import { withRouter } from 'react-router-dom'

class Login extends Component {
  state = { username: '', password: '' }

  handleInputChange = event => {
    const value = event.target.value
    const target = event.target.name
    this.setState({ [target]: value })
  }

  handleSubmit = event => {
    event.preventDefault()
    const { username, password } = this.state
    this.handleLogin(username, password)
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

  render() {
    const error = this.state.error

    return (
      <main className="login">
        <section>
          <h1 className="subtitle">Login</h1>
        </section>
        {error && <Error message={error} />}
        <section className="login__section">
          <form className="login__form" onSubmit={this.handleSubmit}>
            <label>Username</label>
            <input
              className="login__input"
              maxLength="16"
              name="username"
              onChange={this.handleInputChange}
            />
            <label>Password</label>
            <input
              className="login__input"
              maxLength="16"
              name="password"
              onChange={this.handleInputChange}
              type="password"
            />
            <p>
              <button className="login__button" type="submit">
                Login
              </button>
            </p>
          </form>
        </section>
      </main>
    )
  }
}

export default withRouter(Login)
