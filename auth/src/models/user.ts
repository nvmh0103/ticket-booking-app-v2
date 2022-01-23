import mongoose from 'mongoose';
import {Password} from '../services/password'

// Interface for User
interface UserAttrs {
    email: String,
    password: String,
}

// Interface for users model
interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc;
}

// Interface for user docs
interface UserDoc extends mongoose.Document{
    email: string;
    password: string;
}

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    }
}, {
    toJSON: {
        transform(doc, ret){
            ret.id = ret._id;
            delete ret._id;
            delete ret.password;
            delete ret.__v;
        }
    }
});

userSchema.pre('save', async function(done) {
   if (this.isModified('password')){
       const hashed = await Password.toHash(this.get('password'));
       this.set('password', hashed);
   } 
   done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs);
};


const User = mongoose.model<UserDoc, UserModel>('User', userSchema);



export {User};