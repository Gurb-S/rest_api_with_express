'use strict';

const auth = require('basic-auth');
const { User } = require('../models');
const bcrypt = require('bcryptjs');

exports.authenticateUser = async( req,res,next) => {
    let errorMessage; 
    const credentials = auth(req);
    console.log(credentials);
    if(credentials){
        const user = await User.findOne({
            where: {
                emailAddress: credentials.name
            }
        })
        if(user){
            const authenticated = bcrypt.compareSync(credentials.pass, user.password);

            if(authenticated){
                console.log(`Authentication successful for username: ${user.emailAddress}`);
                req.currentUser = user;
            }
            else{
                errorMessage = `Authentication failure for username: ${user.emailAddress}`;
            }
        }
        else{
            errorMessage = `User not found for username: ${credentials.name}`;
        }
    }
    else{
        errorMessage = 'Auth header not found';
    }
    if(errorMessage){
        console.warn(errorMessage);
        res.status(401).json({ message: 'Access Denied'})
    }
    else{
        next();
    }
}