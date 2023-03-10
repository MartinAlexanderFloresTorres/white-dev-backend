import jwt from 'jsonwebtoken'

const checkAuth = async (req, res, next) => {
  const { authorization } = req.headers
  let token
  if (authorization && authorization.startsWith('Bearer')) {
    try {
      token = authorization.split(' ')[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = decoded
      return next()
    } catch (error) {
      console.log(error)
      return res.status(401).json({ msg: 'Token no valido' })
    }
  }

  if (!token) {
    const error = new Error('Token requerido')
    return res.status(401).json({ msg: error.message })
  }
  next()
}

export default checkAuth
