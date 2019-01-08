import React, { Component } from 'react'
import logic from '../logic'
import Error from './Error'

class Photos extends Component {

    state = { error: null, contactId: this.props.contactId, contactPhotos: undefined, contactName: this.props.contactName, flag1: false, flag2: false, flag3: false }

    componentDidMount() {
        try {
            logic.retrieveMessages(this.state.contactId)
                .then(messages => {
                    if (messages.length > 3) this.setState({ flag1: true })
                    if (messages.length > 7) this.setState({ flag2: true })
                    if (messages.length > 11) this.setState({ flag3: true })
                })
                .catch(err => this.setState({ error: err.message }))
        }
        catch (err) {
            this.setState({ error: err.message })
        }

        try {
            logic.retrieveUserPhotos(this.state.contactId)
                .then(photos => {
                    if (photos.photo1 === '#') photos.photo1 = "./images/blank-profile-picture-973461_640.png"
                    if (photos.photo2 === '#') photos.photo2 = "./images/blank-profile-picture-973461_640.png"
                    if (photos.photo3 === '#') photos.photo3 = "./images/blank-profile-picture-973461_640.png"
                    this.setState({ contactPhotos: photos })
                })
        }
        catch (err) {
            this.setState({ error: err.message })
        }

    }

    render() {
        const error = this.state.error
        return <section className='photos'>
            {error && <Error message={error} />}
            
            <h2 className='photos__name'>
                Photo 1 of {this.state.contactName}
            </h2>
            <div className='photos__img__container'>
                {this.state.flag1 && <img alt='' className='photos__image' src={this.state.contactPhotos.photo1}></img>}
                {!this.state.flag1 && <img alt=''  className='photos__image' src="./images/blank-profile-picture-973461_640.png"></img>}
            </div>
            <p className='img_footer'>You need four messages to see the photo1</p>

            <h2 className='photos__name'>
                Photo 2 of {this.state.contactName}
            </h2>
            <div className='photos__img__container'>
                {this.state.flag2 && <img alt=''  className='photos__image' src={this.state.contactPhotos.photo2}></img>}
                {!this.state.flag2 && <img alt=''  className='photos__image' src="./images/blank-profile-picture-973461_640.png"></img>}
            </div>
            <p className='img_footer'>You need eight messages to see the photo2</p>

            <h2 className='photos__name'>
                Photo 3 of {this.state.contactName}
            </h2>
            <div className='photos__img__container'>
                {this.state.flag3 && <img alt='' className='photos__image' src={this.state.contactPhotos.photo3}></img>}
                {!this.state.flag3 && <img alt=''  className='photos__image' src="./images/blank-profile-picture-973461_640.png"></img>}
            </div>
            <p className='img_footer'>You need twelve messages to see the photo3</p>
        </section>
    }

}

export default Photos

