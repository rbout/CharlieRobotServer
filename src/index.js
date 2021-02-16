const express = require('express')
const AssistantV2 = require('ibm-watson/assistant/v2');
const { IamAuthenticator } = require('ibm-watson/auth');
const app = express()
const port = 8000

app.use(express.json())

const assistant = new AssistantV2({
  version: '2020-09-24',
  authenticator: new IamAuthenticator({
    apikey: "i-a_OvPbppHrlUiu_iLXmvS6OvV7H84FEjGGmQKsEEYf",
  }),
  serviceUrl: "https://api.us-south.assistant.watson.cloud.ibm.com/instances/40539ed3-c9d7-4f58-a65b-730d16aa2ef4",
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
    assistant.createSession({assistantId: "ee080c9a-51ec-4186-b777-afd2d568ac77"})
      .then((sessionRespone) => {

        session = sessionRespone.result.session_id

        if(request.body.text !== undefined) {

          // Message is sent with sesssion id
          assistant.message({
            assistantId: "ee080c9a-51ec-4186-b777-afd2d568ac77",
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