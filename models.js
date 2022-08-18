/* const Sequelize = require('sequelize'); */
const { DataTypes } = require('sequelize');
const db = require('./db_conection.js')

/* const db = new Sequelize('cursos', 'postgres', '1005', { 
  //usuario ycontraseña son tus credenciales local MySQL
  host: 'localhost',
  dialect: 'postgres'
}); */

// IIFE
/* (async function () {
  try {
    await db.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})(); */


const Usuario = db.define('usuario', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  balance: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  }
}, { timestamps: true })

const Monto = db.define('monto', {
  valor: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  }
}, { timestamps: true })

Usuario.hasMany(Monto)
Monto.belongsTo(Usuario)

try {
  db.sync()
} catch (err) {
  console.log(`Error en la sicnronizacion`, err);
}

module.exports = { Usuario, Monto }