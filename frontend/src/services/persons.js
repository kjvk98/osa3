import axios from 'axios'
const baseUrl = '/api/persons'


const create = newObject => {
    const request = axios.post(baseUrl, newObject)
    return request.then(response => response.data)
  }


  const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
  }

  const delPerson = (id) => {
    const request = axios.delete(`${baseUrl}/${id}`)
    return request.then(response => response.data)
  }

  const update = (id, newObject) => {
    const request = axios.put(`${baseUrl}/${id}`, newObject)
    return request.then(response => response.data)
  }

export default {
    create: create,
    getAll: getAll,
    delPerson: delPerson,
    update:update
}