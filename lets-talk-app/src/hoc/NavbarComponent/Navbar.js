import React, { Component } from 'react'
import logic from '../../logic'
import Error from '../../components/Error'
import { withRouter } from 'react-router-dom'

class Navbar extends Component {

    state = { error: null, name: 'name' }

    componentDidMount() {
        logic.retrieveUser(logic._userId)
            .then(user => {

                const name = user.name

                this.setState({ name })

            })
    }

    handleLogout = () => {
        logic.logout()
        this.props.history.push('/')
    }
    handleProfile = () => {
    this.props.history.push('/profile')
    }

    handleCandidates = () => {
    this.props.history.push('/candidates')
    }

    handleContacts = () => {
    this.props.history.push('/contacts')
    }

    render() {
        return <header>
            <div className='header__logo'>
                <i className='fas fa-hand-holding-heart'></i>
            </div>

            <div className='header__title'>
                <h1>LETS TALK!!</h1>
            </div>

            <div className='header__menu'>
                <label className='header__label'>Hi {this.state.name}</label>
                <div className='dropdown'>
                    <button className='dropbtn'>Menu</button>
                    <div className='dropdown-content'>
                        <button className='drop__button' onClick={() => this.handleContacts()} >Contacts</button><br />
                        <button className='drop__button' onClick={() => this.handleCandidates()}>Candidates</button><br />
                        <button className='drop__button' onClick={() => this.handleProfile()}>Profile</button><br />
                        <button className='drop__button' onClick={() => this.handleLogout()}>Logout</button>

                    </div>

                </div>
            </div>
            <div className= 'header__menu_2'>
                <button className='menu__button' onClick={() => this.handleContacts()} >Contacts</button><br />
                <button className='menu__button' onClick={() => this.handleCandidates()}>Candidates</button><br />
                <button className='menu__button' onClick={() => this.handleProfile()}>Profile</button><br />
                <button className='menu__button' onClick={() => this.handleLogout()}>Logout</button>
            </div>
            <div>{this.state.error && <Error message={this.state.error} />}</div>
        </header>
    }
}

export default withRouter(Navbar)