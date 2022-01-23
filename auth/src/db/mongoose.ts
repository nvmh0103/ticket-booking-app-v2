import mongoose from 'mongoose';
mongoose.connect('mongodb://auth-mongo-srv:27017').then(message =>{
    console.log("Connected to database!")
}).catch(e => {
    console.log(e);
})

