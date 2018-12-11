const express = require('express')
const bodyParser = require('body-parser')
const cloudinary = require('cloudinary')
const logic = require('../logic')
const jwt = require('jsonwebtoken')
const bearerTokenParser = require('../utils/bearer-token-parser')
const jwtVerifier = require('./jwt-verifier')
const routeHandler = require('./route-handler')
const fs = require('fs')

const jsonBodyParser = bodyParser.json({ limit: '50mb' })

const router = express.Router()

const { env: { JWT_SECRET } } = process

cloudinary.config({
    cloud_name: 'skylab-paco',
    api_key: '398374729263247',
    api_secret: '8QwEJKmVzZU8T3ptAXWxycxGDm4'
})


//REGISTER USER
router.post('/users', jsonBodyParser, (req, res) => {
    routeHandler(() => {
        const { name, surname, username, password, sex, age, city, presentation, minAgePref, maxAgePref } = req.body

        return logic.registerUser(name, surname, username, password, sex, age, city, presentation, minAgePref, maxAgePref)
            .then(() => {
                res.status(201)

                res.json({
                    message: `${username} successfully registered`
                })
            })
    }, res)
})

//AUTHENTICATE
router.post('/auth', jsonBodyParser, (req, res) => {
    routeHandler(() => {
        const { username, password } = req.body

        return logic.authenticateUser(username, password)
            .then(id => {
                const token = jwt.sign({ sub: id }, JWT_SECRET)

                res.json({
                    data: {
                        id,
                        token
                    }
                })
            })
    }, res)
})

//RETRIEVE USER
router.get('/users/:id', [bearerTokenParser, jwtVerifier], (req, res) => {
    routeHandler(() => {
        const { params: { id }, sub } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.retrieveUser(id)
            .then(user =>
                res.json({
                    data: user
                })
            )
    }, res)
})

//RETRIEVE USER PHOTOS
router.get('/users/:id/photos', (req, res) => {
    routeHandler(() => {
        const { params: { id } } = req

        return logic.retrieveUserPhotos(id)
            .then(photos =>
                res.json({
                    data: photos
                }))

    }, res)
})

//UPDATE USER
router.patch('/users/:id', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {
    routeHandler(() => {
        const { params: { id }, sub, body: { name, surname, username, password, newPassword, newPassword2, sex, age, city, presentation, minAgePref, maxAgePref } } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.updateUser(id, name ? name : null, surname ? surname : null, username ? username : null, password, newPassword ? newPassword : null, newPassword2 ? newPassword2 : null,
            sex ? sex : null, age ? age : null, city ? city : null, presentation ? presentation : null, minAgePref ? minAgePref : null, maxAgePref ? maxAgePref : null)
            .then(() =>
                res.json({
                    message: 'user updated'
                })
            )
    }, res)
})

//ADD CONTACT
router.patch('/users/:id/contacts', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {
    routeHandler(() => {
        const { params: { id }, sub, body: { contactId } } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.addContact(id, contactId)
            .then(() =>
                res.json({
                    message: 'contact added'
                })
            )
    }, res)
})

//LIST CONTACTS
router.get('/users/:id/contacts', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {
    routeHandler(() => {
        const { params: { id }, sub } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.listContacts(id)
            .then(contacts =>
                res.json({
                    data: contacts
                })
            )
    }, res)
})


//ADD PHOTO CLOUDINARY
router.patch('/upload', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {

    routeHandler(() => {
        const { sub, body: { base64Image, photo } } = req

        return logic.insertPhoto(sub, base64Image, photo)
            .then(photo => res.status(200).json({ status: 'OK', photo }))
            .catch((err) => {
                const { message } = err
                res.status(err instanceof LogicError ? 400 : 500).json({ message })
            })
    }, res)
})

//ADD MESSAGE
router.post('/users/:id/message', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {
    routeHandler(() => {
        const { sub, params: { id }, body: { user, text } } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.addMessage(id, user, text)
            .then(() => res.json({
                message: 'message added'
            }))

    }, res)
})

//RETRIEVE MESSAGES
router.get('/users/:id/messages/:contactId', [bearerTokenParser, jwtVerifier], (req, res) => {
    routeHandler(() => {
        const { sub, params: { id, contactId } } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.retrieveMessages(id, contactId)
            .then(messages => res.json({
                data: messages
            }))
    }, res)
})

//CHECK NUMBER OF MESSAGES
router.get('/users/:id/messages/:contactId/check', [bearerTokenParser, jwtVerifier], (req, res) => {
    routeHandler(() => {
        const { sub, params: { id, contactId } } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.checkMessages(id, contactId)
            .then(messages => res.json({
                data: messages
            }))
    }, res)
})

// CHECK CONTACTS MESSAGES NO READED

router.get('/users/:id/newMessages', [bearerTokenParser, jwtVerifier], (req, res) => {
    routeHandler(() => {
        const { sub, params: { id } } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.checkNewMessages(id)
            .then(contacts => res.json({
                data: contacts
            }))
    }, res)
})

//RETRIEVE CANDIDATES
router.get('/users/:id/candidates', [bearerTokenParser, jwtVerifier], (req, res) => {
    routeHandler(() => {
        const { sub, params: { id } } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.listCandidates(id)
            .then(candidates => res.json({
                data: candidates
            }))
    }, res)
})

//BLOCK USER
router.patch('/users/:id/block', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {
    routeHandler(() => {
        const { sub, params: { id }, body: { user } } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.blockUser(id, user)
            .then(() => {
                res.status(201)

                res.json({
                    message: `${user} successfully blocked`
                })
            })
    })
})


module.exports = router