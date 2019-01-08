import React, { Component } from "react";
import logic from "../logic";
import Error from "./Error";

class Contact extends Component {
  state = {
    error: null,
    photoFlag: false,
    contactPhotos: [],
    newMessageFlag: false
  };

  componentDidMount() {
    try {
      logic
        .checkMessages(this.props.id)
        .then(messages => {
          if (messages.length > 3) this.setState({ photoFlag: true });
        })
        .catch(err => this.setState({ error: err.message }));
    } catch (err) {
      this.setState({ error: err.message });
    }

    try {
      logic.retrieveUserPhotos(this.props.id).then(photos => {
        this.setState({ contactPhotos: photos });
        if (this.state.contactPhotos && photos.photo1 === "#") {
          const contactPhotos = this.state.contactPhotos;
          contactPhotos.photo1 =
            "./images/blank-profile-picture-973461_640.png";
          this.setState({ contactPhotos });
        }
      });
    } catch (err) {
      this.setState({ error: err.message });
    }

    try {
      logic
        .checkNewMessages()
        .then(contacts => {
          contacts.forEach(contact => {
            if (contact === this.props.id)
              this.setState({ newMessageFlag: true });
          });
        })
        .catch(err => this.setState({ error: err.message }));
    } catch (err) {
      this.setState({ error: err.message });
    }
  }

  render() {
    const error = this.state.error;

    return (
      <div className="contact">
        <section
          onClick={() => this.props.onGoContact(this.props.id, this.props.name)}
        >
          {error && <Error message={error} />}
          <h2 className="contact__name">
            {this.props.name}{" "}
            {this.state.newMessageFlag && <i class="far fa-envelope" />}
          </h2>
          <div className="contact__img__container">
            {this.state.photoFlag && (
              <img
                alt=""
                className="contact__image"
                src={
                  this.state.contactPhotos && this.state.contactPhotos.photo1
                }
              />
            )}
            {!this.state.photoFlag && (
              <img
                alt=""
                className="contact__image"
                src="./images/blank-profile-picture-973461_640.png"
              />
            )}
          </div>
        </section>
        <section>
          <button
            className="contact__button"
            onClick={() => this.props.onBlockContact(this.props.id)}
          >
            Block User
          </button>
        </section>
      </div>
    );
  }
}

export default Contact;
