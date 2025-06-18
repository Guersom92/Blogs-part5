import axios from 'axios'
const baseUrl = '/api/blogs'
const loginUrl = '/api/login'

let token = null

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const login = async credentials => {
  const response = await axios.post(loginUrl, credentials)
  return response.data
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async (id, newObject) => {
  const response = await axios.put(`${baseUrl}/${id}`, newObject)
  return response.data
}

const eliminate = async id => {
  const config = {
    headers: { Authorization: token },
  }

  await axios.delete(`${baseUrl}/${id}`, config)
}

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}


export default { getAll, login, create, setToken, update, eliminate }