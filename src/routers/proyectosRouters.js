import { Router } from 'express'
import { actualizarProyecto, crearProyecto, eliminarProyecto, obtenerProyecto, obtenerProyectos } from '../controllers/proyectosControllers.js'
import fileupload from 'express-fileupload'
import ckeckFile from '../middlewares/checkFile.js'
import checkAuth from '../middlewares/chekcAuth.js'

const proyectosRouters = Router()

// Crear un proyecto
proyectosRouters.post('/', checkAuth, fileupload({ useTempFiles: false }), ckeckFile, crearProyecto)

// Obtener todos los proyectos
proyectosRouters.get('/', obtenerProyectos)

// Obtener un proyecto
proyectosRouters.get('/:url', obtenerProyecto)

// Actualizar un proyecto
proyectosRouters.put('/:id', checkAuth, fileupload({ useTempFiles: false }), ckeckFile, actualizarProyecto)

// Eliminar un proyecto
proyectosRouters.delete('/:id', checkAuth, eliminarProyecto)

export default proyectosRouters
