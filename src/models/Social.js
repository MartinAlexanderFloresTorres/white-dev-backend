import { Schema, model } from 'mongoose'

const SocialShema = new Schema(
  {
    nombre: {
      type: String,
      required: true
    },
    enlace: {
      type: String,
      required: true
    },
    descripcion: {
      type: String,
      required: true
    },
    imagen: {
      type: Object,
      required: true,
      default: {}
    }
  },
  {
    timestamps: true
  }
)

const Social = model('Social', SocialShema)

export default Social
