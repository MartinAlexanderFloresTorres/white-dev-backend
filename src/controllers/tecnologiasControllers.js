import deleteFile from '../cloudinary/deleteFile.js'
import Tecnologia from '../models/Tecnologia.js'

// CREAR
export const crear = async (req, res) => {
  try {
    const { foto } = req
    const { nombre } = req.body

    // Validar
    if (!nombre) {
      return res.status(400).json({ msg: 'El nombre es obligatorio' })
    }

    // Crear tecnologia
    const tecnologia = new Tecnologia({ nombre, imagen: foto })

    // Guardar tecnologia
    const tecnologiaGuardada = await tecnologia.save()

    res.json(tecnologiaGuardada)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ msg: 'Error al crear la tecnología' })
  }
}

// ACTUALIZAR
export const actualizar = async (req, res) => {
  try {
    const { id } = req.params
    const { foto } = req
    const { nombre, public_id } = req.body

    // Validar
    if (!nombre) {
      return res.status(400).json({ msg: 'El nombre es obligatorio' })
    }

    // Actualizar tecnologia
    const tegnologia = await Tecnologia.findById(id)

    // Actualizar datos
    tegnologia.nombre = nombre
    if (foto) {
      tegnologia.imagen = foto
      // Eliminar imagen de cloudinary
      if (public_id) {
        await deleteFile({ public_id, folder: 'white-dev' })
      }
    }

    // Guardar tecnologia
    const tecnologiaActualizada = await tegnologia.save()

    res.json(tecnologiaActualizada)
  } catch (error) {
    return res.status(500).json({ msg: error.message })
  }
}

// ELIMINAR
export const eliminar = async (req, res) => {
  try {
    const { id } = req.params

    // Eliminar tecnologia
    const tecnologia = await Tecnologia.findById(id)

    // Eliminar imagen de cloudinary
    if (tecnologia.imagen.public_id) {
      const { public_id } = tecnologia.imagen
      await deleteFile({ public_id, folder: 'white-dev' })
    }

    // Eliminar tecnologia
    await tecnologia.delete()

    res.json({ msg: 'Tecnología eliminada' })
  } catch (error) {
    return res.status(500).json({ msg: error.message })
  }
}

// mostrar
export const mostrar = async (req, res) => {
  try {
    const tecnologias = await Tecnologia.find()
    res.json(tecnologias)
  } catch (error) {
    return res.status(500).json({ msg: error.message })
  }
}
