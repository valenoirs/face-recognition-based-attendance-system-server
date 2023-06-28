import config from './config/config'
import express, { Express, Request, Response } from 'express'
import { connect } from 'mongoose'
import path from 'path'
import cors from 'cors'

// Import Routes
import { router as guruRoute } from './routes/guru'

// Init
const app: Express = express()
const port = config.PORT

// Middleware
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

// HTTP Routes
app.use('/guru', guruRoute)

// Ping
app.get('/ping', (req: Request, res: Response) => {
  console.log(`[server]: OK! ${req.headers.host} pinging the server`)
  return res.status(200).send({
    success: true,
    status: 200,
    data: {
      message: 'valenoirs',
    },
  })
})

// 404
app.use('/', (req: Request, res: Response) => {
  return res.status(404).send({
    error: true,
    status: 404,
    type: 'NotFound',
    data: {
      message: 'No API endpoint found.',
    },
  })
})

// Connect to database
connect(config.MONGO_URI)
  .then(() => {
    console.log(
      '[server]: OK! successfully-connected-to-mongodb. Starting server...'
    )
    // Server
    app.listen(port, (): void => {
      console.log(`[server]: OK! server running at port ${port}`)
    })
  })
  .catch((error) => {
    console.error('[server]: ERR! failed-connecting-to-mongo-database', error)
  })
