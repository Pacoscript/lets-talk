import React, { Component } from 'react'
import logic from '../../logic'
import Error from '../../components/Error'
import { withRouter } from 'react-router-dom'

class Candidates extends Component {
  state = { error: null, listCandidates: false, ind: 0, newMessageFlag: false }

  componentDidMount = () => {
    try {
      logic
        .retrieveCandidates(logic._userId)
        .then((listCandidates) => this.setState({ listCandidates }))
        .catch((err) => this.setState({ error: err.message }))
    } catch (err) {
      this.setState({ error: err.message })
    }

    try {
      logic
        .checkNewMessages()
        .then((contacts) => {
          if (contacts.length > 0) this.setState({ newMessageFlag: true })
        })
        .catch((err) => this.setState({ error: err.message }))
    } catch (err) {
      this.setState({ error: err.message })
    }
  }

  handleNext = () => {
    const ind =
      this.state.ind < this.state.listCandidates.length - 1
        ? this.state.ind + 1
        : 0
    this.setState({ ind })
  }

  handlePrev = () => {
    const ind =
      this.state.ind === 0
        ? this.state.listCandidates.length - 1
        : this.state.ind - 1
    this.setState({ ind })
  }

  handleNewMessage = () => {
    this.onMessage(
      this.state.listCandidates[this.state.ind].id,
      this.state.listCandidates[this.state.ind].name
    )
  }

  onMessage = (idContact, contactName) => {
    try {
      logic
        .addContact(idContact)
        .then(() => {
          this.setState({ error: null }, () =>
            this.props.history.push(`/messages/${idContact}/${contactName}`)
          )
        })
        .catch((err) => this.setState({ error: err.message }))
    } catch (err) {
      this.setState({ error: err.message })
    }
    this.setState({ contactName })
  }

  render() {
    const error = this.state.error

    return (
      <main className="candidates">
        <section className="presentation__header">
          <h3 className="presentation__title">
            Search for interesting people!
          </h3>
        </section>

        {error && <Error message={error} />}

        <section className="presentation">
          <h2 className="presentation__name">
            {this.state.listCandidates &&
              this.state.listCandidates[this.state.ind].name}
          </h2>
          <p className="presentation__text">
            {this.state.listCandidates &&
              this.state.listCandidates[this.state.ind].presentation}
            {!this.state.listCandidates &&
              'Sorry, you don´t have more candidates in your area'}
          </p>
        </section>

        <section className="presentation__buttons">
          <button className="candidates__button" onClick={this.handlePrev}>
            <i className="fas fa-angle-left"></i>
          </button>
          <button
            className="candidates__button"
            onClick={this.handleNewMessage}
          >
            New message
          </button>
          <button className="candidates__button" onClick={this.handleNext}>
            <i className="fas fa-angle-right"></i>
          </button>
        </section>

        <div className="presentation__alert">
          {this.state.newMessageFlag && (
            <p>
              You have new messages!! <i className="far fa-envelope"></i>
            </p>
          )}
        </div>
      </main>
    )
  }
}

export default withRouter(Candidates)
