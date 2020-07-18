import { Sequelize, Model, DataTypes, BuildOptions } from 'sequelize'

export const sequelize = new Sequelize(process.env.DATABASE_URL || (process.env.PERSONAL_DATABASE_URL as string)) // Example for postgres

export class Entry extends Model {
  public readonly id!: string // Note that the `null assertion` `!` is required in strict mode.
  public text!: string // for nullable fields
  public userId!: string
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

export class User extends Model {
  public readonly id!: string // Note that the `null assertion` `!` is required in strict mode.
  public name!: string
  public phoneNumber!: number // for nullable fields
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

export class Verification extends Model {
  public readonly id!: string // Note that the `null assertion` `!` is required in strict mode.
  public userId!: string
  public salt!: string // for nullable fields
  public codeHash!: string
  public expiryTS!: string
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

Entry.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
      allowNull: false
    },
    text: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    tableName: 'entry',
    sequelize: sequelize // passing the `sequelize` instance is required
  }
)

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false
    },
    phoneNumber: {
      type: DataTypes.STRING(16),
      allowNull: false,
      unique: true
    }
  },
  {
    tableName: 'user',
    sequelize: sequelize // passing the `sequelize` instance is required
  }
)

Verification.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
      allowNull: false
    },
    userid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      allowNull: false
    },
    salt: {
      type: DataTypes.STRING,
      allowNull: false
    },
    codeHash: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false
    },
    expiryTs: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: false
    }
  },
  {
    tableName: 'verification',
    sequelize: sequelize // passing the `sequelize` instance is required
  }
)


export async function setUpDatabase() {
  try {
    await sequelize.authenticate()
    await sequelize.sync({ force: true })
    console.log('Connection has been established successfully.')
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}
