'use strict';

const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    
    class Course extends Model {}
    Course.init({
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'A title is required'
                },
                notEmpty: {
                    msg: 'Please provide a title'
                }
            }
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        estimatedTime: {
            type: DataTypes.STRING,
        },
        materialsNeeded: {
            type: DataTypes.STRING
        }
    }, { sequelize })
    return Course;
}