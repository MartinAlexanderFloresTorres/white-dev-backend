import jwt from 'jsonwebtoken'

// Autenticar usuario
export const autenticarUsuario = async (req, res) => {
  try {
    const { email, password } = req.body

    // VALIDAR
    if (email.trim() === '' || password.trim() === '') return res.status(400).json({ msg: 'Todos los campos son obligatorios' })

    // VERIFICAR SI ES ADMIN
    if (email !== process.env.ADMIN_EMAIL) {
      return res.status(400).json({ msg: 'No tienes permisos para acceder' })
    }

    // VERIFICAR SI EL PASSWORD ES CORRECTO
    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(400).json({ msg: 'Password incorrecto' })
    }

    // CREAR TOKEN
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    })

    // RESPUESTA
    res.json({ token })
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: error.message })
  }
}

// AUTO LOGIN
export const autoLogin = async (req, res) => {
  try {
    const { user } = req

    if (!user) return res.status(401).json({ msg: 'No autorizado' })

    // VERIFICAR SI ES ADMIN
    if (user.email !== process.env.ADMIN_EMAIL) {
      return res.status(400).json({ msg: 'No tienes permisos para acceder' })
    }

    res.json({ msg: 'Autenticado' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: error.message })
  }
}
