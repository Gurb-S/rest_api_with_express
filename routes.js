'use strict';

const express = require('express');
const { asyncHandler } = require('./middleware/async-handler');
const { authenticateUser } = require('./middleware/authenticate_user')
const { User }  = require('./models');
const { Course } = require('./models');

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
        res.status(201).end();
    } catch(error){
        if(error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError'){
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
        const usersData = await User.findAll({ raw: true});
        //const usersDataJSON = usersData.toJSON();
        //const user = req.currentUser.toJSON();
        //console.log(usersData)
        const users = usersData.map(user => ({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            emailAddress: user.emailAddress
        }))
        console.log(users)
        console.log('SUCESSSSS')
        const courses = course.map(course => 
        ({  
            title: course.title,
            description: course.description,
            estimatedTime: course.estimatedTime,
            materialsNeeded: course.materialsNeeded,
            userId: course.userId,
            owner: {

            }
            // if(course.userId === users.id){
            //     return { firstName: users.firstName, lastName: users.lastName }
            // }
        }))
        console.log(courses)
        // courses.users.push("test user")
        for(let i = 0; i < courses.length; i++){
            //console.log(`${users[0].id}`)
           // console.log(i)
           for(let j = 0; j < users.length; j++){
            if(courses[i].userId === users[j].id){
                //console.log(`${users[i].id}`)
                courses[i].owner['name'] = `${users[j].firstName} ${users[j].lastName}`,
                courses[i].owner['emailAddress'] = users[j].emailAddress
            }
           }
        }
        //courses[0].users['Owner 1'] = users[0].firstName;
        //console.log(courses[3].description)
        res.json({
            courses
        })
    } catch(error){
        console.log('ERORRRRRRRRR')
        if(error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError'){
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

router.post('/courses', authenticateUser, asyncHandler(async (req,res) => {
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

router.put('/courses/:id', authenticateUser, asyncHandler(async (req,res) => {
    const { id } = req.params;
    const { userId } = req.body;
    const user = req.currentUser.toJSON();
    console.log(user)
    try{
        const course = await Course.findOne({
            where: {
                id: id,
                userId: user.id
            }
        })
        if(course){
            await Course.update(req.body, {
                where: {
                    id: id
                }
            });
            console.log(req.body)
            console.log('UPDATEDDDDDDDDD')
            res.status(204).end();
        }
        else{
            console.log('DENIEDDDDDDD')
            res.status(403).json({ "message": "You are not the owner of this course!"})
        }

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

router.delete('/courses/:id', authenticateUser, asyncHandler(async (req,res) => {
    const { id } = req.params;
    const { userId } = req.body;
    const user = req.currentUser.toJSON();
    console.log(user)
    try{
        const course = await Course.findOne({
            where: {
                id: id,
                userId: user.id
            }
        })
        if(course){
            await Course.destroy({
                where: {
                    id: id
                }
            });
            console.log(req.body)
            res.status(204)
            console.log('GONNNNNNNEEEE')
        }
        else{
            console.log('BETTERRR LUCK NEXT TIME')
            res.status(403).json({ "message": "You are not the owner of this course!"});
        }

    } catch(error){
        if(error.name === 'SequelizeValidationError'){
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors })
        }
        else{
            throw error;
        }
    }
}))

module.exports = router;