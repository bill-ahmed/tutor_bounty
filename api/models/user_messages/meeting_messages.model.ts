import { prop, plugin, index, getModelForClass, Ref } from '@typegoose/typegoose';
import { UserClass } from '../user/user.model';
import { UserMeetingClass } from '../user_meeting/user_meeting.model';

@index({ user_meeting: 1 })
@index({ createdAt: 1 })
export class MeetingMessagesClass {

  @prop({ required: true, ref: () => UserMeetingClass })
  user_meeting: Ref<UserMeetingClass>;

  @prop({ required: true, ref: () => UserClass })
  to!: Ref<UserClass>;

  @prop({ required: true, ref: () => UserClass })
  from!: Ref<UserClass>;

  @prop({ required: true })
  content: string;
}

const MeetingMessages = getModelForClass(MeetingMessagesClass, { schemaOptions: { collection: 'meeting_messages', timestamps: true } })
export default MeetingMessages;
