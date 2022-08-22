const express = require('express')
const { Usuario, Transferencia } = require('./controllers/models.js')
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
          model: Transferencia
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
        model: Transferencia
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
      if (f.usuarioValid(nombre) && f.balanceValid(balance)) {
        const usuario = await Usuario.findOne({
          where: { id },
          include: [{
            model: Transferencia
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

      }

    } catch (error) {
      console.log("Error usuario no ingresado: " + error)
      res.status(400).json({ error })
    }
  }

})

// usuario DELETE
app.delete('/usuario', async (req, res) => {
  const id = req.query.id
  if (id) {
    try {

      await Transferencia.destroy({
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
        model: Transferencia
      }]
    })

    if (f.balanceValid(valor, us_emisor.balance) && f.emisorValid(emisor, receptor)) {

      const us_receptor = await Usuario.findOne({
        where: { nombre: receptor },
        include: [{
          model: Transferencia
        }]
      })

      await Transferencia.create({
        valor,
        emisor: us_emisor.id,
        receptor: us_receptor.id
      })

      const usuario = await Usuario.findOne({
        where: { id: us_emisor.id },
        include: [{
          model: Transferencia
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
    const transferencias = await Transferencia.findAll({ include: 'usuario' })

    let datos = []
    for (const transferencia of transferencias) {
      emisor = await Usuario.findOne({
        where: { id: transferencia.emisor }
      }, {
        attributes: ['nombre'],
        include: [{
          model: Transferencia
        }]
      })

      receptor = await Usuario.findOne({
        where: { id: transferencia.receptor }
      }, {
        attributes: ['nombre'],
        include: [{
          model: Transferencia
        }]
      });
      (receptor === null) ? receptor = 'Eliminado' : receptor = receptor.nombre
      emisor = emisor.nombre
      datos.push([transferencia.id, emisor, receptor, transferencia.valor, transferencia.createdAt])
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
