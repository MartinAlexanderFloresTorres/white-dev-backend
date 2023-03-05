import shortid from 'shortid'
import slug from 'slug'
import Proyecto from '../models/Proyecto.js'
import deleteFile from '../cloudinary/deleteFile.js'
import mongoose from 'mongoose'

// CREAR
export const crearProyecto = async (req, res) => {
  try {
    const { nombre, repositorio, web, descripcion, contenido, tecnologias } = req.body
    const { foto } = req

    // VALIDAR
    if ([nombre, repositorio, web, descripcion, contenido].includes('')) {
      return res.status(400).json({ msg: 'Todos los campos son obligatorios' })
    }

    // PARSEAR TECNOLOGIAS
    const tecnologiasParseadas = JSON.parse(tecnologias)

    if (tecnologiasParseadas.length === 0) {
      return res.status(400).json({ msg: 'Las tecnologias son obligatorias' })
    }

    // CREAR
    const proyecto = new Proyecto({
      nombre,
      repositorio,
      web,
      descripcion,
      contenido,
      tecnologias: tecnologiasParseadas,
      imagen: foto,
      url: `${slug(nombre, { lower: true })}-${slug(shortid.generate(), { lower: true })}`
    })

    // GUARDAR
    await proyecto.save() // Quiero hacer un populate de tecnologias

    // POPULATE
    const proyectoGuardado = await proyecto.populate('tecnologias')

    // RESPONDER
    res.status(201).json(proyectoGuardado)
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: error.message })
  }
}

// OBTENER TODOS
export const obtenerProyectos = async (req, res) => {
  try {
    const { q, tecnologias, page: pageUrl } = req.query

    // query = 'nombre del proyecto'
    // tecnologias = ['react,node']

    // PAGINACION
    const limit = 12
    const page = Number(pageUrl) || 1

    const tecnologiasArray = tecnologias ? tecnologias.split(',') : []
    const tecnologiasObjectIds = tecnologiasArray.map((id) => mongoose.Types.ObjectId(id))

    if (q && tecnologias) {
      const proyectos = await Proyecto.paginate(
        {
          $or: [{ nombre: { $regex: q, $options: 'i' } }, { descripcion: { $regex: q, $options: 'i' } }, { contenido: { $regex: q, $options: 'i' } }],
          $and: [
            {
              tecnologias: { $in: tecnologiasArray }
            }
          ]
        },
        {
          limit,
          page,
          populate: 'tecnologias'
        }
      )

      return res.json(proyectos)
    }

    if (q) {
      const proyectos = await Proyecto.paginate(
        { $or: [{ nombre: { $regex: q, $options: 'i' } }, { descripcion: { $regex: q, $options: 'i' } }, { contenido: { $regex: q, $options: 'i' } }] },
        {
          limit,
          page,
          populate: 'tecnologias'
        }
      )
      return res.json(proyectos)
    }

    // FILTRAR
    if (tecnologias) {
      const proyectos = await Proyecto.paginate(
        {
          $or: [
            {
              tecnologias: { $in: tecnologiasObjectIds }
            }
          ]
        },
        {
          limit,
          page,
          populate: 'tecnologias'
        }
      )

      return res.json(proyectos)
    }

    // OBTENER TODOS CON POPULATE (TECNOLOGIAS)
    const proyectos = await Proyecto.paginate({}, { page, limit, populate: 'tecnologias' })

    res.json(proyectos)
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: error.message })
  }
}

// OBTENER UNO
export const obtenerProyecto = async (req, res) => {
  try {
    const { url } = req.params

    const proyecto = await Proyecto.findOne({ url }).populate('tecnologias')

    if (!proyecto) {
      return res.status(404).json({ msg: 'Proyecto no encontrado' })
    }

    res.json(proyecto)
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: error.message })
  }
}

// ACTUALIZAR
export const actualizarProyecto = async (req, res) => {
  try {
    const { id } = req.params
    const { nombre, repositorio, web, descripcion, contenido, tecnologias } = req.body
    const { foto } = req

    // VALIDAR
    if ([nombre, repositorio, web, descripcion, contenido].includes('')) {
      return res.status(400).json({ msg: 'Todos los campos son obligatorios' })
    }

    // PARSEAR TECNOLOGIAS
    const tecnologiasIds = JSON.parse(tecnologias)

    if (tecnologiasIds.length === 0) {
      return res.status(400).json({ msg: 'Las tecnologias son obligatorias' })
    }

    // ACTUALIZAR
    const proyecto = await Proyecto.findById(id)

    proyecto.repositorio = repositorio
    proyecto.web = web
    proyecto.descripcion = descripcion
    proyecto.contenido = contenido
    proyecto.tecnologias = tecnologiasIds

    // ACTUALIZAR URL SI EL NOMBRE CAMBIA
    if (nombre !== proyecto.nombre) {
      proyecto.nombre = nombre
      proyecto.url = `${slug(nombre, { lower: true })}-${slug(shortid.generate(), { lower: true })}`
    }

    // ELIMINAR IMAGEN DE CLONDINARY
    if (foto) {
      // ELIMINAR IMAGEN ANTERIOR
      const { public_id } = proyecto.imagen
      await deleteFile({ public_id, folder: 'white-dev/tegnologias' })
      // ACTUALIZAR IMAGEN
      proyecto.imagen = foto
    }

    // GUARDAR
    await proyecto.save()
    const proyectoActualizado = await proyecto.populate('tecnologias')

    // RESPONDER
    res.json(proyectoActualizado)
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: error.message })
  }
}

// ELIMINAR
export const eliminarProyecto = async (req, res) => {
  try {
    const { id } = req.params

    const proyecto = await Proyecto.findById(id)

    if (!proyecto) {
      return res.status(404).json({ msg: 'Proyecto no encontrado' })
    }

    // ELIMINAR IMAGEN DE CLONDINARY
    if (proyecto.imagen) {
      const { public_id } = proyecto.imagen
      await deleteFile({ public_id, folder: 'white-dev/tegnologias' })
    }

    await proyecto.delete()
    res.json({ msg: 'Proyecto eliminado' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: error.message })
  }
}
