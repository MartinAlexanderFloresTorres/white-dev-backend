import { Router } from 'express'
import { autenticarUsuario, autoLogin } from '../controllers/usuarioController.js'
import checkAuth from '../middlewares/chekcAuth.js'

const usuarioRouter = Router()

// Autenticar usuario
usuarioRouter.post('/autenticar', autenticarUsuario)

// Auto login
usuarioRouter.get('/auto-login', checkAuth, autoLogin)

export default usuarioRouter
