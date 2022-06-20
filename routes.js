'use strict';

const express = require('express');
const res = require('express/lib/response');
const { asyncHandler } = require('./middleware/async-handler');
const { authenticateUser } = require('./middleware/authenticate_user')
const { User }  = require('./models');
const { Course } = require('./models');
//const user = require('./models/user');

const router = express.Router();

router.get('/users', authenticateUser, asyncHandler(async (req,res) => {
    const user = req.currentUser;

    res.json({
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.emailAddress
    });
}));

router.post('/users', asyncHandler(async (req,res) => {
    try{
        await User.create(req.body);
        res.status(201).json({ "message": "Account successfully created!"})
    } catch(error){
        if(error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueComstraintError'){
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors })
        }
        else{
            throw error;
        }
    }
}));

router.get('/courses', asyncHandler(async (req,res) => {
    try{
        const courses = await Course.findAll();
        console.log('SUCESSSSS')
        const coursed = courses.map(course => { 
            course.title, 
            course.description,
            course.estimatedTime
        })
        console.log(coursed)
        res.json({
            courses
        })
    } catch(error){
        console.log('ERORRRRRRRRR')
        if(error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueComstraintError'){
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors })
        }
        else{
            throw error;
        }
    }
}));

router.get('/courses/:id', asyncHandler(async (req,res) => {
    const { id } = req.params;
    res.json({
        message: `This is the api/courses/${id} GET Route`
    })
}));

router.post('/courses', authenticateUser, asyncHandler(async (req,res) => {
    res.json({
        message: 'This is the api/courses POST Route'
    })
}));

router.put('/courses/:id', authenticateUser, asyncHandler(async (req,res) => {
    const { id } = req.params;
    res.json({
        message: `This is the api/courses/${id} PUT Route`
    })
}));

router.delete('/courses/:id', authenticateUser, asyncHandler(async (req,res) => {
    const { id } = req.params;
    res.json({
        message: `This is the api/courses/${id} DELETE Route`
    })
}))

module.exports = router;