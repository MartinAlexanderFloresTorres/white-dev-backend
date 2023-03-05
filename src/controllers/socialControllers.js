import deleteFile from '../cloudinary/deleteFile.js'
import Social from '../models/Social.js'

// Crear
export const newSocial = async (req, res) => {
  try {
    const { nombre, enlace, descripcion } = req.body
    const { foto } = req

    // Validar
    if (!nombre || !enlace || !descripcion || !foto) {
      return res.status(400).json({ msg: 'Todos los campos son obligatorios' })
    }

    // Crear
    const social = new Social({
      nombre,
      enlace,
      descripcion,
      imagen: foto
    })

    // Guardar
    const socialGuardado = await social.save()

    // Respuesta
    res.status(201).json(socialGuardado)
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

// Actualizar
export const updateSocial = async (req, res) => {
  try {
    const { id } = req.params
    const { nombre, enlace, descripcion } = req.body
    const { foto } = req

    // Validar
    if (!nombre || !enlace || !descripcion) {
      return res.status(400).json({ msg: 'Todos los campos son obligatorios' })
    }

    // Actualizar
    const social = await Social.findById(id)

    if (!social) {
      return res.status(404).json({ msg: 'No existe el social' })
    }

    social.nombre = nombre
    social.enlace = enlace
    social.descripcion = descripcion

    // Actualizar imagen
    if (foto) {
      // Eliminar imagen de cloudinary
      const { public_id } = social.imagen
      await deleteFile({ public_id, folder: 'white-dev' })

      social.imagen = foto
    }

    // Guardar
    const socialActualizado = await social.save()

    // Respuesta
    res.status(200).json(socialActualizado)
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

// Eliminar
export const deleteSocial = async (req, res) => {
  try {
    const { id } = req.params

    // Eliminar
    const social = await Social.findById(id)

    if (!social) {
      return res.status(404).json({ msg: 'No existe el social' })
    }

    // Eliminar imagen de cloudinary
    const { public_id } = social.imagen

    // Eliminar al mismo tiempo
    await Promise.all([deleteFile({ public_id, folder: 'white-dev' }), social.delete()])

    // Respuesta
    res.status(200).json({ ok: true })
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

// Mostar
export const showSocial = async (req, res) => {
  try {
    const socials = await Social.find()

    res.status(200).json(socials)
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}
