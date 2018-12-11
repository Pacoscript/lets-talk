import React, { Component } from 'react'
import Contact from './Contact'
import logic from '../logic'
import Error from './Error'

class Contacts extends Component {

  state = { error: null, listContacts: [] }

  componentDidMount = () => {

    try {
      logic.listContacts()
        .then(listContacts => this.setState({ listContacts }))
        .catch(err => this.setState({ error: err.message }))
    }
    catch (err) {
      this.setState({ error: err.message })
    }
  }

  handleBlock = (user2) => {
    return (async () => {
      try {

        await logic.blockUser(user2)

      }
      catch (err) {

        this.setState({ error: err.message })
      }


      try {
        await logic.listContacts()
          .then(listContacts => this.setState({ listContacts }))
          .catch(err => this.setState({ error: err.message }))
      }
      catch (err) {
        this.setState({ error: err.message })
      }
    })()

  }

  render() {

    const error = this.state.error

    return <main className='contacts'>
      {error && <Error message={error} />}
      <section className='presentation__header'>
        <h3 className='presentation__title'>My contacts...</h3>
      </section>


      <section className='contacts__section'>
        {this.state.listContacts.map(contact => <Contact key={contact.id} id={contact.id} name={contact.name} onGoContact={this.props.onGoContact} onBlockContact={this.handleBlock} />)}
        {(this.state.listContacts.length === 0) && <p className = 'contacts__message'>`You don´t have any contact yet, what are you waiting for?`</p>}
      </section>

    </main>
  }
}

export default Contacts