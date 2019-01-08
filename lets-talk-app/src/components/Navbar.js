import React, { Component } from 'react'
import logic from '../logic'
import Error from './Error'

class Navbar extends Component {

    state = { error: null, name: 'name' }

    componentDidMount() {
        logic.retrieveUser(logic._userId)
            .then(user => {

                const name = user.name

                this.setState({ name })

            })
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
                        <button className='drop__button' onClick={() => this.props.onGoContactsClick()} >Contacts</button><br />
                        <button className='drop__button' onClick={() => this.props.onGoCandidatesClick()}>Candidates</button><br />
                        <button className='drop__button' onClick={() => this.props.onGoProfileClick()}>Profile</button><br />
                        <button className='drop__button' onClick={() => this.props.onLogoutClick()}>Logout</button>

                    </div>

                </div>
            </div>
            <div className= 'header__menu_2'>
                <button className='menu__button' onClick={() => this.props.onGoContactsClick()} >Contacts</button><br />
                <button className='menu__button' onClick={() => this.props.onGoCandidatesClick()}>Candidates</button><br />
                <button className='menu__button' onClick={() => this.props.onGoProfileClick()}>Profile</button><br />
                <button className='menu__button' onClick={() => this.props.onLogoutClick()}>Logout</button>
            </div>
            <div>{this.state.error && <Error message={this.state.error} />}</div>
        </header>
    }
}

export default Navbar