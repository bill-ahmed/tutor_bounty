import uniqueValidator from 'mongoose-unique-validator';
import { prop, plugin, index, getModelForClass, Ref } from '@typegoose/typegoose';
import { UserClass } from '../user/user.model';

class UserPostingClass {

  /** UserPosting belongs to a single User */
  @prop({ required: true, ref: () => UserClass })
  user: Ref<UserClass>;

  @prop({ required: true })
  title: string;
  
  @prop({ required: true })
  description: string;

  @prop({ required: true })
  startDate: Date;

  @prop({ required: true })
  startTime: Date;

  @prop({ required: true })
  duration: string;

  @prop({ required: true })
  category: string;

  @prop({ required: true })
  value: number;
}

const UserPosting = getModelForClass(UserPostingClass, { schemaOptions: { collection: 'user_postings', timestamps: true } })
export default UserPosting;
