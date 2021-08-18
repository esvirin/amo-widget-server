require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')
const fetch = require('node-fetch');
const fs = require('fs')

const client_secret = process.env.CLIENT_SECRET
const client_id = process.env.CLIENT_ID
const code = process.env.CODE
const redirect_uri = process.env.REDIRECT_URI


const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.header('Content-Type', 'application/json')
    res.header('Authorization', `${server.getToken().token_type} ${server.getToken().access_token}`)
    res.sendFile(__dirname + '/scripts/daydream.js')
    console.log('response 200')
})

class Server {

    getAuthToken = (payload) => {
        fetch(process.env.BASE_URL + 'oauth2/access_token', {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {'Content-Type': 'application/json', 'User-Agent': 'amoCRM-oAuth-client1.0'}
        })
            .then(res => res.json())
            .then(json => {
                if (json && json.access_token && json.refresh_token) {
                    fs.writeFileSync('token', JSON.stringify(json))
                    fs.writeFileSync('expires_in', JSON.stringify(Date.now() + json.expires_in * 1000))
                } else {
                    return console.error(json)
                }
            })
    }

    constructor(initialAccess) {
        const token = JSON.parse(fs.readFileSync('token'))
        if (!token) {
            console.log('start initial registration ..........')
            this.getAuthToken(initialAccess)
        } else {
            this._token = token
        }
    }

    start = () => {
        try {
            app.listen(process.env.PORT, () => {
                console.log(`server listen ${process.env.PORT}`)
            })
        } catch (e) {
            console.error(e)
        }
    }

    getToken = () => {
        return this._token
    }

    checkWhenTokenExpiresIn = () => {
        const expiresIn = fs.readFileSync('expires_in')
        if (expiresIn < 42000000) {

            this.getAuthToken({
                client_id,
                client_secret,
                redirect_uri,
                grant_type: "refresh_token",
                refresh_token: this._token.refresh_token
            })
            console.log('start to reload refresh_token ------------------')
        }
    }

}

const server = new Server({client_secret, client_id, redirect_uri, grant_type: 'authorization_code', code})
server.checkWhenTokenExpiresIn()
setTimeout(() => server.checkWhenTokenExpiresIn(), 21000000)
server.start();

