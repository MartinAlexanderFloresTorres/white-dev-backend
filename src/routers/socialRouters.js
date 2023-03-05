import { Router } from 'express'
import { deleteSocial, newSocial, showSocial, updateSocial } from '../controllers/socialControllers.js'
import ckeckFile from '../middlewares/checkFile.js'
import fileUpload from 'express-fileupload'
import checkAuth from '../middlewares/chekcAuth.js'

const socialRouters = Router()

// Show a social
socialRouters.get('/', showSocial)

// Create a new social
socialRouters.post('/crear', checkAuth, fileUpload({ useTempFiles: false }), ckeckFile, newSocial)

// Update a social
socialRouters.put('/actualizar/:id', checkAuth, fileUpload({ useTempFiles: false }), ckeckFile, updateSocial)

// Delete a social
socialRouters.delete('/eliminar/:id', checkAuth, deleteSocial)

export default socialRouters
