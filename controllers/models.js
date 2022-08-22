const { DataTypes } = require('sequelize')
const db = require('./db_conection.js')

const Usuario = db.define('usuario', {
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
    
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
    type: DataTypes.INTEGER,
    allowNull: false
  },
  receptor: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Usuario,
      key: 'id'
  }, 
  },
}, { timestamps: true })

Usuario.hasMany(Monto)
Monto.belongsTo(Usuario, { foreignKey: "emisor", onDelete: 'CASCADE' })
Monto.belongsTo(Usuario, { foreignKey: "receptor", onDelete: 'CASCADE' })

try {
  db.sync()
} catch (err) {
  console.log(`Error en la sicnronizacion`, err)
}

module.exports = { Usuario, Monto }