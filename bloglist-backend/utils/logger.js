const info = (info) => {
    if (process.env.NODE_ENV !== 'test') {
        console.log(info)
    }
}

const error = (error) => {
    if (process.env.NODE_ENV !== 'test') {
        console.error(error)
    }
}

module.exports = {
    info, error
}