const _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) return null

    return blogs.reduce((prev, current) => {
        return (prev.likes > current.likes) ? prev : current
    })
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) return null
    const grouped = _.countBy(blogs, 'author')
    const author = _.maxBy(Object.keys(grouped), o => grouped[o])
    return {
        author: author,
        blogs: grouped[author]
    }
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) return null
    const grouped = _.groupBy(blogs, 'author')
    const authors = _.map(grouped, (blogs, author) => ({
        author: author,
        likes: _.sumBy(blogs, 'likes')
    }))
    return _.maxBy(authors, 'likes')
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}