require('dotenv').config()

const { mongoose, models: { User, Message } } = require('lets-talk-data')
const logic = require('.')
const { AlreadyExistsError, ValueError, NotAllowedError, AuthError, NotFoundError } = require('../errors')
const base64Image = require('./base64-image')

const { expect } = require('chai')

const { env: { TEST_MONGO_URL}} = process

// running test from CLI
// normal -> $ mocha logic/index.spec.js --timeout 10000
// debug -> $ mocha debug logic/index.spec.js --timeout 10000

describe('logic', () => {
    before(() => mongoose.connect(TEST_MONGO_URL, { useNewUrlParser: true, useCreateIndex: true }))

    beforeEach(() => Promise.all([User.deleteMany(), Message.deleteMany()]))

    describe('user', () => {
        describe('register', () => {
            let name, surname, username, password, sex, age, city, presentation, minAgePref, maxAgePref

            beforeEach(() => {
                name = `name-${Math.random()}`
                surname = `surname-${Math.random()}`
                username = `username-${Math.random()}`
                password = `password-${Math.random()}`
                sex = 'MALE'
                age = 20
                city = 'Barcelona'
                presentation = 'Im a good guy'
                minAgePref = 20
                maxAgePref = 25
            })

            it('should succeed on correct data', async () => {
                const res = await logic.registerUser(name, surname, username, password, sex, age, city, presentation, minAgePref, maxAgePref
                )

                expect(res).to.be.undefined

                const users = await User.find()

                expect(users.length).to.equal(1)

                const [user] = users

                expect(user.id).to.be.a('string')
                expect(user.name).to.equal(name)
                expect(user.surname).to.equal(surname)
                expect(user.username).to.equal(username)
                expect(user.password).to.equal(password)
                expect(user.sex).to.equal(sex)
                expect(user.age).to.equal(age)
                expect(user.city).to.equal(city)
                expect(user.presentation).to.equal(presentation)
                expect(user.minAgePref).to.equal(minAgePref)
                expect(user.maxAgePref).to.equal(maxAgePref)
            })

            it('should fail on undefined name', () => {
                expect(() => logic.registerUser(undefined, surname, username, password, sex, age, city, presentation, minAgePref, maxAgePref)).to.throw(TypeError, 'undefined is not a string')
            })

            it('should fail on empty name', () => {
                expect(() => logic.registerUser('', surname, username, password, sex, age, city, presentation, minAgePref, maxAgePref)).to.throw(ValueError, 'name is empty or blank')
            })

            it('should fail on blank name', () => {
                expect(() => logic.registerUser('   \t\n', surname, username, password, sex, age, city, presentation, minAgePref, maxAgePref)).to.throw(ValueError, 'name is empty or blank')
            })

            it('should fail on non string name', () => {
                expect(() => logic.registerUser(10, surname, username, password, sex, age, city, presentation, minAgePref, maxAgePref)).to.throw(TypeError, '10 is not a string')
            })

            it('should fail on undefined surname', () => {
                expect(() => logic.registerUser(name, undefined, username, password, sex, age, city, presentation, minAgePref, maxAgePref)).to.throw(TypeError, 'undefined is not a string')
            })

            it('should fail on empty surname', () => {
                expect(() => logic.registerUser(name, '', username, password, sex, age, city, presentation, minAgePref, maxAgePref)).to.throw(ValueError, 'surname is empty or blank')
            })

            it('should fail on blank surname', () => {
                expect(() => logic.registerUser(name, '   \t\n', username, password, sex, age, city, presentation, minAgePref, maxAgePref)).to.throw(ValueError, 'surname is empty or blank')
            })

            it('should fail on non string surname', () => {
                expect(() => logic.registerUser(name, 10, username, password, sex, age, city, presentation, minAgePref, maxAgePref)).to.throw(TypeError, '10 is not a string')
            })

            it('should fail on undefined username', () => {
                expect(() => logic.registerUser(name, surname, undefined, password, sex, age, city, presentation, minAgePref, maxAgePref)).to.throw(TypeError, 'undefined is not a string')
            })

            it('should fail on empty username', () => {
                expect(() => logic.registerUser(name, surname, '', password, sex, age, city, presentation, minAgePref, maxAgePref)).to.throw(ValueError, 'username is empty or blank')
            })

            it('should fail on blank username', () => {
                expect(() => logic.registerUser(name, surname, '   \t\n', password, sex, age, city, presentation, minAgePref, maxAgePref)).to.throw(ValueError, 'username is empty or blank')
            })

            it('should fail on non string username', () => {
                expect(() => logic.registerUser(name, surname, 10, password, sex, age, city, presentation, minAgePref, maxAgePref)).to.throw(TypeError, '10 is not a string')
            })

            it('should fail on undefined password', () => {
                expect(() => logic.registerUser(name, surname, username, undefined, sex, age, city, presentation, minAgePref, maxAgePref)).to.throw(TypeError, 'undefined is not a string')
            })

            it('should fail on empty password', () => {
                expect(() => logic.registerUser(name, surname, username, '', sex, age, city, presentation, minAgePref, maxAgePref)).to.throw(ValueError, 'password is empty or blank')
            })

            it('should fail on blank password', () => {
                expect(() => logic.registerUser(name, surname, username, '   \t\n', sex, age, city, presentation, minAgePref, maxAgePref)).to.throw(ValueError, 'password is empty or blank')
            })

            it('should fail on non string password', () => {
                expect(() => logic.registerUser(name, surname, username, 10, sex, age, city, presentation, minAgePref, maxAgePref)).to.throw(TypeError, '10 is not a string')
            })

            it('should fail on undefined sex', () => {
                expect(() => logic.registerUser(name, surname, username, password, undefined, age, city, presentation, minAgePref, maxAgePref)).to.throw(TypeError, 'undefined is not a string')
            })

            it('should fail on empty sex', () => {
                expect(() => logic.registerUser(name, surname, username, password, '', age, city, presentation, minAgePref, maxAgePref)).to.throw(ValueError, 'sex is empty or blank')
            })

            it('should fail on blank sex', () => {
                expect(() => logic.registerUser(name, surname, username, password, '   \t\n', age, city, presentation, minAgePref, maxAgePref)).to.throw(ValueError, 'sex is empty or blank')
            })

            it('should fail on non string sex', () => {
                expect(() => logic.registerUser(name, surname, username, password, 10, age, city, presentation, minAgePref, maxAgePref)).to.throw(TypeError, '10 is not a string')
            })

            it('should fail on undefined age', () => {
                expect(() => logic.registerUser(name, surname, username, password, sex, undefined, city, presentation, minAgePref, maxAgePref)).to.throw(TypeError, 'undefined is not a number')
            })

            it('should fail on empty age', () => {
                expect(() => logic.registerUser(name, surname, username, password, sex, '', city, presentation, minAgePref, maxAgePref)).to.throw(TypeError, ' is not a number')
            })

            it('should fail on blank age', () => {
                expect(() => logic.registerUser(name, surname, username, password, sex, '   \t\n', city, presentation, minAgePref, maxAgePref)).to.throw(TypeError, '   \t\n is not a number')
            })

            it('should fail on non number age', () => {
                expect(() => logic.registerUser(name, surname, username, password, sex, 'string', 'string', presentation, minAgePref, maxAgePref)).to.throw(TypeError, 'string is not a number')
            })

            it('should fail on undefined city', () => {
                expect(() => logic.registerUser(name, surname, username, password, sex, age, undefined, presentation, minAgePref, maxAgePref)).to.throw(TypeError, 'undefined is not a string')
            })

            it('should fail on empty city', () => {
                expect(() => logic.registerUser(name, surname, username, password, sex, age, '', presentation, minAgePref, maxAgePref)).to.throw(ValueError, 'city is empty or blank')
            })

            it('should fail on blank city', () => {
                expect(() => logic.registerUser(name, surname, username, password, sex, age, '   \t\n', presentation, minAgePref, maxAgePref)).to.throw(ValueError, 'city is empty or blank')
            })

            it('should fail on non string city', () => {
                expect(() => logic.registerUser(name, surname, username, password, sex, age, 10, presentation, minAgePref, maxAgePref)).to.throw(TypeError, '10 is not a string')
            })

            it('should fail on undefined presentation', () => {
                expect(() => logic.registerUser(name, surname, username, password, sex, age, city, undefined, minAgePref, maxAgePref)).to.throw(TypeError, 'undefined is not a string')
            })

            it('should fail on empty presentation', () => {
                expect(() => logic.registerUser(name, surname, username, password, sex, age, city, '', minAgePref, maxAgePref)).to.throw(ValueError, 'presentation is empty or blank')
            })

            it('should fail on blank presentation', () => {
                expect(() => logic.registerUser(name, surname, username, password, sex, age, city, '   \t\n', minAgePref, maxAgePref)).to.throw(ValueError, 'presentation is empty or blank')
            })

            it('should fail on non string presentation', () => {
                expect(() => logic.registerUser(name, surname, username, password, sex, age, city, 10, minAgePref, maxAgePref)).to.throw(TypeError, '10 is not a string')
            })

            it('should fail on undefined minAgePref', () => {
                expect(() => logic.registerUser(name, surname, username, password, sex, age, city, presentation, undefined, maxAgePref)).to.throw(TypeError, 'undefined is not a number')
            })

            it('should fail on empty minAgePref', () => {
                expect(() => logic.registerUser(name, surname, username, password, sex, age, city, presentation, '', maxAgePref)).to.throw(TypeError, ' is not a number')
            })

            it('should fail on blank minAgePref', () => {
                expect(() => logic.registerUser(name, surname, username, password, sex, age, city, presentation, '   \t\n', maxAgePref)).to.throw(TypeError, '   \t\n is not a number')
            })

            it('should fail on non number minAgePref', () => {
                expect(() => logic.registerUser(name, surname, username, password, sex, age, city, presentation, 'string', maxAgePref)).to.throw(TypeError, 'string is not a number')
            })

            it('should fail on undefined maxAgePref', () => {
                expect(() => logic.registerUser(name, surname, username, password, sex, age, city, presentation, minAgePref, undefined)).to.throw(TypeError, 'undefined is not a number')
            })

            it('should fail on empty maxAgePref', () => {
                expect(() => logic.registerUser(name, surname, username, password, sex, age, city, presentation, minAgePref, '')).to.throw(TypeError, ' is not a number')
            })

            it('should fail on blank maxAgePref', () => {
                expect(() => logic.registerUser(name, surname, username, password, sex, age, city, presentation, minAgePref, '   \t\n')).to.throw(TypeError, '   \t\n is not a number')
            })

            it('should fail on non number maxAgePref', () => {
                expect(() => logic.registerUser(name, surname, username, password, sex, age, city, presentation, minAgePref, 'string')).to.throw(TypeError, 'string is not a number')
            })

        })

        describe('authenticate', () => {
            let user

            beforeEach(() => (user = new User({
                name: 'John', surname: 'Doe', username: 'jd', password: '123',
                age: 20, sex: 'MALE', city: 'Barcelona', presentation: 'Im a good guy', minAgePref: 20, maxAgePref: 25, created: Date.now()
            })).save())

            it('should authenticate on correct credentials', async () => {
                const { username, password } = user

                const id = await logic.authenticateUser(username, password)

                expect(id).to.exist
                expect(id).to.be.a('string')

                const users = await User.find()

                const [_user] = users

                expect(_user.id).to.equal(id)
            })

            it('should fail on incorrect password', async () => {
                const { username } = user

                const wrong = `password-${Math.random()}`

                try {
                    await logic.authenticateUser(username, wrong)
                }
                catch (error) {
                    expect(error).to.be.an.instanceof(AuthError)
                    expect(error.message).to.be.a('string')
                    expect(error.message).to.be.equal('invalid username or password')

                }

            })

            it('should fail on incorrect username', async () => {
                const { password } = user

                const wrong = `username-${Math.random()}`

                try {
                    await logic.authenticateUser(wrong, password)
                }
                catch (error) {
                    expect(error).to.be.an.instanceof(AuthError)
                    expect(error.message).to.be.a('string')
                    expect(error.message).to.be.equal('invalid username or password')

                }

            })

            it('should fail on undefined username', () => {
                expect(() => logic.authenticateUser(undefined, user.password)).to.throw(TypeError, 'undefined is not a string')
            })

            it('should fail on empty username', () => {
                expect(() => logic.authenticateUser('', user.password)).to.throw(ValueError, 'username is empty or blank')
            })

            it('should fail on blank username', () => {
                expect(() => logic.authenticateUser('   \t\n', user.password)).to.throw(ValueError, 'username is empty or blank')
            })

            it('should fail on non string username', () => {
                expect(() => logic.authenticateUser(10, user.password)).to.throw(TypeError, '10 is not a string')
            })

            it('should fail on undefined password', () => {
                expect(() => logic.authenticateUser(user.username, undefined)).to.throw(TypeError, 'undefined is not a string')
            })

            it('should fail on empty password', () => {
                expect(() => logic.authenticateUser(user.username, '')).to.throw(ValueError, 'password is empty or blank')
            })

            it('should fail on blank password', () => {
                expect(() => logic.authenticateUser(user.username, '   \t\n')).to.throw(ValueError, 'password is empty or blank')
            })

            it('should fail on non string password', () => {
                expect(() => logic.authenticateUser(user.username, 10)).to.throw(TypeError, '10 is not a string')
            })


        })

        describe('retrieve', () => {
            let user

            beforeEach(async () => {
                user = new User({
                    name: 'John', surname: 'Doe', username: 'jd', password: '123',
                    age: 20, sex: 'MALE', city: 'Barcelona', presentation: 'Im a good guy', minAgePref: 20,
                    maxAgePref: 25, created: Date.now()
                })

                await user.save()
            })

            it('should succeed on valid id', async () => {
                const _user = await logic.retrieveUser(user.id)

                expect(_user).not.to.be.instanceof(User)

                const { id, name, surname, username, password, created } = _user
                expect(id).to.exist
                expect(id).to.be.a('string')
                expect(id).to.equal(user.id)
                expect(name).to.equal(user.name)
                expect(surname).to.equal(user.surname)
                expect(username).to.equal(user.username)
                expect(password).to.be.undefined
                expect(created).to.exist
            })

            it('should fail on no valid id', async () => {
                const wrongId = `id-${Math.random()}`
                try {
                    await logic.retrieveUser(wrongId)
                }
                catch (error) {

                    expect(error).to.be.an.instanceof(NotFoundError)
                    expect(error.message).to.be.a('string')
                    expect(error.message).to.be.equal(`user with id ${wrongId} not found`)
                }


            })

            it('should fail on undefined id', () => {
                expect(() => logic.retrieveUser(undefined)).to.throw(TypeError, 'undefined is not a string')
            })

            it('should fail on empty id', () => {
                expect(() => logic.retrieveUser('')).to.throw(ValueError, 'id is empty or blank')
            })

            it('should fail on blank id', () => {
                expect(() => logic.retrieveUser('   \t\n')).to.throw(ValueError, 'id is empty or blank')
            })

            it('should fail on non string id', () => {
                expect(() => logic.retrieveUser(10)).to.throw(TypeError, '10 is not a string')
            })
        })

        describe('update', () => {
            let user

            beforeEach(() => (user = new User({
                name: 'John', surname: 'Doe', username: 'jd', password: '123',
                sex: 'MALE', age: 30, city: ' Barcelona', presentation: 'Im guay', minAgePref: 30, maxAgePref: 35,
            })).save())

            it('should update on correct data and password', async () => {
                const { id, name, surname, username, password, sex, age, city, presentation, minAgePref, maxAgePref } = user

                const newName = `${name}-${Math.random()}`
                const newSurname = `${surname}-${Math.random()}`
                const newUsername = `${username}-${Math.random()}`
                const newPassword = `${password}-${Math.random()}`
                const newPassword2 = newPassword
                const newSex = 'FEMALE'
                const newAge = 35
                const newCity = 'Madrid'
                const newPresentation = 'not guay'
                const newMinAge = 25
                const newMaxAge = 30

                const res = await logic.updateUser(id, newName, newSurname, newUsername, password, newPassword, newPassword2,
                    newSex, newAge, newCity, newPresentation, newMinAge, newMaxAge)

                expect(res).to.be.undefined

                const _users = await User.find()

                const [_user] = _users

                expect(_user.id).to.equal(id)
                expect(_user.name).to.equal(newName)
                expect(_user.surname).to.equal(newSurname)
                expect(_user.username).to.equal(newUsername)
                expect(_user.password).to.equal(newPassword)
                expect(_user.sex).to.equal(newSex)
                expect(_user.age).to.equal(newAge)
                expect(_user.city).to.equal(newCity)
                expect(_user.presentation).to.equal(newPresentation)
                expect(_user.minAgePref).to.equal(newMinAge)
                expect(_user.maxAgePref).to.equal(newMaxAge)
            })

            it('should update on correct id, name and password (other fields null)', async () => {
                const { id, name, surname, username, password } = user

                const newName = `${name}-${Math.random()}`

                const res = await logic.updateUser(id, newName, null, null, password, null, null, null, null, null, null, null, null)

                expect(res).to.be.undefined

                const _users = await User.find()

                const [_user] = _users

                expect(_user.id).to.equal(id)

                expect(_user.name).to.equal(newName)
                expect(_user.surname).to.equal(surname)
                expect(_user.username).to.equal(username)
                expect(_user.password).to.equal(password)
            })

            it('should update on correct id, surname and password (other fields null)', async () => {
                const { id, name, surname, username, password } = user

                const newSurname = `${surname}-${Math.random()}`

                const res = await logic.updateUser(id, null, newSurname, null, password, null, null, null, null, null, null, null, null)

                expect(res).to.be.undefined

                const _users = await User.find()

                const [_user] = _users

                expect(_user.id).to.equal(id)

                expect(_user.name).to.equal(name)
                expect(_user.surname).to.equal(newSurname)
                expect(_user.username).to.equal(username)
                expect(_user.password).to.equal(password)
            })

            // TODO other combinations of valid updates

            it('should fail on undefined id', () => {
                const { id, name, surname, username, password } = user

                expect(() => logic.updateUser(undefined, name, surname, username, password, password)).to.throw(TypeError, 'undefined is not a string')
            })

            // TODO other test cases

            describe('with existing user', () => {
                let user2

                beforeEach(async () => {
                    user2 = new User({
                        name: 'John', surname: 'Doe', username: 'jd2', password: '123',
                        age: 20, sex: 'MALE', city: 'Barcelona', presentation: 'Im a good guy', minAgePref: 20,
                        maxAgePref: 25, created: Date.now()
                    })

                    await user2.save()
                })

                it('should update on correct data and password', async () => {
                    const { id, name, surname, username, password, sex, age, city, presentation, minAgePref, maxAgePref } = user2

                    const newUsername = 'jd'
                    const newSex = 'FEMALE'
                    const newAge = 35
                    const newCity = 'Madrid'
                    const newPresentation = 'not guay'
                    const newMinAge = 25
                    const newMaxAge = 30

                    try {
                        const res = await logic.updateUser(id, null, null, newUsername, password, null, null, newSex, newAge, newPresentation, newCity, newMinAge, newMaxAge)

                        expect(true).to.be.false
                    } catch (err) {
                        expect(err).to.be.instanceof(AlreadyExistsError)
                    } finally {
                        const _user = await User.findById(id)

                        expect(_user.id).to.equal(id)

                        expect(_user.name).to.equal(name)
                        expect(_user.surname).to.equal(surname)
                        expect(_user.username).to.equal(username)
                        expect(_user.password).to.equal(password)
                        expect(_user.age).to.equal(age)
                        expect(_user.sex).to.equal(sex)
                        expect(_user.city).to.equal(city)
                        expect(_user.presentation).to.equal(presentation)
                        expect(_user.minAgePref).to.equal(minAgePref)
                        expect(_user.maxAgePref).to.equal(maxAgePref)
                    }
                })
            })

        })

        describe('add contact', () => {
            let user
            let user2

            beforeEach(async () => {
                user = new User({
                    name: 'John', surname: 'Doe', username: 'jd', password: '123',
                    age: 20, sex: 'MALE', city: 'Barcelona', presentation: 'Im a good guy', minAgePref: 20,
                    maxAgePref: 25, created: Date.now()
                })

                user2 = new User({
                    name: 'Mary', surname: 'Jane', username: 'ma', password: '123',
                    age: 20, sex: 'FEMALE', city: 'Barcelona', presentation: 'Im a good girl', minAgePref: 20,
                    maxAgePref: 25, created: Date.now()
                })

                await Promise.all([user.save(), user2.save()])
            })


            it('should succed on correct data', async () => {
                const res = await logic.addContact(user.id, user2.id)

                expect(res).to.be.undefined

                const _user = await User.findById(user.id)

                const _user2 = await User.findById(user2.id)

                expect(_user.id).to.equal(user.id)

                expect(_user.contacts.length).to.equal(1)

                expect(_user2.id).to.equal(user2.id)

                expect(_user2.contacts.length).to.equal(1)

                const [contactId] = _user.contacts

                expect(contactId.toString()).to.equal(user2.id)

                const [contactId2] = _user2.contacts

                expect(contactId2.toString()).to.equal(user.id)
            })

            it('should fail if the user to add is the same user', async () => {

                try {
                    await logic.addContact(user.id, user.id)
                    expect(true).to.be.false
                } catch (err) {
                    expect(err).to.be.instanceof(NotAllowedError)
                    expect(err.message).to.be.equal('user cannot add himself as a contact')
                }


            })


            it('should fail on undefined user1 id', () => {
                expect(() => logic.addContact(undefined, user2.id)).to.throw(TypeError, 'undefined is not a string')
            })

            it('should fail on empty user1 id', () => {
                expect(() => logic.addContact('', user2.id)).to.throw(ValueError, 'id is empty or blank')
            })

            it('should fail on blank user1 id', () => {
                expect(() => logic.addContact('   \t\n', user2.id)).to.throw(ValueError, 'id is empty or blank')
            })

            it('should fail on non string user1 id', () => {
                expect(() => logic.addContact(10, user2.id)).to.throw(TypeError, '10 is not a string')
            })

            it('should fail on undefined user2 id', () => {
                expect(() => logic.addContact(user.id, undefined)).to.throw(TypeError, 'undefined is not a string')
            })

            it('should fail on empty user2 id', () => {
                expect(() => logic.addContact(user.id, '')).to.throw(ValueError, 'idContact is empty or blank')
            })

            it('should fail on blank user2 id', () => {
                expect(() => logic.addContact(user.id, '   \t\n')).to.throw(ValueError, 'idContact is empty or blank')
            })

            it('should fail on non string user2 id', () => {
                expect(() => logic.addContact(user.id, 10)).to.throw(TypeError, '10 is not a string')
            })
        })

        describe('list contacts', () => {
            let user
            let user2
            let user3
            let user4
            let user5

            beforeEach(async () => {
                user = new User({
                    name: 'John', surname: 'Doe', username: 'jd', password: '123',
                    age: 20, sex: 'MALE', city: 'Barcelona', presentation: 'Im a good guy', minAgePref: 20,
                    maxAgePref: 25, created: Date.now()
                })

                user2 = new User({
                    name: 'Mary', surname: 'Jane', username: 'ma', password: '123',
                    age: 20, sex: 'FEMALE', city: 'Barcelona', presentation: 'Im a good girl', minAgePref: 20,
                    maxAgePref: 25, created: Date.now()
                })

                user3 = new User({
                    name: 'Sara', surname: 'Varas', username: 'sa', password: '123',
                    age: 25, sex: 'FEMALE', city: 'Barcelona', presentation: 'Im another good girl', minAgePref: 20,
                    maxAgePref: 23, created: Date.now()
                })

                user4 = new User({
                    name: 'Sara', surname: 'Varas', username: 'sat', password: '123',
                    age: 25, sex: 'FEMALE', city: 'Barcelona', presentation: 'Im another good girl', minAgePref: 20,
                    maxAgePref: 23, created: Date.now()
                })

                user5 = new User({
                    name: 'Pamela', surname: 'Anderson', username: 'pam', password: '123',
                    age: 25, sex: 'FEMALE', city: 'Barcelona', presentation: 'Im not another good girl', minAgePref: 20,
                    maxAgePref: 23, created: Date.now()
                })

                user.contacts.push(user3.id)
                user.contacts.push(user2.id)
                user.contacts.push(user5.id)
                user.contacts.push(user4.id)
                user.blocks.push(user5.id)
                user5.blockedBy.push(user.id)
                user.blockedBy.push(user4.id)
                user4.blocks.push(user.id)
                

                await Promise.all([user.save(), user2.save(), user3.save(), user4.save(), user5.save()])
            })


            it('should succed on correct data with user', async () => {
                const res = await logic.listContacts(user.id)

                expect(res).not.to.be.undefined

                expect(res.length).to.equal(2)


            })


            it('should fail is the user doesn`t exist', async () => {
                const wrongId = user4.id

                try {
                    await logic.listContacts(wrongId)

                } catch (error) {
                    expect(error).not.to.be.undefined

                    expect(error).to.be.an.instanceOf(NotFoundError)

                    expect(error.message).to.be.equal(`user with id ${wrongId} not found`)
                }

            })


            it('should fail on undefined user userId', () => {
                expect(() => logic.addContact(undefined)).to.throw(TypeError, 'undefined is not a string')
            })

            it('should fail on empty user userId', () => {
                expect(() => logic.addContact('')).to.throw(ValueError, 'id is empty or blank')
            })

            it('should fail on blank user userId', () => {
                expect(() => logic.addContact('   \t\n')).to.throw(ValueError, 'id is empty or blank')
            })

            it('should fail on non string user userId', () => {
                expect(() => logic.addContact(10)).to.throw(TypeError, '10 is not a string')
            })
        })

        describe('retrieve candidates', () => {
            let user
            let user2
            let user3
            let user4

            beforeEach(async () => {
                user = new User({
                    name: 'John', surname: 'Doe', username: 'jd', password: '123',
                    age: 20, sex: 'MALE', city: 'Barcelona', presentation: 'Im a good guy', minAgePref: 20,
                    maxAgePref: 25, created: Date.now()
                })

                user2 = new User({
                    name: 'Mary', surname: 'Jane', username: 'ma', password: '123',
                    age: 22, sex: 'FEMALE', city: 'Barcelona', presentation: 'Im a good girl', minAgePref: 20,
                    maxAgePref: 25, created: Date.now()
                })

                user3 = new User({
                    name: 'Sara', surname: 'Varas', username: 'sa', password: '123',
                    age: 25, sex: 'FEMALE', city: 'Barcelona', presentation: 'Im another good girl', minAgePref: 20,
                    maxAgePref: 23, created: Date.now()
                })

                user4 = new User({
                    name: 'Loli', surname: 'Pili', username: 'mr', password: '123',
                    age: 40, sex: 'FEMALE', city: 'Barcelona', presentation: 'Im a third good girl', minAgePref: 20,
                    maxAgePref: 25, created: Date.now()
                })

                await user.save()
                await user2.save()
                await user3.save()
                await user4.save()                
            })

            it('should succed on correct data', async () => {

                const candidates = await logic.listCandidates(user.id)

                expect(candidates.length).to.equal(2)
                expect(candidates[0].name).to.equal(user2.name)
                expect(candidates[1].name).to.equal(user3.name)
                expect(candidates[0].presentation).to.equal(user2.presentation)
                expect(candidates[1].presentation).to.equal(user3.presentation)

            })
        })

        describe('add photo', () => {
            let user

            beforeEach(async () => {
                user = new User({
                    name: 'John', surname: 'Doe', username: 'jd', password: '123',
                    age: 20, sex: 'MALE', city: 'Barcelona', presentation: 'Im a good guy', minAgePref: 20,
                    maxAgePref: 25, created: Date.now()
                })
                await user.save()
            })
            it('should succed on correct data', async () => {

                const photo = 'photo1'

                const res = await logic.insertPhoto(user.id, base64Image, photo)

                expect(res).not.to.be.undefined

                const _user = await User.findById(user.id)

                expect(_user.id).to.equal(user.id)

                expect(_user.photo1).not.to.be.undefined
            })

        })

        describe('retrieve photos', () => {
            let user

            beforeEach(async () => {
                user = new User({
                    name: 'John', surname: 'Doe', username: 'jd', password: '123',
                    age: 20, sex: 'MALE', city: 'Barcelona', presentation: 'Im a good guy', minAgePref: 20,
                    maxAgePref: 25, created: Date.now()
                })

                await user.save()

                const photo = 'photo1'

                await logic.insertPhoto(user.id, base64Image, photo)
            })

            it('should succed on correct data', async () => {


                const photos = await logic.retrieveUserPhotos(user.id)

                expect(photos).not.to.be.undefined
                
                expect(photos.photo2).to.be.equal('#')
                expect(photos.photo3).to.be.equal('#')
            })

        })

       

    })


    describe('messages', () => {
        let user
        let user2

        beforeEach(async () => {
            user = new User({
                name: 'John', surname: 'Doe', username: 'jd', password: '123',
                age: 20, sex: 'MALE', city: 'Barcelona', presentation: 'Im a good guy', minAgePref: 20,
                maxAgePref: 25, created: Date.now()
            })

            user2 = new User({
                name: 'Mary', surname: 'Jane', username: 'ma', password: '123',
                age: 20, sex: 'FEMALE', city: 'Barcelona', presentation: 'Im a good girl', minAgePref: 20,
                maxAgePref: 25, created: Date.now()
            })

            user.contacts.push(user2.id)
            user2.contacts.push(user.id)

            await Promise.all([user.save(), user2.save()])
        })

        describe('add message', () => {


            it('should succed on correct data', async () => {
                const text = 'hola mundo'
                const res = await logic.addMessage(user.id, user2.id, text)

                expect(res).to.be.undefined

                const messages = await Message.find()

                expect(messages.length).to.equal(1)

                const [message] = messages

                expect(message.text).to.equal(text)
                expect(message.sentTo.toString()).to.equal(user2.id)
                expect(message.status).to.equal('PENDING')
                expect(message.user.toString()).to.equal(user.id)
                expect(message.sentDate).not.to.be.undefined


            })

            it('should fail on undefined user userId', () => {
                const text = 'hola mundo'
                expect(() => logic.addMessage(undefined, user2.id, text)).to.throw(TypeError, 'undefined is not a string')
            })

            it('should fail on empty user userId', () => {
                const text = 'hola mundo'
                expect(() => logic.addMessage('', user2.id, text)).to.throw(ValueError, 'user is empty or blank')
            })

            it('should fail on blank user userId', () => {
                const text = 'hola mundo'
                expect(() => logic.addMessage('   \t\n', user2.id, text)).to.throw(ValueError, 'user is empty or blank')
            })

            it('should fail on non string user userId', () => {
                const text = 'hola mundo'
                expect(() => logic.addMessage(10, user2.id, text)).to.throw(TypeError, '10 is not a string')
            })

            it('should fail on undefined sentTo', () => {
                const text = 'hola mundo'
                expect(() => logic.addMessage(user.id, undefined, text)).to.throw(TypeError, 'undefined is not a string')
            })

            it('should fail on empty user sentTo', () => {
                const text = 'hola mundo'
                expect(() => logic.addMessage(user.id, '', text)).to.throw(ValueError, 'sentTo is empty or blank')
            })

            it('should fail on blank user sentTo', () => {
                const text = 'hola mundo'
                expect(() => logic.addMessage(user.id, '   \t\n', text)).to.throw(ValueError, 'sentTo is empty or blank')
            })

            it('should fail on non string user sentTo', () => {
                const text = 'hola mundo'
                expect(() => logic.addMessage(user.id, 10, text)).to.throw(TypeError, '10 is not a string')
            })

            it('should fail on undefined text', () => {
                const text = 'hola mundo'
                expect(() => logic.addMessage(user.id, undefined, undefined)).to.throw(TypeError, 'undefined is not a string')
            })

            it('should fail on empty user text', () => {
                const text = 'hola mundo'
                expect(() => logic.addMessage(user.id, user2.id, '')).to.throw(ValueError, 'text is empty or blank')
            })

            it('should fail on blank user text', () => {
                const text = 'hola mundo'
                expect(() => logic.addMessage(user.id, user2.id, '   \t\n')).to.throw(ValueError, 'text is empty or blank')
            })

            it('should fail on non string user text', () => {
                const text = 'hola mundo'
                expect(() => logic.addMessage(user.id, user2.id, 10)).to.throw(TypeError, '10 is not a string')
            })

            it('should fail on non existent user', async () => {
                const text = 'hola mundo'
                const wrongId = 'wrong'
                try {
                    const res = await logic.addMessage(wrongId, user2.id, text)

                } catch (error) {
                    expect(error).not.to.be.undefined
                    expect(error).to.be.an.instanceOf(NotFoundError)
                    expect(error.message).to.be.equal(`user with id ${wrongId} not found`)
                }


            })

            it('should fail on non existent sentTo', async () => {
                const text = 'hola mundo'
                const wrongId = 'wrong'
                try {
                    const res = await logic.addMessage(user.id, wrongId, text)

                } catch (error) {
                    expect(error).not.to.be.undefined
                    expect(error).to.be.an.instanceOf(NotFoundError)
                    expect(error.message).to.be.equal(`user with id ${wrongId} not found`)
                }


            })

        })

        describe('retrieve conversation', () => {

            beforeEach(async () => {
                message1 = new Message({
                    text: 'hello im Jhon', user: user.id, status: 'READED', sentTo: user2.id, sentDate: Date.now()
                })
                message2 = new Message({
                    text: 'hello im Mary', user: user2.id, status: 'READED', sentTo: user.id, sentDate: Date.now()
                })
                message3 = new Message({
                    text: 'lets talk!', user: user.id, status: 'PENDING', sentTo: user2.id, sentDate: Date.now()
                })

                await message1.save()
                await message2.save()
                await message3.save()

            })


            it('should succed on correct data', async () => {

                const conversation = await logic.retrieveMessages(user.id, user2.id)

                expect(conversation.length).to.equal(3)

                expect(conversation[0].text).to.equal('hello im Jhon')

                expect(conversation[1].text).to.equal('hello im Mary')

                expect(conversation[2].text).to.equal('lets talk!')

                const message = await Message.findById(conversation[2].id)

                expect(message.status).to.equal('PENDING')
            })

            it('should succed on correct data and change message to READED and last to READED', async () => {

                const conversation = await logic.retrieveMessages(user2.id, user.id)

                expect(conversation.length).to.equal(3)

                expect(conversation[0].text).to.equal('hello im Jhon')

                expect(conversation[1].text).to.equal('hello im Mary')

                expect(conversation[2].text).to.equal('lets talk!')

                const message = await Message.findById(conversation[2].id)

                expect(message.status).to.equal('READED')

                const message2 = await Message.findById(conversation[1].id)

                expect(message2.status).to.equal('READED')

            })

            it('should fail on undefined user1', () => {
                expect(() => logic.retrieveMessages(undefined, user2.id)).to.throw(TypeError, 'undefined is not a string')
            })

            it('should fail on empty user1', () => {
                expect(() => logic.retrieveMessages('', user2.id)).to.throw(ValueError, 'user1 is empty or blank')
            })

            it('should fail on blank user1', () => {
                expect(() => logic.retrieveMessages('   \t\n', user2.id)).to.throw(ValueError, 'user1 is empty or blank')
            })

            it('should fail on non string user1', () => {
                expect(() => logic.retrieveMessages(10, user2.id)).to.throw(TypeError, '10 is not a string')
            })

            it('should fail on undefined user2', () => {
                expect(() => logic.retrieveMessages(user.id, undefined)).to.throw(TypeError, 'undefined is not a string')
            })

            it('should fail on empty user2', () => {
                expect(() => logic.retrieveMessages(user.id, '')).to.throw(ValueError, 'user2 is empty or blank')
            })

            it('should fail on blank user2', () => {
                expect(() => logic.retrieveMessages(user.id, '   \t\n')).to.throw(ValueError, 'user2 is empty or blank')
            })

            it('should fail on non string user2', () => {
                expect(() => logic.retrieveMessages(user.id, 10)).to.throw(TypeError, '10 is not a string')
            })

        })

        describe('check messages', () => {

            beforeEach(async () => {
                message1 = new Message({
                    text: 'hello im Jhon', user: user.id, status: 'READED', sentTo: user2.id, sentDate: Date.now()
                })
                message2 = new Message({
                    text: 'hello im Mary', user: user2.id, status: 'READED', sentTo: user.id, sentDate: Date.now()
                })
                message3 = new Message({
                    text: 'lets talk!', user: user.id, status: 'PENDING', sentTo: user2.id, sentDate: Date.now()
                })

                await message1.save()
                await message2.save()
                await message3.save()

            })


            it('should succed on correct data', async () => {

                const conversation = await logic.checkMessages(user.id, user2.id)

                expect(conversation.length).to.equal(3)

                expect(conversation[0].text).to.equal('hello im Jhon')

                expect(conversation[1].text).to.equal('hello im Mary')

                expect(conversation[2].text).to.equal('lets talk!')


            })


            it('should fail on undefined user1', () => {
                expect(() => logic.checkMessages(undefined, user2.id)).to.throw(TypeError, 'undefined is not a string')
            })

            it('should fail on empty user1', () => {
                expect(() => logic.checkMessages('', user2.id)).to.throw(ValueError, 'user1 is empty or blank')
            })

            it('should fail on blank user1', () => {
                expect(() => logic.checkMessages('   \t\n', user2.id)).to.throw(ValueError, 'user1 is empty or blank')
            })

            it('should fail on non string user1', () => {
                expect(() => logic.checkMessages(10, user2.id)).to.throw(TypeError, '10 is not a string')
            })

            it('should fail on undefined user2', () => {
                expect(() => logic.checkMessages(user.id, undefined)).to.throw(TypeError, 'undefined is not a string')
            })

            it('should fail on empty user2', () => {
                expect(() => logic.checkMessages(user.id, '')).to.throw(ValueError, 'user2 is empty or blank')
            })

            it('should fail on blank user2', () => {
                expect(() => logic.checkMessages(user.id, '   \t\n')).to.throw(ValueError, 'user2 is empty or blank')
            })

            it('should fail on non string user2', () => {
                expect(() => logic.checkMessages(user.id, 10)).to.throw(TypeError, '10 is not a string')
            })

        })

        describe('check new messages', () => {

            beforeEach(async () => {
                message1 = new Message({
                    text: 'hello im Jhon', user: user.id, status: 'READED', sentTo: user2.id, sentDate: Date.now()
                })
                message2 = new Message({
                    text: 'hello im Mary', user: user2.id, status: 'READED', sentTo: user.id, sentDate: Date.now()
                })
                message3 = new Message({
                    text: 'lets talk!', user: user.id, status: 'PENDING', sentTo: user2.id, sentDate: Date.now()
                })

                await message1.save()
                await message2.save()
                await message3.save()

            })


            it('should succed on correct data', async () => {

                const contacts = await logic.checkNewMessages(user2.id)

                expect(contacts.length).to.equal(1)

                expect(contacts[0]).to.equal(user.id)


            })


            it('should fail on undefined user', () => {
                expect(() => logic.checkNewMessages(undefined)).to.throw(TypeError, 'undefined is not a string')
            })

            it('should fail on empty user', () => {
                expect(() => logic.checkNewMessages('')).to.throw(ValueError, 'user is empty or blank')
            })

            it('should fail on blank user', () => {
                expect(() => logic.checkNewMessages('   \t\n')).to.throw(ValueError, 'user is empty or blank')
            })

            it('should fail on non string user', () => {
                expect(() => logic.checkNewMessages(10)).to.throw(TypeError, '10 is not a string')
            })

            it('should fail on undefined user', () => {
                expect(() => logic.checkNewMessages(undefined)).to.throw(TypeError, 'undefined is not a string')
            })

            it('should fail on empty user', () => {
                expect(() => logic.checkNewMessages('')).to.throw(ValueError, 'user is empty or blank')
            })

            it('should fail on blank user', () => {
                expect(() => logic.checkNewMessages('   \t\n')).to.throw(ValueError, 'user is empty or blank')
            })

            it('should fail on non string user', () => {
                expect(() => logic.checkNewMessages(10)).to.throw(TypeError, '10 is not a string')
            })

        })

    })

    describe('block a user', () => {

        let user
        let user2

        beforeEach(async () => {
            user = new User({
                name: 'John', surname: 'Doe', username: 'jd', password: '123',
                age: 20, sex: 'MALE', city: 'Barcelona', presentation: 'Im a good guy', minAgePref: 20,
                maxAgePref: 25, created: Date.now()
            })

            user2 = new User({
                name: 'Mary', surname: 'Jane', username: 'ma', password: '123',
                age: 20, sex: 'FEMALE', city: 'Barcelona', presentation: 'Im a good girl', minAgePref: 20,
                maxAgePref: 25, created: Date.now()
            })

            user.contacts.push(user2.id)
            user2.contacts.push(user.id)

            await Promise.all([user.save(), user2.save()])
        })

        it('should succed on correct data', async () => {

            await logic.blockUser(user.id, user2.id)

            const _user = await User.findById(user.id)
            const _user2 = await User.findById(user2.id)

            expect(_user.blocks.length).to.equal(1)
            expect(_user.blocks[0]).to.equal(user2.id)
            expect(_user2.blockedBy.length).to.equal(1)
            expect(_user2.blockedBy[0]).to.equal(user.id)
            

        })

        it('should fail if user try to block himself', async()=>{
            try{
                await logic.blockUser(user.id, user.id)
            } catch (error){
                expect(error.message).to.equal('user cannot add himself as a blocked')
            }
        })

        it('should fail tryin to block two times same user', async()=>{
            await logic.blockUser(user.id, user2.id)

            try{
                await logic.blockUser(user.id, user2.id)
            } catch (error){
                expect(error.message).to.equal(`user with id ${user2.id} arleady blocked by ${user.id}`)
            }

        })

        it('should fail on undefined user1', () => {
            expect(() => logic.blockUser(undefined, user2.id)).to.throw(TypeError, 'undefined is not a string')
        })

        it('should fail on empty user1', () => {
            expect(() => logic.blockUser('', user2.id)).to.throw(ValueError, 'user1 is empty or blank')
        })

        it('should fail on blank user1', () => {
            expect(() => logic.blockUser('   \t\n', user2.id)).to.throw(ValueError, 'user1 is empty or blank')
        })

        it('should fail on non string user1', () => {
            expect(() => logic.blockUser(10, user2.id)).to.throw(TypeError, '10 is not a string')
        })

        it('should fail on undefined user2', () => {
            expect(() => logic.blockUser(user.id, undefined)).to.throw(TypeError, 'undefined is not a string')
        })

        it('should fail on empty user2', () => {
            expect(() => logic.blockUser(user.id, '')).to.throw(ValueError, 'user2 is empty or blank')
        })

        it('should fail on blank user2', () => {
            expect(() => logic.blockUser(user.id, '   \t\n')).to.throw(ValueError, 'user2 is empty or blank')
        })

        it('should fail on non string user2', () => {
            expect(() => logic.blockUser(user.id, 10)).to.throw(TypeError, '10 is not a string')
        })



    })



    afterEach(() => Promise.all([User.deleteMany(), Message.deleteMany()]))

    after(() => mongoose.disconnect())
})