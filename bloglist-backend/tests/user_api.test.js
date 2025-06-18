const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const User = require("../models/user")
const { usersInDb, initialUsers } = require('./test_helper')

beforeEach(async () => {
    await User.deleteMany({})

    let userObject = new User(initialUsers[0])
    await userObject.save()

    userObject = new User(initialUsers[1])
    await userObject.save()
})

test('Do not create if the password is missing', async () => {

    const newUser = {
        user: "Helsinki"
    }

    await api.post('/api/users').send(newUser)
    const usersAtEnd = await usersInDb()
    assert.strictEqual(usersAtEnd.length, initialUsers.length)
})

test('Do not create an invalid user (repeated)', async () => {

    const newUser = {
        username: "Helsinki",
        name: "Fin",
        password: "159159"
    }

    const result = await api.post('/api/users').send(newUser).expect(400)
    assert(result.body.error.includes('expected `username` to be unique'))
    const usersAtEnd = await usersInDb()
    assert.strictEqual(usersAtEnd.length, initialUsers.length)
})

test('returns an error message and appropriate status for an invalid user', async () => {

    const newUser = {
        user: "Helsinki"
    }

    const result = await api.post('/api/users').send(newUser).expect(400)
    assert(result.body.error.includes('password must be at least 3 characters long'))
})

after(async () => {
    await mongoose.connection.close()
})