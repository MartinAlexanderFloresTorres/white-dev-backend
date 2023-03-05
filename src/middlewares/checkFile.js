import { writeFileSync, unlinkSync } from 'fs'
import shortid from 'shortid'
import validarImagenes from '../helpers/validarImagenes.js'
import uploadFile from '../cloudinary/uploadFile.js'

const ckeckFile = async (req, res, next) => {
  // validar si hay archivos
  if (req.files) {
    // validar si hay imagen
    if (req.files.file) {
      // Obtener imagen
      const { file } = req.files

      // Obtener extencion
      const extencion = file.name.split('.').pop()

      // Validar extencion
      if (!validarImagenes({ tipo: file.mimetype })) {
        return res.status(400).json({ msg: 'La extención no es válida' })
      }

      // Generar nombre con la ruta
      const path = `./public/uploads/${shortid.generate()}.${extencion}`

      // Guardar imagen
      writeFileSync(path, file.data)

      // Subir imagen
      const data = await uploadFile({ path, folder: 'white-dev' })

      // Extraer datos
      const { public_id, secure_url, original_filename } = data
      // Guardar el el req.foto
      req.foto = { public_id, secure_url, original_filename }

      // Eliminar imagen
      unlinkSync(path)
    }
  }

  next()
}

export default ckeckFile
