const express = require('express')
const app = express()
const port = 8000

app.use(express.json())

app.get('/', (request, response) => {
  response.status(200).send('Hello World')
})

// Endpoint that will connect to IBM Watson
// Request will have the text of what the person said and will respond with charlie's response
// TODO strong params middleware maybe and connect to IBM Watson
app.post('/talk', (request, response) => {
  if(request.body.text !== undefined) {
    console.log(request.body.text)
    response.status(200).send(`you sent "${request.body.text}"`)
  } else {
    response.sendStatus(400)
  }
})

app.listen(port, () => console.log(`Server up at http://localhost:${port}`))