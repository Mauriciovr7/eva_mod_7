const { DataTypes } = require('sequelize');
const db = require('./db_conection.js')

const Usuario = db.define('usuario', {
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false
    
  },
  balance: {
    type: DataTypes.FLOAT              ,
    allowNull: false,
    validate: {
      min: 0
    }
  }
}, { timestamps: true })

const Monto = db.define('monto', {
  valor: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  emisor: {
    type: DataTypes.STRING,
    allowNull: true
  },
  receptor: {
    type: DataTypes.STRING,
    allowNull: true
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
}, { timestamps: true })

Usuario.hasMany(Monto)
Monto.belongsTo(Usuario)

try {
  db.sync()
} catch (err) {
  console.log(`Error en la sicnronizacion`, err);
}

module.exports = { Usuario, Monto }