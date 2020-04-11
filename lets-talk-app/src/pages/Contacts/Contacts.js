import React, { Component } from 'react'
import Contact from './Contact/Contact'
import logic from '../../logic'
import Error from '../../components/Error'
import { withRouter } from 'react-router-dom'

class Contacts extends Component {
  state = { error: null, listContacts: [] }

  componentDidMount = () => {
    try {
      logic
        .listContacts()
        .then((listContacts) => this.setState({ listContacts }))
        .catch((err) => this.setState({ error: err.message }))
    } catch (err) {
      this.setState({ error: err.message })
    }
  }

  handleBlock = (user) => {
    return (async () => {
      try {
        await logic.blockUser(user)
      } catch (err) {
        this.setState({ error: err.message })
      }

      try {
        await logic
          .listContacts()
          .then((listContacts) => this.setState({ listContacts }))
          .catch((err) => this.setState({ error: err.message }))
      } catch (err) {
        this.setState({ error: err.message })
      }
    })()
  }

  handleGoContact = (contactId, contactName) => {
    this.setState({ contactId, contactName }, () =>
      this.props.history.push(`/messages/${contactId}`)
    )
  }

  render() {
    const error = this.state.error

    return (
      <main className="contacts">
        {error && <Error message={error} />}
        <section className="presentation__header">
          <h3 className="presentation__title">My contacts...</h3>
        </section>

        <section className="contacts__section">
          {this.state.listContacts.map((contact) => (
            <Contact
              key={contact.id}
              id={contact.id}
              name={contact.name}
              onGoContact={this.handleGoContact}
              onBlockContact={this.handleBlock}
            />
          ))}
          {this.state.listContacts.length === 0 && (
            <p className="contacts__message">
              `You don´t have any contact yet, what are you waiting for?`
            </p>
          )}
        </section>
      </main>
    )
  }
}

export default withRouter(Contacts)
