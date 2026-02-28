import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import destinationsRouter from './routes/destinations.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

app.use('/public', express.static('./public'))
app.use('/scripts', express.static('./public/scripts'))

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public/index.html'), (err) => {
    if (err) res.status(500).send('<h1>App not built</h1><p>Run <code>npm run build</code> in the client folder first.</p>')
  })
})

app.use('/destinations', destinationsRouter)

app.use((req, res) => {
  const notFoundPath = path.resolve(__dirname, 'public/404.html')
  res.status(404).sendFile(notFoundPath, (err) => {
    if (err) res.status(404).send('<h1>404 Not Found</h1>')
  })
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`)
})
