import { Router } from 'express'
import fileUpload from 'express-fileupload'
import { actualizar, crear, eliminar, mostrar } from '../controllers/tecnologiasControllers.js'
import ckeckFile from '../middlewares/checkFile.js'
import checkAuth from '../middlewares/chekcAuth.js'

const tecnologiaRouters = Router()

// CREAR
tecnologiaRouters.post('/nuevo', checkAuth, fileUpload({ useTempFiles: false }), ckeckFile, crear)

// ACTUALIZAR
tecnologiaRouters.put('/actualizar/:id', checkAuth, fileUpload({ useTempFiles: false }), ckeckFile, actualizar)

// ELIMINAR
tecnologiaRouters.delete('/eliminar/:id', checkAuth, eliminar)

// MOSTRAR
tecnologiaRouters.get('/mostrar', mostrar)

export default tecnologiaRouters
