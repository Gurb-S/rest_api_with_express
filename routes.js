'use strict';

const { raw } = require('express');
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
        const course = await Course.findAll();
        console.log('SUCESSSSS')
        const courses = course.map(course => 
        [  
            course.title, 
            course.description, 
            course.estimatedTime, 
            course.materialsNeeded
        ])
        console.log(courses)
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
    const course = await Course.findOne({
        where: {
            id: id
        },
        attributes: ['title', 'description', 'estimatedTime', 'materialsNeeded'],
        raw: true
    })
    if(course){
        console.log('GOT COURSE!!!')
    }
    else if(!course){
        console.log('FAILEDDDDDD')
        res.json({
            message: 'This course does not exist'
        })
    }
    console.log(course);
    res.json({
        course
    })
}));

router.post('/courses', asyncHandler(async (req,res) => {
    try{
        await Course.create(req.body);
        console.log(req.body)
        res.status(201).json({ "message": "Course successfully created!"})
    } catch(error){
        if(error.name === 'SequelizeValidationError'){
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors })
        }
        else{
            throw error;
        }
    }
}));

router.put('/courses/:id', asyncHandler(async (req,res) => {
    const { id } = req.params;
    try{
        await Course.update(req.body, {
            where: {
                id: id
            }
        });
        console.log(req.body)
        res.status(204).json({ "message": "Course successfully updated!"})
    } catch(error){
        if(error.name === 'SequelizeValidationError'){
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors })
        }
        else{
            throw error;
        }
    }
    res.json({
        message: `This is the api/courses/${id} PUTTY Route`
    })
}));

router.delete('/courses/:id', authenticateUser, asyncHandler(async (req,res) => {
    const { id } = req.params;
    res.json({
        message: `This is the api/courses/${id} DELETE Route`
    })
}))

module.exports = router;