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
  if (user.length > 50){
    throw 'usuario debe contener maximo 50 caracteres'
  } else if (isNaN(user)) {
    return true
  } else  {
    throw 'usuario debe empezar con letra'
  }
}

const balanceValid = (balance, valor) => {
  const regex = new RegExp('^[0-9]+([.][0-9]+)?$')
  if (balance <= 0) {
    throw 'monto no puede ser menor o igual a 0'
  } else if (!regex.test(balance)) {
    throw 'balance debe ser en formato de numero (decimales con punto (.))'
  } else if (balance > valor) {
    throw 'monto exedido'
  } else {
    return true
  }
}

const emisorValid = (emisor, receptor) => {
  if (emisor == receptor) {
    throw 'receptor no debe ser igual a emisor'
  } else {
    return true
  }
}

module.exports = { getForm, usuarioValid, balanceValid, emisorValid }
