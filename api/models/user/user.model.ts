import uniqueValidator from 'mongoose-unique-validator';
import { prop, plugin, index, getModelForClass, Ref } from '@typegoose/typegoose';
import { isEqual } from '../../utils/crypto';

@index({ email: 1 }, { unique: true })
@index({ username: 1 }, { sparse: true })
@index({ authId: 1}, { sparse: true })
@plugin(uniqueValidator)
export class UserClass {

    @prop({ })
    password!: string

    // 'unique' is NOT a validator! https://mongoosejs.com/docs/validation.html#the-unique-option-is-not-a-validator
    @prop({ required: true, unique: true, uniqueCaseInsensitive: true })
    email!: string;

    @prop({ unique: true, uniqueCaseInsensitive: true })
    username: string;

    @prop({ })
    name: string;

    @prop({ default: 'local' })
    authProvider?: string;

    @prop({ })
    authId?: string;   /** Uniquely identify user when logging in from 3rd-party auth */

    @prop({ default: false })
    emailVerified: boolean

    @prop({ })
    profileImageURL: string

    public validPassword(pass: string): boolean {
        return isEqual(pass, this.password);
    }
}

/** Add validations **/

/** User model. */
const User = getModelForClass(UserClass, { schemaOptions: { collection: 'users', timestamps: true } });
export default User;
