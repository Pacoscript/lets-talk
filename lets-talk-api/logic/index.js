const { mongoose, models: { User, Message } } = require('lets-talk-data')
const { AlreadyExistsError, AuthError, NotAllowedError, NotFoundError } = require('../errors')
const validate = require('../utils/validate')
const cloudinary = require('cloudinary')
// const fs = require('fs')
// const path = require('path')

const { env: { cloud_name, api_key, api_secret } } = process

cloudinary.config({
    cloud_name,
    api_key,
    api_secret
})

const logic = {


    /**
     * saveImage: upload a file in cloudinary
     *
     * @param {string} base64Image
     *
     * @returns {string} data.url: the url with te image uploaded
     *
     */
    _saveImage(base64Image) {
        return Promise.resolve().then(() => {
            if (typeof base64Image !== 'string') throw new LogicError('base64Image is not a string')

            return new Promise((resolve, reject) => {
                return cloudinary.v2.uploader.upload(base64Image, function (err, data) {
                    if (err) return reject(err)

                    cloudinary.url(data.url,
                        // Transformation
                        {
                            transformation: [
                                { width: 400, height: 400, gravity: "face", radius: "max", crop: "crop" }
                            ]
                        })

                    resolve(data.url)
                })
            })
        })
    },

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
     * @return no return
     *
     */
    registerUser(name, surname, username, password, sex, age, city, presentation, minAgePref, maxAgePref) {

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

        return (async () => {
            let user = await User.findOne({ username })

            if (user) throw new AlreadyExistsError(`username ${username} already registered`)

            let created = Date.now()

            user = new User({ name, surname, username, password, sex, age, city, presentation, minAgePref, maxAgePref, created })

            await user.save()
        })()
    },


    /**
     * authenticateUser: check username and password to authenticate the user
     *
     * @param {string} username
     * @param {string} password
     *
     * @returns the user id and token
     */
    authenticateUser(username, password) {
        validate([{ key: 'username', value: username, type: String }, { key: 'password', value: password, type: String }])

        return (async () => {
            const user = await User.findOne({ username })

            if (!user || user.password !== password) throw new AuthError('invalid username or password')

            return user.id
        })()
    },

    /**
     * retrieveUser: it get the user information
     *
     * @param {string} id
     *
     * @returns: returns all the user parameters (no mongo stuff)
     *
     */

    retrieveUser(id) {
        validate([{ key: 'id', value: id, type: String }])
        let user = undefined
        return (async () => {
            try {
                user = await User.findById(id, { '_id': 0, password: 0, __v: 0 }).lean()
            }
            catch (error) {
            }

            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            user.id = id

            return user
        })()
    },

     /**
         * retrieveUserPhotos: it returns all the photos uploaded by the user in his profile
         *
         * @param {string} id
         *
         * @returns {array} array with photos of the user
         *
         */

    retrieveUserPhotos(id) {
        validate([{ key: 'id', value: id, type: String }])

        return (async () => {
            const user = await User.findById(id, { '_id': 0, name: 0, surname: 0, username: 0, password: 0, created: 0, sex: 0, city: 0, maxAgePref: 0, age: 0, minAgePref: 0, presentation: 0, __v: 0, contacts: 0, }).lean()

            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            return user
        })()

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
     * @returns nothing, this function doesn't return anything
     *
     */

    updateUser(id, name, surname, username, password, newPassword, newPassword2, sex, age, city, presentation, minAgePref, maxAgePref) {

        validate([
            { key: 'id', value: id, type: String },
            { key: 'name', value: name, type: String, optional: true },
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
            { key: 'maxAgePref', value: maxAgePref, type: Number, optional: true },
        ])

        return (async () => {

            const user = await User.findById(id)

            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            if (user.password !== password) throw new AuthError('invalid password')

            if (newPassword !== newPassword2) throw new AuthError('the new password is incorrect')

            if (username && username !== user.username) {
                const _user = await User.findOne({ username })

                if (_user) throw new AlreadyExistsError(`username ${username} already exists`)

                name != null && (user.name = name)
                surname != null && (user.surname = surname)
                user.username = username
                newPassword != null && (user.password = newPassword)
                sex != null && (user.sex = sex)
                age != null && (user.age = age)
                city != null && (user.city = city)
                presentation != null && (user.presentation = presentation)
                minAgePref != null && (user.minAgePref = minAgePref)
                maxAgePref != null && (user.maxAgePref = maxAgePref)

                await user.save()
            } else {
                name != null && (user.name = name)
                surname != null && (user.surname = surname)
                newPassword != null && (user.password = newPassword)
                sex != null && (user.sex = sex)
                age != null && (user.age = age)
                city != null && (user.city = city)
                presentation != null && (user.presentation = presentation)
                minAgePref != null && (user.minAgePref = minAgePref)
                maxAgePref != null && (user.maxAgePref = maxAgePref)

                await user.save()
            }
        })()
    },

    /**
     * addContact: add another person to the list of contacts of the user,
     * it saves there the id of the user added
     *
     * @param {string} id id of the user logged
     * @param {string} idContact id of the contact to add to the list
     *
     * @returns anything
     */

    addContact(id, idContact) {
        validate([
            { key: 'id', value: id, type: String },
            { key: 'idContact', value: idContact, type: String }
        ])

        return (async () => {

            if (id === idContact) throw new NotAllowedError('user cannot add himself as a contact')

            const user = await User.findById(id)

            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            const newContact = await User.findById(idContact)

            if (!newContact) throw new NotFoundError(`user with id ${idContact} not found`)



            user.contacts.forEach(_contactId => {

                if (_contactId.toString() === newContact._id.toString()) throw new AlreadyExistsError(`user with id ${id} arleady has contact with id ${_contactId}`)
            })

            user.contacts.push(newContact._id)
            newContact.contacts.push(user._id)

            await user.save()
            await newContact.save()
        })()
    },

    /**
     * listContacts: this function is used to retrieve all the contacts of a user, all their id´s
     *
     * @param {string} userId the id of the user logged
     *
     * @returns {array} array of objects with id, name, presentation, photo1 of the contacts
     *
     */
    listContacts(userId) {
        validate([
            { key: 'userId', value: userId, type: String }
        ])

        return (async () => {
            let user = undefined

            try {
                user = await User.findById(userId)
            }
            catch (error) {

            }

            if (!user) throw new NotFoundError(`user with id ${userId} not found`)

            const contacts = await Promise.all(user.contacts.map(async contactId => await User.findById(contactId)))

            contacts.forEach((contact, index) => {
                user.blocks.forEach(id => {

                    if (id === contact.id) contacts.splice(index, 1)
                })
                contact.blockedBy.forEach(blockedBy => {

                    if (blockedBy === user.id) contacts.splice(index, 1)
                })
            })

            return contacts.map(({ id, name, presentation, photo1 }) => ({ id, name, presentation, photo1 }))
        })()

    },

    /**
     * addMessage: creates a new Message with the author, the destinatary and the text of the message,
     * with the date of creation too, and saves it in the data base
     *
     * @param {string} user id of the user logged
     * @param {string} sentTo id of the contact to send a message
     * @param {string} text text of the message
     *
     * @returns nothing
     */

    addMessage(user, sentTo, text) {
        validate([
            { key: 'user', value: user, type: String },
            { key: 'sentTo', value: sentTo, type: String },
            { key: 'text', value: text, type: String }
        ])
        return (async () => {
            let _user = undefined
            let user2 = undefined
            try {
                _user = await User.findById(user)

            } catch (error) {

            }

            if (!_user) throw new NotFoundError(`user with id ${user} not found`)

            try {
                user2 = await User.findById(sentTo)
            } catch (error) {

            }

            if (!user2) throw new NotFoundError(`user with id ${sentTo} not found`)

            if (!_user.contacts.includes(user2.id).toString()) throw new NotFoundError(`user with id ${sentTo} is not a contact of user with id ${user}`)

            let sentDate = Date.now()
            message = new Message({ text, user, nameUser: _user.name, sentTo, nameSentTo: user2.name, sentDate })

            await message.save()


        })()

    },

    /**
     * retrieveMessages: it search a conversation between two users, all the messages, and order them
     * by date. If the the last message is pending and the user is who is sended than message, pass it
     * to readed
     *
     * @param {string} user1 id jof the user logged
     * @param {string} user2 id of the contact
     *
     * @returns {array} array of objects with id, nameSentTo, nameUser, text, user
     */
    retrieveMessages(user1, user2) {

        validate([
            { key: 'user1', value: user1, type: String },
            { key: 'user2', value: user2, type: String }
        ])
        return (async () => {

            const _user1 = await User.findById(user1)

            if (!_user1) throw new NotFoundError(`user1 with id ${user1} not found`)

            const _user2 = await User.findById(user2)

            if (!_user2) throw new NotFoundError(`user with id ${user2} not found`)

            if (!_user1.contacts.includes(_user2.id).toString()) throw new NotFoundError(`user with id ${user2} is not a contact of user with id ${user1}`)

            var ObjectId = mongoose.Types.ObjectId
            let messages = await Message.find({
                $or: [{ user: new ObjectId(user1), sentTo: new ObjectId(user2) },
                { user: new ObjectId(user2), sentTo: new ObjectId(user1) }]
            })

            messages.sort(function (a, b) {
                return (a.sentDate - b.sentDate)
            })

            if (messages.length > 0)
                if (messages[messages.length - 1].status === 'PENDING' && messages[messages.length - 1].user.toString() === user2) {
                    let message = await Message.findById(messages[messages.length - 1].id.toString())
                    // if (messages.length > 1) {
                    //     let message2 = await Message.findById(messages[messages.length - 2].id.toString())
                    message.status = 'READED'
                    //     message2.status = 'RESPONDED'
                    await message.save()
                    //     await message2.save()
                    // }
                }

            if (messages.length > 0) return messages.map(({ id, nameSentTo, nameUser, text, user }) => ({ id, nameSentTo, nameUser, text, user }))
            else return ([])

        })()
    },

    /**
     * checkMessages: it is used when we need the list of messages but we don´t want to change anything of them
     *
     * @param {string} user1 id of the user logged
     * @param {string} user2 id of the contact
     *
     * @returns {array} array of objects with id, nameSentTo, nameUser, text, user
     */

    checkMessages(user1, user2) {

        validate([
            { key: 'user1', value: user1, type: String },
            { key: 'user2', value: user2, type: String }
        ])
        return (async () => {

            const _user1 = await User.findById(user1)

            if (!_user1) throw new NotFoundError(`user1 with id ${user1} not found`)

            const _user2 = await User.findById(user2)

            if (!_user2) throw new NotFoundError(`user with id ${user2} not found`)

            if (!_user1.contacts.includes(_user2.id).toString()) throw new NotFoundError(`user with id ${user2} is not a contact of user with id ${user1}`)

            var ObjectId = mongoose.Types.ObjectId
            let messages = await Message.find({
                $or: [{ user: new ObjectId(user1), sentTo: new ObjectId(user2) },
                { user: new ObjectId(user2), sentTo: new ObjectId(user1) }]
            })

            messages.sort(function (a, b) {
                return (a.sentDate - b.sentDate)
            })

            if (messages.length > 0) return messages.map(({ id, nameSentTo, nameUser, text, user }) => ({ id, nameSentTo, nameUser, text, user }))
            else return ([])

        })()
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
    checkNewMessages(user) {

        validate([{ key: 'user', value: user, type: String }])

        return (async () => {

            const _user = await User.findById(user)

            if (!_user) throw new NotFoundError(`user1 with id ${user} not found`)

            const messages = await Message.find({ sentTo: user, status: 'PENDING' }).lean()

            let contacts = []


            messages.forEach(message => {
                let flag = false

                id = message.user._id.toString()

                _user.blocks.forEach(userBlocked => {
                    if(id === userBlocked) flag = true
                })

                _user.blockedBy.forEach(userBlockedBy =>{
                    if(id === userBlockedBy) flag = true

                })

                if (flag != true) contacts.push(id)
            })

            return contacts

        })()

    },

    /**
     * listCandidates: it returns a list of persons who are of the sex, city and range of age choosen by
     * the user, to show him their names and presentations.
     *
     * @param {string} user id of the user logged
     *
     * @returns {array} of candidates whit their id, name and presentation
     */

    listCandidates(user) {

        validate([
            { key: 'user', value: user, type: String }
        ])

        const candidatesFiltered = []

        let flag = false


        return (async () => {

            const _user = await User.findById(user)

            if (!_user) throw new NotFoundError(`user with id ${user} not found`)

            let sexSearch = ''

            if (_user.sex === 'MALE') sexSearch = 'FEMALE'
            else sexSearch = 'MALE'

            let city = _user.city

            const contacts = _user.contacts

            let candidates = await User.find({ sex: sexSearch, age: { $gte: _user.minAgePref, $lte: _user.maxAgePref }, city: city}).lean()

            candidates.forEach(candidate => {
                contacts.forEach(contact => {

                    if (candidate._id.toString() === contact._id.toString()) {
                        flag = true
                    }

                })
                if (flag === true) flag = false
                else {
                    candidatesFiltered.push(candidate)
                    flag = false
                }

            })

            candidatesFiltered.forEach((candidate,index) => {
                if(candidate.minAgePref>_user.age) candidatesFiltered.splice(index,1)
                else if(candidate.maxAgePref<_user.age) candidatesFiltered.splice(index, 1)
            })

            candidatesFiltered.sort(function (a, b) {
                return (a.created - b.created)
            })

            candidatesFiltered.forEach(candidate => {
                candidate.id = candidate._id.toString()

                delete candidate.__v
                delete candidate._id
                delete candidate.contacts
                delete candidate.city
                delete candidate.created
                delete candidate.surname
                delete candidate.username
                delete candidate.password
                delete candidate.sex
                delete candidate.age
                delete candidate.maxAgePref
                delete candidate.minAgePref
                delete candidate.photo1
                delete candidate.photo2
                delete candidate.photo3

            })


            if (candidatesFiltered.length > 0) return candidatesFiltered
            else return false

        })()
    },

    /**
     * insertPhoto: it saves a photo in the profile of a user
     *
     * @param {string} id id of the user logged
     * @param {string} chunk base64Image
     * @param {string} photo string to identificate which of the tree photos of the profile we want to save
     */

    insertPhoto(id, chunk, photo) {

        validate([
            { key: 'id', value: id, type: String },
            { key: 'chunk', value: chunk, type: String },
            { key: 'photo', value: photo, type: String }
        ])

        return (async () => {

            const user = await User.findById(id)

            if (!user) throw new NotFoundError(`user with id ${id} not found`)

            const imageCloudinary = await this._saveImage(chunk)

            if (photo === 'photo1') user.photo1 = imageCloudinary
            else if (photo === 'photo2') user.photo2 = imageCloudinary
            else user.photo3 = imageCloudinary


            await user.save()

            return imageCloudinary

        })()

    },

    /**
     * blockUser: it add the contact id to the list of blocked users of the user logged, and to the list
     * of blockedBy of the contact
     *
     * @param {string} user1 id of the user logged
     * @param {string} user2 id of the user to block
     *
     * @returns anything
     */

    blockUser(user1, user2) {
        validate([
            { key: 'user1', value: user1, type: String },
            { key: 'user2', value: user2, type: String }
        ])

        return (async () => {

            if (user1 === user2) throw new NotAllowedError('user cannot add himself as a blocked')

            const user = await User.findById(user1)

            if (!user) throw new NotFoundError(`user with id ${user1} not found`)

            const contactBlocked = await User.findById(user2)

            if (!contactBlocked) throw new NotFoundError(`user with id ${user2} not found`)

            user.blocks.forEach(idBlocked => {
                if (idBlocked === user2) throw new AlreadyExistsError(`user with id ${user2} arleady blocked by ${user1}`)
            })

            user.blocks.push(user2)
            contactBlocked.blockedBy.push(user1)

            await user.save()
            await contactBlocked.save()

        })()
    }


}

module.exports = logic