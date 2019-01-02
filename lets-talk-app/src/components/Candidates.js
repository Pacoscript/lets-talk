import React, { Component } from 'react'
import logic from '../logic'
import Error from './Error'

class Candidates extends Component {

    state = { error: null, listCandidates: false, ind: 0, newMessageFlag: false }

    componentDidMount = () => {

        const id = logic._userId

        try {
            logic.retrieveCandidates(id)
                .then(listCandidates => this.setState({ listCandidates }))
                .catch(err => this.setState({ error: err.message }))
        }
        catch (err) {
            this.setState({ error: err.message })
        }

        try {
            logic.checkNewMessages()
                .then(contacts => {

                    if (contacts.length > 0) this.setState({ newMessageFlag: true })

                })
                .catch(err => this.setState({ error: err.message }))
        }
        catch (err) {
            this.setState({ error: err.message })
        }

    }

    handleNext = () => {

        let ind = this.state.ind

        let length = this.state.listCandidates.length
        if (ind < length - 1) ind++
        else ind = 0

        this.setState({ ind })

    }

    handlePrev = () => {

        let ind = this.state.ind

        let length = this.state.listCandidates.length
        if (ind === 0) ind = length - 1
        else ind--

        this.setState({ ind })

    }

    handleNewMessage = () => {
        const ind = this.state.ind

        const idContact = this.state.listCandidates[ind].id

        const nameContact = this.state.listCandidates[ind].name

        this.props.onMessage(idContact, nameContact)
    }

    render() {

        const error = this.state.error

        return <main className='candidates'>

            <section className='presentation__header'>
                <h3 className='presentation__title'>Search for interesting people!</h3>
            </section>

            {error && <Error message={error} />}

            <section className='presentation'>
                <h2 className='presentation__name' >
                    {this.state.listCandidates && this.state.listCandidates[this.state.ind].name}

                </h2>
                <p className='presentation__text'>
                    {this.state.listCandidates && this.state.listCandidates[this.state.ind].presentation}
                    {!this.state.listCandidates && `Sorry, you don´t have more candidates in your area`}
                </p>
            </section>

            <section className='presentation__buttons'>
                <button className='candidates__button' onClick={this.handlePrev}><i class="fas fa-angle-left"></i></button>
                <button className='candidates__button' onClick={this.handleNewMessage}>New message</button>
                <button className='candidates__button' onClick={this.handleNext}><i class="fas fa-angle-right"></i></button>
            </section>

            <div className='presentation__alert'>{this.state.newMessageFlag && <p>You have new messages!! <i className="far fa-envelope"></i></p>}</div>


        </main>
    }
}

export default Candidates