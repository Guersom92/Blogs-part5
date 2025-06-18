const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const jwt = require('jsonwebtoken')
const { initialBlogs, blogsInDb, initialUsers } = require('./test_helper')

const Blog = require("../models/blog")
const User = require("../models/user")

let token = null

beforeEach(async () => {
    await User.deleteMany({})
    await Blog.deleteMany({})

    const newUser = new User(initialUsers[0])

    const savedUser = await newUser.save()

    const userForToken = {
        username: savedUser.username,
        id: savedUser._id,
    }

    token = jwt.sign(userForToken, process.env.SECRET)

    let blogObject = new Blog({ ...initialBlogs[0], user: savedUser._id })
    await blogObject.save()

    blogObject = new Blog({ ...initialBlogs[1], user: savedUser._id })
    await blogObject.save()

})

test('blogs are returned as json and gets all blogs', async () => {
    const response = await api.get('/api/blogs').expect(200).expect('Content-Type', /application\/json/)
    assert.strictEqual(response.body.length, initialBlogs.length)

})

test('Each response object has an id property', async () => {
    const response = await api.get('/api/blogs')
    const blog = response.body[0]
    assert(blog.hasOwnProperty("id"))
})

test('a valid blog can be added', async () => {
    const newBlog = {
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2,
    }

    await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(newBlog).expect(201).expect('Content-Type', /application\/json/)

    const blogsAtEnd = await blogsInDb()
    assert.strictEqual(blogsAtEnd.length, initialBlogs.length + 1)

    //Viendo si se encuentra un objeto con las misma propiedades en la base de datos
    exists = blogsAtEnd.some(obj => obj.title === newBlog.title && obj.author === newBlog.author && obj.url === newBlog.url && obj.likes === newBlog.likes)
    assert(exists)
})

test('blog without likes gives default value', async () => {

    const newBlog = {
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    }
    const response = await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(newBlog)

    assert.strictEqual(response.body.likes, 0)

})

test('blog with missing properties returns correct status', async () => {
    const newBlog = {
        author: "Robert C. Martin",
        likes: 20
    }
    await api.post('/api/blogs').send(newBlog).set('Authorization', `Bearer ${token}`).expect(400)

})

test('a blog can be deleted', async () => {

    const blogAtStart = await blogsInDb()
    const blogToDelete = blogAtStart[0]
    await api.delete(`/api/blogs/${blogToDelete.id}`).set('Authorization', `Bearer ${token}`).expect(204)

    const blogsAtEnd = await blogsInDb()

    const titles = blogsAtEnd.map((n) => n.title)
    assert(!titles.includes(blogToDelete.title))

    assert.strictEqual(blogsAtEnd.length, initialBlogs.length - 1)
})

test('updating a blog', async () => {
    const blogAtStart = await blogsInDb()
    const blogToUpdate = blogAtStart[0]
    const response = await api.put(`/api/blogs/${blogToUpdate.id}`).send({ likes: 80 })
    assert.strictEqual(response.body.likes, 80)
})

test('a blog without token doesnt get added', async () => {
    const newBlog = {
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5
    }

    await api.post('/api/blogs').send(newBlog).expect(401)
    const blogAtEnd = await blogsInDb()
    assert.strictEqual(blogAtEnd.length, initialBlogs.length)

})

after(async () => {
    await mongoose.connection.close()
})