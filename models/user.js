'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        is: /^[a-z]+$/i,
        notNull: true,
      },
      set(val) {
      this.setDataValue('firstName', val.charAt(0).toUpperCase() + val.slice(1));
    }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        is: /^[a-z]+$/i,
        notNull: true,
      },
      set(val) {
      this.setDataValue('lastName', val.charAt(0).toUpperCase() + val.slice(1));
    }
    },
    emailAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        isEmail: true,
        notNull: true,
      },
      set(val) {
      this.setDataValue('emailAddress', val.toLowerCase());
    }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        notNull: true,
      }
    }
  }, {sequelize});
  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.Course, {
      as: 'owner',
      foreignKey: {
        fieldName: 'userId',
      },
    });
  };
  return User;
};
