const validate = require('../utils/validate')

const logic = {
  _userId: sessionStorage.getItem('userId') || null, // eslint disable line
  _token: sessionStorage.getItem('token') || null,

  // url: 'NO-URL',

  url: 'NO-URL',

  /**
     * registerUser: save a new user in the data base
     *
     * @param {string} name the name of the user
     * @param {string} surname the surname of the user
     * @param {string} username the username
     * @param {string} password the password for the user
     * @param {string} sex the sex of the user
     * @param {number} age age of the user
     * @param {string} city city of the user
     * @param {string} presentation presentation to be showed to the other users
     * @param {number} minAgePref looking for this minim age
     * @param {number} maxAgePref looking for this max age
     *
     * @return {string} user succesfully registered
     *
     */

  registerUser (name, surname, username, password, sex, age, city, presentation, minAgePref, maxAgePref) {
    validate([{ key: 'name', value: name, type: String },
      { key: 'surname', value: surname, type: String },
      { key: 'username', value: username, type: String },
      { key: 'password', value: password, type: String },
      { key: 'sex', value: sex, type: String },
      { key: 'age', value: age, type: Number },
      { key: 'city', value: city, type: String },
      { key: 'presentation', value: presentation, type: String },
      { key: 'minAgePref', value: minAgePref, type: Number },
      { key: 'maxAgePref', value: maxAgePref, type: Number }])

    if ((age < 18) || (minAgePref < 18)) throw Error('not for children under 18')
    if ((minAgePref > maxAgePref)) throw Error('minAgePref must be inferior to maxAgePref')

    return fetch(`${this.url}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({ name, surname, username, password, sex, age, city, presentation, minAgePref, maxAgePref })
    })
      .then(res => res.json())
      .then(res => {
        if (res.error) throw Error(res.error)
      })
  },

  /**
     * updateUser: this function is used by the user to change the parameters of his profile, photos not included
     *
     * @param {string} id
     * @param {string} name
     * @param {string} surname
     * @param {string} username
     * @param {string} password
     * @param {string} newPassword
     * @param {string} newPassword2
     * @param {string} sex
     * @param {number} age
     * @param {string} city
     * @param {string} presentation
     * @param {number} minAgePref
     * @param {number} maxAgePref
     *
     * @returns message: user updated
     *
     */

  updateUser (name, surname, username, password, newPassword, newPassword2, sex, age, city, presentation, minAgePref, maxAgePref) {
    validate([{ key: 'name', value: name, type: String, optional: true },
      { key: 'surname', value: surname, type: String, optional: true },
      { key: 'username', value: username, type: String, optional: true },
      { key: 'password', value: password, type: String },
      { key: 'newPassword', value: newPassword, type: String, optional: true },
      { key: 'newPassword2', value: newPassword2, type: String, optional: true },
      { key: 'sex', value: sex, type: String, optional: true },
      { key: 'age', value: age, type: Number, optional: true },
      { key: 'city', value: city, type: String, optional: true },
      { key: 'presentation', value: presentation, type: String, optional: true },
      { key: 'minAgePref', value: minAgePref, type: Number, optional: true },
      { key: 'maxAgePref', value: maxAgePref, type: Number, optional: true }])

    if ((age < 18) || (minAgePref < 18)) throw Error('not for children under 18')
    if ((minAgePref > maxAgePref)) throw Error('minAgePref must be inferior to maxAgePref')

    return fetch(`${this.url}/users/${this._userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: `Bearer ${this._token}`
      },
      body: JSON.stringify({ name, surname, username, password, newPassword, newPassword2, sex, age, city, presentation, minAgePref, maxAgePref })
    })
      .then(res => res.json())
      .then(res => {
        if (res.error) throw Error(res.error)
      })
  },

  /**
     * login: it checks username and password and if it is ok return id, and token of the user.
     *
     * @param {string} username
     * @param {string} password
     *
     * @returns anything, it saves the id and the token in session Storage
     *
     */
  login (username, password) {
    validate([
      { key: 'username', value: username, type: String },
      { key: 'password', value: password, type: String }])

    return fetch(`${this.url}/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({ username, password })
    })
      .then(res => res.json())
      .then(res => {
        if (res.error) throw Error(res.error)

        const { id, token } = res.data

        this._userId = id
        this._token = token

        sessionStorage.setItem('userId', id)
        sessionStorage.setItem('token', token)
      })
  },

  /**
     * retrieveCandidates: it returns a list of persons who are of the sex, city and range of age choosen by
     * the user, to show him their names and presentations
     *
     * @param {string} id of the user logged
     *
     * @returns {array} of candidates whit their id, name and presentation
     *
     */
  retrieveCandidates (id) {
    validate([
      { key: 'id', value: id, type: String }])

    return fetch(`${this.url}/users/${id}/candidates`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: `Bearer ${this._token}`
      }
    })
      .then(res => res.json())
      .then(res => {
        if (res.error) throw Error(res.error)

        return res.data
      })
  },

  /**
     * retrieveUser: it get the user information
     *
     * @param {string} id
     *
     * @returns: returns all the user parameters (no mongo stuff)
     *
     */
  retrieveUser (id) {
    validate([{ key: 'id', value: id, type: String }])

    return fetch(`${this.url}/users/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this._token}`
      }
    })
      .then(res => res.json())
      .then(res => {
        if (res.error) throw Error(res.error)

        return res.data
      })
  },

  /**
        * retrieveUserPhotos: it returns all the photos uploaded by the user in his profile
        *
        * @param {string} id
        *
        * @returns {array} array with photos of the user
        *
        */

  retrieveUserPhotos (id) {
    validate([{ key: 'id', value: id, type: String }])

    return fetch(`${this.url}/users/${id}/photos`, {
      method: 'GET'
    })
      .then(res => res.json())
      .then(res => {
        if (res.error) throw Error(res.error)

        return res.data
      })
  },

  /**
     * addContact: add another person to the list of contacts of the user,
     * it saves there the id of the user added
     *
     * @param {string} id id of the user logged
     * @param {string} contactId id of the contact to add to the list
     *
     * @returns {string} message: 'contact added'
     */

  addContact (contactId) {
    validate([{ key: 'contactId', value: contactId, type: String }])

    return fetch(`${this.url}/users/${this._userId}/contacts`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${this._token}`,
        'Content-Type': 'application/json; charset=utf-8'

      },
      body: JSON.stringify({ contactId })
    })
      .then(res => res.json())
      .then(res => {
        if (res.error) throw Error(res.error)
      })
  },

  /**
     * blockUser: it add the contact id to the list of blocked users of the user logged, and to the list
     * of blockedBy of the contact
     *
     * @param {string} user id of the user to block
     *
     * @returns {string} message: `user successfully blocked`
     */

  blockUser (user) {
    validate([{ key: 'user', value: user, type: String }])

    return fetch(`${this.url}/users/${this._userId}/block`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${this._token}`,
        'Content-Type': 'application/json; charset=utf-8'

      },
      body: JSON.stringify({ user })
    })
      .then(res => res.json())
      .then(res => {
        if (res.error) throw Error(res.error)
      })
  },

  /**
     * listContacts: this function is used to retrieve all the contacts of a user, all their id´s
     *
     * @param {string} userId the id of the user logged
     *
     * @returns {array} array of objects with id, name, presentation, photo1 of the contacts
     *
     */

  listContacts () {
    return fetch(`${this.url}/users/${this._userId}/contacts`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: `Bearer ${this._token}`

      }
    })
      .then(res => res.json())
      .then(res => {
        if (res.error) throw Error(res.error)

        return res.data
      })
  },

  /**
     * addMessage: creates a new Message with the author, the destinatary and the text of the message,
     * with the date of creation too, and saves it in the data base
     *
     * @param {string} user id of the user logged
     * @param {string} sentTo id of the contact to send a message
     * @param {string} text text of the message
     *
     * @returns {string} message: 'message added'
     */

  addMessage (user, text) {
    validate([
      { key: 'user', value: user, type: String },
      { key: 'text', value: text, type: String }])

    return fetch(`${this.url}/users/${this._userId}/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: `Bearer ${this._token}`
      },
      body: JSON.stringify({ user, text })
    })
      .then(res => res.json())
      .then(res => {
        if (res.error) throw Error(res.error)
      })
  },

  /**
     * retrieveMessages: it search a conversation between two users, all the messages, and order them
     * by date. If the the last message is pending and the user is who is sended than message, pass it
     * to readed
     *
     * @param {string} user1 id jof the user logged
     * @param {string} user id of the contact
     *
     * @returns {array} array of objects with id, nameSentTo, nameUser, text, user
     */

  retrieveMessages (contactId) {
    validate([
      { key: 'contactId', value: contactId, type: String }])

    return fetch(`${this.url}/users/${this._userId}/messages/${contactId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this._token}`,
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
      .then(res => res.json())
      .then(res => {
        if (res.error) throw Error(res.error)

        return res.data
      })
  },

  /**
     * checkMessages: it is used when we need the list of messages but we don´t want to change anything of them
     *
     * @param {string} user1 id of the user logged
     * @param {string} user id of the contact
     *
     * @returns {array} array of objects with id, nameSentTo, nameUser, text, user
     */

  checkMessages (contactId) {
    validate([
      { key: 'contactId', value: contactId, type: String }])

    return fetch(`${this.url}/users/${this._userId}/messages/${contactId}/check`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this._token}`,
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
      .then(res => res.json())
      .then(res => {
        if (res.error) throw Error(res.error)

        return res.data
      })
  },

  /**
     * checkNewMessages: it check if a user have new messages and from who
     *
     * @param {string} user the id of the user
     *
     * @returns {array} an array of id of the contacts with messages for the user. Messages with the status
     * pending only.
     *
     */

  checkNewMessages () {
    return fetch(`${this.url}/users/${this._userId}/newMessages`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this._token}`,
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
      .then(res => res.json())
      .then(res => {
        if (res.error) throw Error(res.error)

        return res.data
      })
  },

  /**
     * uploadUserPhoto: it saves a photo in cloudinary and at the same time saves the url in the profile
     * of the user
     *
     * @param {string} base64Image
     * @param {string} photo it indicates the number of the profile photo to save
     *
     * @returns {string} message ok
     */

  uploadUserPhoto (base64Image, photo) {
    validate([
      { key: 'base64Image', value: base64Image, type: String },
      { key: 'photo', value: photo, type: String }])

    return fetch(`${this.url}/upload`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${this._token}`,
        'Content-Type': 'application/json; charset=utf-8'

      },
      body: JSON.stringify({ base64Image, photo })
    })
      .then(res => res.json())
      .then(res => {
        if (res.error) throw Error(res.error)

        return res.photo
      })
  },

  get loggedIn () {
    return !this._userId
  },

  logout () {
    this._userId = null
    this._token = null

    sessionStorage.removeItem('userId')
    sessionStorage.removeItem('token')
  }

}

// export default logic
module.exports = logic
