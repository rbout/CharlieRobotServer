const express = require('express')
const app = express()
const port = 8000

app.use(express.json())

app.get('/', (request, response) => {
  response.send('Hello World')
})

app.listen(port, () => console.log(`Server up at http://localhost:${port}`))