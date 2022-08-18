const express = require('express');
const { Usuario, Monto } = require('./models.js')
const f = require('./functionsUtils')

const app = express()

app.use(express.static('public')) // para manejo de archivos estáticos
app.use(express.urlencoded({ extended: true })) // para recibir datos de formulario POST

/* function getForm(req) {
  return new Promise((res, rej) => {
    let str = "";
    req.on("data", function (chunk) {
      str += chunk;
    });
    req.on("end", function () {
      //console.log('str', str);
      const obj = JSON.parse(str);
      res(obj);
    });
  });
} */

app.post('/usuarios', async (req, res) => {
  const nombre = req.body.nombre
  const horario = req.body.horario

  await Usuario.create({
    nombre, horario
  })

  res.redirect('/')
})

app.get('/usuarios', async (req, res) => {
  console.log('usuarios ');
  const usuarios = await Usuario.findAll({
    include: [{
      model: Monto
    }]
  })

  res.json({usuarios})
})

app.get('/transferencias', async (req, res) => {
  /* const usuarios = await Usuario.findAll({
    include: [{
      model: Monto
    }]
  }) */

  // res.json({usuarios})
  res.json({})
})

app.post('/usuarios/montos', async (req, res) => {
  const usuario_id = req.body.usuario_id
  const nombre_monto = req.body.nombre_monto

  const usuario = await Usuario.findByPk(usuario_id)
  await usuario.createMonto({
    nombre: nombre_monto
  })

  console.log(usuario);
  res.redirect('/')
})

app.get('*', (req, res) => {
  res.statusCode = 404
  res.send('Ruta no implementada')
})

app.listen(3000, () => {
  console.log(`Servidor en puerto 3000`);
});

// nodemon server
