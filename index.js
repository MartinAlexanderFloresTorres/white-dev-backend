import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { v2 as cloudinary } from 'cloudinary'
import tecnologiaRouters from './src/routers/tecnologiasRouters.js'
import proyectosRouters from './src/routers/proyectosRouters.js'
import socialRouters from './src/routers/socialRouters.js'
import conectarDB from './src/config/conectarDB.js'
import usuarioRouter from './src/routers/usuarioRouter.js'

// EXPRESS
const app = express()

// DOTENV
dotenv.config()

// JSON
app.use(express.json())

// CORS
app.use(cors({ origin: process.env.FRONTEND_URL }))

// CLOUDINARY
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
  secure: true
})

// MONGO DB
conectarDB()

// RUTAS
app.use('/api/tecnologias', tecnologiaRouters)
app.use('/api/proyectos', proyectosRouters)
app.use('/api/socials', socialRouters)
app.use('/api/usuarios', usuarioRouter)

// PORT
const PORT = process.env.PORT || 4000

// LISTEN
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
