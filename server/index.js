'use strict'
import compression from 'compression'
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { connectDB } from './config'
import { router } from './routes'

const app = express();

app.use(compression())
app.disable('etag')
app.use(morgan('tiny'))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(
  cors({
    origin: '*',
    optionsSuccessStatus: 200
  })
)
app.use(helmet({ hsts: false }))
app.use(
  helmet.hsts({
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  })
)
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"]
    }
  })
)


app.get('/', (req, res)=>{
    console.log('erlcom')
       res.send('hello world') 

})

connectDB()
app.use('/', router)

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})