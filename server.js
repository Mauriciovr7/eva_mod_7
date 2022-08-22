const express = require('express')
const { Usuario, Monto } = require('./controllers/models.js')
const f = require('./controllers/functions')

const app = express()
const port = 3000

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

// usuario POST
app.post('/usuario', async (req, res) => {

  try {

    const form = await f.getForm(req)
    const nombre = form.nombre.replace(/\s+/g, ' ').trim()
    const balance = form.balance.trim()

    if (f.usuarioValid(nombre) && f.balanceValid(balance)) {

      const usName = await Usuario.findOne({
        where: { nombre },
        include: [{
          model: Monto
        }]
      })

      if (usName != null) { if (usName.nombre) { throw 'usuario ya existe' } }

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

// usuarios GET
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

// usuario PUT
app.put('/usuario', async (req, res) => {
  const form = await f.getForm(req)

  const nombre = form.name
  const balance = form.balance
  const id = req.query.id
  if (id) {

    try {
      const usuario = await Usuario.findOne({
        where: { id },
        include: [{
          model: Monto
        }]
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

// usuario DELETE
app.delete('/usuario', async (req, res) => {
  const id = req.query.id
  if (id) {
    try {

      await Monto.destroy({
        where: { emisor: id }
      })

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

// transferencia POST
app.post('/transferencia', async (req, res) => {
  try {
    const form = await f.getForm(req)
    const emisor = form.emisor
    const receptor = form.receptor
    const valor = form.monto

    const us_emisor = await Usuario.findOne({
      where: { nombre: emisor },
      include: [{
        model: Monto
      }]
    })

    if (f.balanceValid(valor, us_emisor.balance) && f.emisorValid(emisor, receptor)) {

      const us_receptor = await Usuario.findOne({
        where: { nombre: receptor },
        include: [{
          model: Monto
        }]
      })

      await Monto.create({
        valor,
        emisor: us_emisor.id,
        receptor: us_receptor.id
      })

      const usuario = await Usuario.findOne({
        where: { id: us_emisor.id },
        include: [{
          model: Monto
        }]
      })

      const nuevo_valor = usuario.balance - valor

      await Usuario.update(
        {
          balance: nuevo_valor
        },
        {
          where: { id: us_emisor.id }
        })
      const nuevo_valor_receptor = parseInt(us_receptor.balance) + parseInt(valor)

      await Usuario.update(
        {
          balance: nuevo_valor_receptor
        },
        {
          where: { id: us_receptor.id }
        })
      res.json(usuario)
    }

  } catch (error) {
    res.status(400).json({ error })
  }
})

// transferencias GET
app.get('/transferencias', async (req, res) => {
  try {
    const montos = await Monto.findAll({ include: 'usuario' })

    let datos = []
    for (const monto of montos) {
      emisor = await Usuario.findOne({
        where: { id: monto.emisor } }, { attributes: ['nombre'],
        include: [{
          model: Monto
        }]
      })

      receptor = await Usuario.findOne({
        where: { id: monto.receptor } }, { attributes: ['nombre'],
        include: [{
          model: Monto
        }]
      });
      (receptor === null) ? receptor = 'Eliminado' : receptor = receptor.nombre
      emisor = emisor.nombre
      datos.push([monto.id, emisor, receptor, monto.valor, monto.createdAt])
  }

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
