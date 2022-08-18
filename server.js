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

app.post('/usuario', async (req, res) => {
  /* const nombre = req.body.nombre
  const horario = req.body.horario

  await Usuario.create({
    nombre, horario
  }) */

  res.redirect('/')
  try {
    // 1. me traigo los datos del formulario
    const form = await f.getForm(req)
    console.log('post us ', form)

    // 2. uso el modelo ppara crear un registro en la base de datos
    await Usuario.create({
      nombre: form.nombre,
      balance: form.balance
    })
    res.redirect('/')
    //res.json({})

  } catch (error) {
    console.log("Surgió un error: " + error);
    return res.status(400).redirect('/');
  }
})

app.get('/usuarios', async (req, res) => {

  try {
    console.log('usuarios ssss ');
    const usuarios = await Usuario.findAll({
      include: [{
        model: Monto
      }]
    })
    console.log('usuarios ssss ', usuarios.rows);

    // res.json({ usuarios })
    res.json( usuarios )

    /* const ejercicio = await ejercicios.findAll()
    res.json({ rows: ejercicio }) */

  } catch (error) {
    console.log(error)
  }
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
