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

  handleInputChange = (event) => {
    const value = event.target.value
    const target = event.target.name
    const newUser = { ...this.state.newUser, [target]: value }
    this.setState({ newUser })
  }

  handleSubmit = (event) => {
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
        .catch((err) => {
          this.setState({ error: err.message })
        })
    } catch (err) {
      this.setState({ error: err.message })
    }
  }

  render() {
    const error = this.state.error
    const { formFields } = registerConfig

  const fields = formFields.map(field => {
    if (field.type === 'input') {
      return (
        <>
          <label>{field.label}</label>
          <input
            className="register__input"
            maxLength={field.maxLength}
            name={field.name}
            onChange={this.handleInputChange}
          />
        </>
      )
    } else if (field.type === 'select') {
      return (
        <>
          <label>{field.label} </label>
          <select
            className="register__input"
            name={field.name}
            onChange={this.handleInputChange}
          >
            {field.options.map((option, index) => {
              return (
                <option
                  value={option}
                  disabled={index === 0 ? "disabled" : null}
                  selected={index === 0 ? "selected" : null}
                >{option}</option>
              )
            })}
          </select>
        </>
      )
    } else if (field.type === 'textarea') {
      return (
        <>
          <label>{field.label}</label>
            <textarea
              className="regist__textarea"
              maxLength={field.maxlength}
              name={field.name}
              onChange={this.handleInputChange}
            ></textarea>
        </>
      )
    }
    })

    return (
      <main className="register">
        <section>
          <h1 className="subtitle">Register</h1>
        </section>
        {error && <Error message={error} />}
        <section className="register__section">
          <form className="login__form" onSubmit={this.handleSubmit}>
            {fields}
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
