import { prop, plugin, index, getModelForClass, Ref } from '@typegoose/typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { UserClass } from '../user/user.model';
import { UserPostingClass } from '../user_posting/user_posting.model';


@index({ user_posting: 1 }, { unique: true })
@plugin(require('mongoose-autopopulate') as any)
export class UserMeetingClass {

  @prop({ required: true, ref: () => UserClass })
  host: Ref<UserClass>;

  @prop({ required: true, ref: () => UserClass })
  tutor: Ref<UserClass>;

  @prop({ required: true, ref: () => UserPostingClass, autopopulate: { maxDepth: 1 } })
  user_posting: Ref<UserPostingClass>
}

const UserMeeting = getModelForClass(UserMeetingClass, { schemaOptions: { collection: 'user_meetings', timestamps: true } })
export default UserMeeting;
