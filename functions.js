function getForm(req) {
  return new Promise((res, rej) => {
    let str = ''
    req.on('data', function (chunk) {
      str += chunk
    })
    req.on('end', function () {
      const obj = JSON.parse(str)
      res(obj)
    })
  })
}

const usuarioValid = (user) => {
  console.log('userVal ', user)
  if (isNaN(user)) {
    return true
  } else {
    throw 'usuario debe empezar con letra'
  }
}

const balanceValid = (balance, valor) => {
  console.log('balanceVal ************ ', valor)

  console.log('balanceVal ', balance)
  const regex = new RegExp('^[0-9]+([.][0-9]+)?$')
  if (!regex.test(balance)) {
    throw 'balance debe ser en formato de numero(decimales con punto (.))'
  } else if (balance < 1) {
    throw 'monto no puede ser menor a 1'
  } else if (balance > valor) {
    throw 'monto exedido'
  } else {
    return true
  }
}

const emisorValid = (emisor, receptor) => {
  console.log('emisorVal ', emisor, receptor)
  if (emisor == receptor) {
    throw 'receptor no debe ser igual a emisor'
  } else {
    return true
  }
}
/* if (emisor == receptor || us_emisor.balance < valor) {
  console.log('mismo');
  return res.send('mismo o mucho')
} */

module.exports = { getForm, usuarioValid, balanceValid, emisorValid }
