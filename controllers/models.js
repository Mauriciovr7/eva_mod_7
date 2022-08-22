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

const Transferencia = db.define('transferencia', {
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

Usuario.hasMany(Transferencia)
Transferencia.belongsTo(Usuario, { foreignKey: "emisor", onDelete: 'CASCADE' })
Transferencia.belongsTo(Usuario, { foreignKey: "receptor", onDelete: 'CASCADE' })

try {
  db.sync()
} catch (err) {
  console.log(`Error en la sicnronizacion`, err)
}

// mas fácil y rápido con emisor y receptor como string con nombres de los usuarios, así se hace la union sólo con fkey automática de sequelize (usuarioId)
module.exports = { Usuario, Transferencia }