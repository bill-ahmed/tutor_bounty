import uniqueValidator from 'mongoose-unique-validator';
import { prop, plugin, index, getModelForClass, Ref } from '@typegoose/typegoose';
import { UserClass } from '../user/user.model';
import { UserMeetingClass } from '../user_meeting/user_meeting.model';

@index({ by: 1 }, { unique: false })
@index({ for: 1 }, { unique: false })
@index({ meeting: 1 }, { unique: false })
export class UserRatingClass {
  @prop({ required: true, ref: () => UserClass })
  by: Ref<UserClass>;

  @prop({ required: true, ref: () => UserClass })
  for: Ref<UserClass>;

  @prop({ required: true, ref: () => UserMeetingClass })
  meeting: Ref<UserMeetingClass>

  @prop({ required: true })
  value: number;
}

const UserRating = getModelForClass(UserRatingClass, { schemaOptions: { collection: 'user_ratings', timestamps: true } })
export default UserRating;
