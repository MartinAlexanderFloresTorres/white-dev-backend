import { Schema, model } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const ProyectoSchema = new Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true
    },
    url: {
      type: String,
      required: true,
      trim: true
    },
    repositorio: {
      type: String,
      required: true,
      trim: true
    },
    web: {
      type: String,
      required: true,
      trim: true
    },
    imagen: {
      type: Object,
      required: true,
      default: {}
    },
    descripcion: {
      type: String,
      required: true,
      trim: true
    },

    contenido: {
      type: String,
      required: true,
      trim: true
    },
    tecnologias: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Tecnologia'
      }
    ]
  },
  {
    // CREAR `createdAt` y `updatedAt`
    timestamps: true
  }
)

// PAGINACION
ProyectoSchema.plugin(mongoosePaginate)

const Proyecto = model('Proyecto', ProyectoSchema)

export default Proyecto
