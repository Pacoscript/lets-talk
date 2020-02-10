import React, { Component } from 'react'
import Error from '../../components/Error'
import logic from '../../logic'
import { withRouter } from 'react-router-dom'
import registerConfig from './config'

class Register extends Component {
  state = {
    newUser: {
      name: undefined,
      surname: undefined,
      username: undefined,
      password: undefined,
      sex: undefined,
      age: undefined,
      city: undefined,
      presentation: undefined,
      minAgePref: undefined,
      maxAgePref: undefined,
    },
    error: undefined,
  }

  handleInputChange = event => {
    const value = event.target.value
    const target = event.target.name
    const newUser = { ...this.state.newUser, [target]: value }
    this.setState({ newUser })
  }

  handleSubmit = event => {
    event.preventDefault()
    this.handleRegister()
  }

  handleRegister = () => {
    const {
      name,
      surname,
      username,
      password,
      sex,
      age,
      city,
      presentation,
      minAgePref,
      maxAgePref,
    } = this.state.newUser
    try {
      logic
        .registerUser(
          name,
          surname,
          username,
          password,
          sex,
          Number(age),
          city,
          presentation,
          Number(minAgePref),
          Number(maxAgePref)
        )
        .then(() => {
          this.setState({ error: null }, () =>
            this.props.history.push('/login')
          )
        })
        .catch(err => {
            this.setState({ error: err.message })
        })
    } catch (err) {
      this.setState({ error: err.message })
    }
  }

  render() {
    const error = this.error
    const { cities } = registerConfig

    const cityOptions = cities.map(city =>{
      return(
        <option value={city}>{city}</option>
      )
    })

    return (
      <main className="register">
        <section>
          <h1 className="subtitle">Register</h1>
        </section>
        {error && <Error message={error} />}
        <section className="register__section">
          <form className="login__form" onSubmit={this.handleSubmit}>
            <label>Name</label>
            <input
              className="register__input"
              maxLength="16"
              name="name"
              onChange={this.handleInputChange}
            />
            <label>Surname </label>
            <input
              className="register__input"
              maxLength="16"
              name="surname"
              onChange={this.handleInputChange}
            />
            <label>Username </label>
            <input
              className="register__input"
              maxLength="16"
              name="username"
              onChange={this.handleInputChange}
            />
            <label>Password </label>
            <input
              className="register__input"
              maxLength="16"
              name="password"
              onChange={this.handleInputChange}
              type="password"
            />
            <label>Sex </label>
            <select
              className="register__input"
              defaultValue=""
              name="sex"
              onChange={this.handleInputChange}
            >
              <option value="">CHOSE YOUR SEX</option>
              <option value="MALE">MALE</option>
              <option value="FEMALE">FEMALE</option>
            </select>
            <label>Age </label>
            <input
              className="register__input"
              maxLength="16"
              name="age"
              onChange={this.handleInputChange}
            />
            <label>Chose City </label>
            <select
              className="register__input"
              name="city"
              onChange={this.handleInputChange}
            >
              {cityOptions}
            </select>
            <label>Presentation </label>
            <textarea
              className="regist__textarea"
              maxLength="280"
              name="presentation"
              onChange={this.handleInputChange}
            ></textarea>
            <label>Min Age </label>
            <input
              className="register__input"
              maxLength="16"
              name="minAgePref"
              onChange={this.handleInputChange}
            />
            <label>Max Age </label>
            <input
              className="register__input"
              maxLength="16"
              name="maxAgePref"
              onChange={this.handleInputChange}
            />

            <p>
              <button type="submit" className="register__button">
                Register
              </button>
            </p>
          </form>
        </section>
      </main>
    )
  }
}

export default withRouter(Register)
