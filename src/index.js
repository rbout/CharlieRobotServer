const express = require('express')
const AssistantV2 = require('ibm-watson/assistant/v2');
const { IamAuthenticator } = require('ibm-watson/auth');
const cors = require('cors')
require('dotenv').config()
const app = express()
const port = 8000

app.use(express.json())
app.use(cors({origin: true}))

const assistant = new AssistantV2({
  version: '2020-09-24',
  authenticator: new IamAuthenticator({
    apikey: process.env.API,
  }),
  serviceUrl: process.env.URL,
});

app.get('/', (request, response) => {
  response.status(200).send('Hello World')
})

// Endpoint that will connect to IBM Watson
// Request will have the text of what the person said and will respond with charlie's response
// TODO strong params middleware maybe and have a better solution with the session id
app.post('/talk', (request, response) => {
  let session = ''
  if(request.body.session === undefined) {
    // Session is needed to message IBM Watson
    assistant.createSession({assistantId: process.env.ASSISTANTID})
      .then((sessionRespone) => {

        session = sessionRespone.result.session_id

        if(request.body.text !== undefined) {

          // Message is sent with sesssion id
          assistant.message({
            assistantId: process.env.ASSISTANTID,
            sessionId: session,
            input: {
              message_type: 'text',
              text: request.body.text
            }
          })
            .then(res => {
              // Successful response
              response.status(200).send(res.result.output.generic[0].text)
            })
            .catch(err => {
              console.log(err);
              response.sendStatus(400)
            })
        } else {
          response.sendStatus(400)
        }
      })
  } else {
    response.sendStatus(400)
  }
})

app.listen(port, () => console.log(`Server up at http://localhost:${port}`))