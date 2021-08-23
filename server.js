require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')
const fetch = require('node-fetch');
const fs = require('fs')
const readFilePromisify = filename => fs.promises.readFile(filename, 'utf-8')

// ENVIRONMENTS
const client_secret = process.env.CLIENT_SECRET
const client_id = process.env.CLIENT_ID
const code = process.env.CODE
const redirect_uri = process.env.REDIRECT_URI

// EXPRESS SETTINGS
const app = express()
app.use(cors())
app.use(express.json())


// MAIN ENDPOINT
app.get('/', (req, res) => {
    res.header('Content-Type', 'application/json')
    res.header('Authorization', `${server.getToken().token_type} ${server.getToken().access_token}`)
    res.sendFile(__dirname + '/script/daydream.js')
    console.log('response 200')
})

class Server {
    // API OAUTH_2.0
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
                    console.log('successful registration -------')
                    return json
                } else {
                    return console.error(json)
                }
            }).then(json => fs.writeFileSync('expires_in', JSON.stringify(Date.now() + json.expires_in * 1000)))
            .catch(e => console.error(e))

    }

// SAFETY SINGLETON
    #token = null

    constructor(initialAccess) {
        let token = null
        try {
            token = fs.readFileSync('token')
        } catch (e) {
            console.log('...need registration or fs cannot read token')
            console.log('try initial registration ..........')
            this.getAuthToken(initialAccess)
        } finally {
            if (token) this.#token = JSON.parse(token)
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
        return this.#token
    }

    checkWhenTokenExpiresIn = () => {
        const expiresIn = readFilePromisify('expires_in')
            .then(data => {
                // LESS THEN 12 HOURS
                if (data < 42000000) {
                    console.log('start to reload refresh_token ------------------')
                    this.getAuthToken({
                        client_id,
                        client_secret,
                        redirect_uri,
                        grant_type: "refresh_token",
                        refresh_token: this.#token.refresh_token
                    })
                }
            })
            .catch(e => console.error(e))
    }
}

const server =  new Server({client_secret, client_id, redirect_uri, grant_type: 'authorization_code', code})
server.checkWhenTokenExpiresIn()
server.start()




