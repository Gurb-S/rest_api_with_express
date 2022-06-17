'use strict';

const { Model, DataTypes } = require('sequelize');

const { bcrypt } = require('bcryptjs')


module.exports = (sequelize) =>{
    class User extends Model {}
    User.init({
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'A first name is required'
                },
                notEmpty: {
                    msg: 'Please provide a name'
                }
            }
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'A last name is required'
                },
                notEmpty: {
                    msg: 'Please provide a last name'
                }
            }
        },
        emailAddress: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                msg: 'Please provide a different email. This email has already been used'
            },
            validate: {
                isEmail: {
                    msg: 'Please provide a valid email address'
                },
                notNull: {
                    msg: 'An email address is required'
                },
            }
        },
        password: {
            type: DataTypes.VIRTUAL,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'A  password is required'
                },
                notEmpty: {
                    msg: 'Please provide a password'
                },
                len: {
                    args: [12,128],
                    msg: 'The password should be between 12 and 128 characters in length'
                }
            }
        },
        confirmedPassword: {
            type: DataTypes.STRING,
            allowNull: false,
            set(val) {
                if( val === this.password) {
                    const hashedPassword = bcrypt.hashSync(val, 10);
                    this.setDataValue('confirmedPassword', hashedPassword);
                }
            },
            validate: {
                notNull: {
                    msg: 'Both passwords must match'
                }
            }
        }
    }, { sequelize });
    
    User.associate = (models) => {
        User.hasMany(models.Course, {
            foreignKey: {
                fieldName: 'userId',
                allowNull: false
            }
        });
    }

    return User;
}

