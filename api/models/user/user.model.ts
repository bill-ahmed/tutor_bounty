import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import { prop, plugin, index, getModelForClass, Ref } from '@typegoose/typegoose';
import { isEqual } from '../../utils/crypto';

@index({ email: 1 }, { unique: true })
@plugin(uniqueValidator)
class UserClass {

    @prop({ required: true })
    password!: string

    // 'unique' is NOT a validator! https://mongoosejs.com/docs/validation.html#the-unique-option-is-not-a-validator
    @prop({ required: true, unique: true, uniqueCaseInsensitive: true })
    email!: string;

    @prop({ })
    firstName: string;

    @prop({ })
    lastName: string;

    public validPassword(pass: string): boolean {
        return isEqual(pass, this.password);
    }
}

/** Add validations **/

/** User model. */
const User = getModelForClass(UserClass, { schemaOptions: { timestamps: true } });
export default User;
