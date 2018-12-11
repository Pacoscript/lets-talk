import React, { Component } from 'react'
import Error from './Error'

class Register extends Component {
    state = { name: '', surname: '', username: '', password: '', sex: '', age: '', city: '', presentation: '', minAgePref: '', maxAgePref: '', error: undefined }

    handleNameChange = event => {
        const name = event.target.value

        this.setState({ name })
    }

    handleSurnameChange = event => {
        const surname = event.target.value

        this.setState({ surname })
    }

    handleUsernameChange = event => {
        const username = event.target.value

        this.setState({ username })
    }

    handlePasswordChange = event => {
        const password = event.target.value

        this.setState({ password })
    }

    handleSexChange = event => {
        const sex = event.target.value

        this.setState({ sex })
    }

    handleAgeChange = event => {
        let age = event.target.value

        age = Number(age)

        this.setState({ age })
    }

    handleCityChange = event => {
        const city = event.target.value

        this.setState({ city })
    }

    handlePresentationChange = event => {
        const presentation = event.target.value

        this.setState({ presentation })
    }

    handleMinAgeChange = event => {
        let minAgePref = event.target.value

        minAgePref = Number(minAgePref)

        this.setState({ minAgePref })
    }

    handleMaxAgeChange = event => {
        let maxAgePref = event.target.value

        maxAgePref = Number(maxAgePref)

        this.setState({ maxAgePref })
    }

    handleSubmit = event => {
        event.preventDefault()

        const { name, surname, username, password, sex, age, city, presentation, minAgePref, maxAgePref } = this.state

        this.props.onRegister(name, surname, username, password, sex, age, city, presentation, minAgePref, maxAgePref)

    }



    render() {

        const error = this.props.error

        return <main className='register'>

            <section>
                <h1 className='subtitle'>Register</h1>
            </section>
            {error && <Error message={error} />}
            <section className='register__section'>
                <form className='login__form' onSubmit={this.handleSubmit}>
                    <label>Name</label>
                    <input className='register__input' maxLength='16' onChange={this.handleNameChange} />
                    <label>Surname </label>
                    <input className='register__input' maxLength='16' onChange={this.handleSurnameChange} />
                    <label>Username </label>
                    <input className='register__input' maxLength='16' onChange={this.handleUsernameChange} />
                    <label>Password  </label>
                    <input className='register__input' maxLength='16' onChange={this.handlePasswordChange} type='password' />
                    <label>Sex </label>
                    <select className='register__input' defaultValue="" onChange={this.handleSexChange}>
                        <option value="">CHOSE YOUR SEX</option>
                        <option value="MALE">MALE</option>
                        <option value="FEMALE">FEMALE</option>
                    </select>
                    <label>Age </label>
                    <input className='register__input' maxLength='16' onChange={this.handleAgeChange} />
                    {/* <label>City  </label>
                    <input className= 'register__input' maxLength='16' onChange={this.handleCityChange} /> */}
                    <label>City </label>
                    <select className='register__input' defaultValue="" onChange={this.handleCityChange}>
                        <option value="">CHOSE YOUR CITY</option>
                        <option value='A Coruña' >A Coruña</option>
                        <option value='Álava'>Álava</option>
                        <option value='Albacete' >Albacete</option>
                        <option value='Alicante'>Alicante</option>
                        <option value='Almería' >Almería</option>
                        <option value='Asturias' >Asturias</option>
                        <option value='Ávila' >Ávila</option>
                        <option value='Badajoz' >Badajoz</option>
                        <option value='Barcelona'>Barcelona</option>
                        <option value='Burgos' >Burgos</option>
                        <option value='Cáceres' >Cáceres</option>
                        <option value='Cádiz' >Cádiz</option>
                        <option value='Cantabria' >Cantabria</option>
                        <option value='Castellón' >Castellón</option>
                        <option value='Ceuta' >Ceuta</option>
                        <option value='Ciudad Real' >Ciudad Real</option>
                        <option value='Córdoba' >Córdoba</option>
                        <option value='Cuenca' >Cuenca</option>
                        <option value='Gerona' >Gerona</option>
                        <option value='Girona' >Girona</option>
                        <option value='Las Palmas' >Las Palmas</option>
                        <option value='Granada' >Granada</option>
                        <option value='Guadalajara' >Guadalajara</option>
                        <option value='Guipúzcoa' >Guipúzcoa</option>
                        <option value='Huelva' >Huelva</option>
                        <option value='Huesca' >Huesca</option>
                        <option value='Jaén' >Jaén</option>
                        <option value='La Rioja' >La Rioja</option>
                        <option value='León' >León</option>
                        <option value='Lleida' >Lleida</option>
                        <option value='Lugo' >Lugo</option>
                        <option value='Madrid' >Madrid</option>
                        <option value='Malaga' >Málaga</option>
                        <option value='Mallorca' >Mallorca</option>
                        <option value='Melilla' >Melilla</option>
                        <option value='Murcia' >Murcia</option>
                        <option value='Navarra' >Navarra</option>
                        <option value='Orense' >Orense</option>
                        <option value='Palencia' >Palencia</option>
                        <option value='Pontevedra'>Pontevedra</option>
                        <option value='Salamanca'>Salamanca</option>
                        <option value='Segovia' >Segovia</option>
                        <option value='Sevilla' >Sevilla</option>
                        <option value='Soria' >Soria</option>
                        <option value='Tarragona' >Tarragona</option>
                        <option value='Tenerife' >Tenerife</option>
                        <option value='Teruel' >Teruel</option>
                        <option value='Toledo' >Toledo</option>
                        <option value='Valencia' >Valencia</option>
                        <option value='Valladolid' >Valladolid</option>
                        <option value='Vizcaya' >Vizcaya</option>
                        <option value='Zamora' >Zamora</option>
                        <option value='Zaragoza'>Zaragoza</option>

                    </select>
                    <label>Presentation  </label>
                    <textarea className='regist__textarea' maxLength='280' onChange={this.handlePresentationChange}></textarea>
                    <label>Min Age </label>
                    <input className='register__input' maxLength='16' onChange={this.handleMinAgeChange} />
                    <label>Max Age </label>
                    <input className='register__input' maxLength='16' onChange={this.handleMaxAgeChange} />

                    <p><button type='submit' className='register__button'>Register</button></p>
                </form>
            </section>
        </main>
    }
}


export default Register