const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)

})



blogRouter.post('/', middleware.userExtractor, async (request, response) => {
    const body = request.body
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' })
    }

    const user = request.user

    const blog = new Blog({ ...body, user: user._id })
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
})

blogRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
    const user = request.user
    const blog = await Blog.findById(request.params.id)

    if (!blog) {
        return response.status(204).end()
    }

    if (user.id.toString() !== blog.user.toString()) {
        return response.status(403).json({ error: 'user not authorized' })
    }

    user.blogs = user.blogs.filter(b => b.id.toString() !== blog.id.toString())
    await user.save()

    await blog.deleteOne()
    response.status(204).end()
})

blogRouter.put('/:id', async (request, response, next) => {

    const { title, author, url, likes, user } = request.body

    const blog = await Blog.findById(request.params.id)

    if (!blog) {
        return response.status(404).end()
    }

    blog.title = title
    blog.author = author
    blog.url = url
    blog.likes = likes
    blog.user = user

    const updatedBlog = await blog.save()

    response.json(updatedBlog)
})

module.exports = blogRouter