import mongoose from 'mongoose';
if (!process.env.MONGO_URI){
    throw new Error('Missing connection string!');
}
mongoose.connect(process.env.MONGO_URI).then(message =>{
    console.log("Connected to database!")
}).catch(e => {
    console.log(e);
})

