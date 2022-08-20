const express = require('express')
const { Usuario, Monto } = require('./controllers/models.js')
const f = require('./controllers/functions')

const app = express()
const port = 3000

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

app.post('/usuario', async (req, res) => {

  try {
    const form = await f.getForm(req)
    const nombre = form.nombre.replace(/\s+/g, ' ').trim()
    const balance = form.balance.trim()
    if (f.usuarioValid(nombre) && f.balanceValid(balance)) {
      await Usuario.create({
        nombre,
        balance
      })
      res.json({})
    }

  } catch (error) {
    console.log("Error usuario no ingresado: " + error)
    res.status(400).json({ error })
  }
})

app.get('/usuarios', async (req, res) => {

  try {
    const usuarios = await Usuario.findAll({
      include: [{
        model: Monto
      }]
    })

    res.json(usuarios)

  } catch (error) {
    console.log(error)
  }
})

app.delete('/usuario', async (req, res) => {
  const id = req.query.id
  if (id) {
    try {
      await Usuario.destroy({
        where: { id }
      })
      res.json({})
    } catch (error) {
      console.log("Surgió un error: " + error)
      return res.status(400).redirect('/') // 400 error
    }
  }
})

app.put('/usuario', async (req, res) => {
  const form = await f.getForm(req)

  const nombre = form.name
  const balance = form.balance
  const id = req.query.id
  if (id) {

    try {
      const usuario = await Usuario.findOne({
        where: { id }
      })

      await Usuario.update(
        {
          nombre,
          balance
        },
        {
          where: { id }
        })
      res.json(usuario)


    } catch (error) {
      console.log(error)
      return res.redirect('/')
    }
  }

})

app.post('/transferencia', async (req, res) => {
  try {
    const form = await f.getForm(req)
    const emisor = form.emisor
    const receptor = form.receptor
    const valor = form.monto

    const us_emisor = await Usuario.findOne({
      where: { nombre: emisor }
    })

    if (f.balanceValid(valor, us_emisor.balance) && f.emisorValid(emisor, receptor)) {
      const usuarioId = us_emisor.id

      await Monto.create({
        valor,
        emisor,
        receptor,
        usuarioId
      })

      const usuario = await Usuario.findOne({
        where: { id: usuarioId }
      })

      const nuevo_valor = usuario.balance - valor

      await Usuario.update(
        {
          balance: nuevo_valor
        },
        {
          where: { id: usuarioId }
        })

      const us_receptor = await Usuario.findOne({
        where: { nombre: receptor }
      })

      const nuevo_valor_receptor = parseInt(us_receptor.balance) + parseInt(valor)

      await Usuario.update(
        {
          balance: nuevo_valor_receptor
        },
        {
          where: { nombre: receptor }
        })

      res.json(usuario)
    }

  } catch (error) {
    console.log("Surgió un error: " + error)
    // return res.status(400).redirect('/')
    res.status(400).json({ error })
  }
})

app.get('/transferencias', async (req, res) => {
  try {
    const montos = await Monto.findAll()
    const datos = montos.map(data => [data.id, data.emisor, data.receptor, data.valor, data.createdAt])

    res.send(datos)

  } catch (error) {
    console.log(error)
  }
})

app.use((req, res) => {
  res.status(404).send(`
  <html>
    <h2>...ruta no existe</h2>
    <a href="/">
      <button>Volver</button>
    </a>
  </html>`)
})

app.listen(port, () => {
  console.log(`Servidor en puerto http://localhost:${port}`)
})

// nodemon server
