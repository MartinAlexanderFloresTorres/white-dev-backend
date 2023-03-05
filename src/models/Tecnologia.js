import { Schema, model } from 'mongoose'

const TecnologiaSchema = new Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true
    },
    imagen: {
      type: Object,
      required: true,
      default: {}
    }
  },
  {
    // Crea los campos createdAt y updatedAt
    timestamps: true
  }
)

const Tecnologia = model('Tecnologia', TecnologiaSchema)

export default Tecnologia
