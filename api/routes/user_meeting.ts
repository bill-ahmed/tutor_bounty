import { DocumentType } from "@typegoose/typegoose";
import { Router, Request, Response, NextFunction } from "express";
import { body, query, validationResult } from "express-validator";
import { UserClass } from "../models/user/user.model";
import UserMeeting, { UserMeetingClass } from "../models/user_meeting/user_meeting.model";
import MeetingMessages from "../models/user_messages/meeting_messages.model";
import { MAX_USER_MESSAGE_LENGTH } from "../../shared/shared_constants";
import logger from "../utils/logger";
import UserRating from "../models/user_rating/user_rating.model";

const MeetingRouter = Router();
const bodyParser = require('body-parser');

// Define middleware

/** Check if user can access meeting details */
async function UserMeetingAccess(req: Request, res: Response, next: NextFunction) {
  const currentUser = req.user as DocumentType<UserClass>;

  try {
    // Don't need to populate doc, so `lean()` works fine here
    const meeting = await UserMeeting.findById(req.params.id).lean();

    // Can't compare ObjectId directly, need to convert to string first
    const currUserId = currentUser.id.toString();
    const hostId = meeting.host.toString();
    const tutorId = meeting.tutor.toString();

    // If current user is the host or tutor, continue
    if(currUserId === hostId || currUserId === tutorId)
    {
      next();
    }
    else
    {
      // Kick em' out
      return res.sendStatus(404);
    }

  } catch (error) {
    logger.error(error.stack);
    
    return res.sendStatus(500);
  }
}

/** Get list of meetings that user is a participant in (either host or tutor)
 * 
 * @route /api/meetings/myMeetings
 */
MeetingRouter.get('/myMeetings', async (req, res) => {
  let userId = (req.user as any)._id.toString();

  // Get list of meetings where user is a host OR tutor
  let hostedMeetings = await UserMeeting.find({ host: userId }).lean().populate('user_posting').populate('tutor', 'username').populate('host', 'username');
  let tutorMeetings = await UserMeeting.find({ tutor: userId }).lean().populate('user_posting').populate('tutor', 'username').populate('host', 'username');
  let completedMeetings = [...hostedMeetings.filter(m => m.completed), ...tutorMeetings.filter(m => m.completed)];

  hostedMeetings = hostedMeetings.filter(m => !m.completed);
  tutorMeetings = tutorMeetings.filter(m => !m.completed); 
  
  return res.status(200).json({ isHost: hostedMeetings, isTutor: tutorMeetings, completed: completedMeetings });
});


/** Get details about a meeeting.
 * If user is not host/tutor, 404 is returned.
 * 
 * @route /api/meetings/:id
 * 
 */
MeetingRouter.get('/:id', UserMeetingAccess, async (req, res) => {
  const meeting = await UserMeeting.findById(req.params.id).populate('host', 'username').populate('tutor', 'username');

  return res.status(200).json(meeting);
});

/** Send a message to the given meeting id.
 * 
 * @route /api/meetings/:id/sendMessage
 */
MeetingRouter.post('/:id/sendMessage', bodyParser.json(), UserMeetingAccess, async (req, res) => {
  await body('message', 'Invalid message format.').isString().isLength({ min: 0, max: MAX_USER_MESSAGE_LENGTH }).run(req);

  const errors = validationResult(req);
  if(!errors.isEmpty())
    return res.status(400).json(errors.array({ onlyFirstError: true }));

  const meeting = await UserMeeting.findById(req.params.id);

  if(meeting.completed)
    return res.sendStatus(400);

  const hostId = meeting.host.toString();
  const isHost = hostId === (req.user as any).id.toString();

  try {
    await MeetingMessages.create({
      user_meeting: meeting,
      to: isHost ? meeting.tutor : meeting.host,
      from: isHost ? meeting.host : meeting.tutor,
      content: req.body.message
    });

    return res.sendStatus(200);

  } catch (error) {
    logger.error('Failed to create user message.');
    logger.error(error.stack);

    return res.sendStatus(500);
  }
});

/** Get messages for given meeting
 * 
 * @route /api/meetings/:id/messages
 */
MeetingRouter.get('/:id/messages', UserMeetingAccess, async (req, res) => {
  await query('page', 'Page must be a valid number!').isNumeric().isLength({ min: 0 }).run(req);

  const limit = 15;
  let page = parseInt(req.query.page as string, 10);

  const meeting = await UserMeeting.findById(req.params.id);
  var messages = [];

  try {
    messages = await MeetingMessages.where({ user_meeting: meeting }).sort({ createdAt: 'desc' }).limit(limit).skip(page * limit).lean();

  } catch (error) {
    logger.error('Error getting more meeting messages.');
    logger.error(error.stack);
  }

  return res.status(200).json(messages);
});

/** Rate the other user in a meeting
 * 
 * @route /api/meetings/:id/rate
 */
MeetingRouter.post('/:id/rate', bodyParser.json(), UserMeetingAccess, async (req, res) => {
  await body('rating', 'Rating is required and must be between 1 and 5.').isNumeric().toInt().isLength({ min: 1, max: 5 }).run(req);

  const meeting = await UserMeeting.findById(req.params.id);

  // If this user already rated for this meeting, reject
  if(await UserRating.exists({ by: (req.user as any).id, meeting: meeting }))
    return res.sendStatus(400);

  const hostId = meeting.host.toString();
  const otherId = hostId === (req.user as any).id.toString() ? meeting.tutor : meeting.host;

  const errors = validationResult(req);
  if(!errors.isEmpty())
    return res.status(400).json(errors.array({ onlyFirstError: true }));
  
  try {
    await UserRating.create({
      by: (req.user as any).id,
      for: otherId,
      meeting: meeting.id,
      value: req.body.rating
    });

    meeting.completed = true;
    await meeting.save();

    res.sendStatus(200);

  } catch (error) {
    logger.error('Error rating a meeting.');
    logger.error(error.stack);

    return res.sendStatus(500);
  }
});

export default MeetingRouter;
