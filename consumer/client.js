const request = require('superagent')
const API_HOST = process.env.API_HOST || 'http://localhost'
const API_PORT = process.env.API_PORT || 9123
const API_ENDPOINT = `${API_HOST}:${API_PORT}`

var updates = [{id: 1, text: "hello"}];

const fetchProviderData = _ => {
  return request
    .get(`${API_ENDPOINT}/updates`)
    .then(res => {return res.body})
}

module.exports = {
  fetchProviderData,
}