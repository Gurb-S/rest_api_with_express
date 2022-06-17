'use strict';

const express = require('express');
const res = require('express/lib/response');
const { asyncHandler } = require('./middleware/async-handler');
const { authenticateUser } = require('./middleware/authenticate_user')
const { User } = require('./models');
const { Courses } = require('./models');
//const user = require('./models/user');

const router = express.Router();

router.get('/users', authenticateUser, asyncHandler(async (req,res) => {
    //const user = req.currentUser;

    res.json({
        message: 'This is the api/users GET Route'
    });
}));

router.post('/users', asyncHandler(async (req,res) => {
    res.json({
        message: 'This is the api/users POST Route'
    })
}));

router.get('/courses', asyncHandler(async (req,res) => {
    res.json({
        message: 'This is the api/courses GET Route'
    })
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