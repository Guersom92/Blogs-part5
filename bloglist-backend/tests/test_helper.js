const Blog = require("../models/blog")
const User = require("../models/user")

const initialBlogs = [
    {

        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,

    },
    {

        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,

    },

]

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}


const initialUsers = [
    {
        username: "Helsinki",
        name: "Guersom",
        passwordHash: "123456"
    },
    {
        username: "relatividad1915",
        name: "Einstein",
        passwordHash: "654321"
    }

]

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}


module.exports = {
    initialBlogs,
    initialUsers,
    blogsInDb,
    usersInDb
}