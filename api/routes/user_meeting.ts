import { DocumentType } from "@typegoose/typegoose";
import { Router, Request, Response, NextFunction } from "express";
import { UserClass } from "../models/user/user.model";
import UserMeeting, { UserMeetingClass } from "../models/user_meeting/user_meeting.model";
import logger from "../utils/logger";

const MeetingRouter = Router();

// Define middleware

/** Check if user can access meeting details */
async function UserMeetingAccess(req: Request, res: Response, next: NextFunction) {
  const currentUser = req.user as DocumentType<UserClass>;

  try {
    // Don't need to populate doc, so `lean()` works fine here
    const meeting: DocumentType<UserMeetingClass> = await UserMeeting.findById(req.params.id).lean();

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

/** Get details about a meeeting.
 * If user is not host/tutor, 404 is returned.
 * 
 * @route /api/meetings/:id
 * 
 */
MeetingRouter.get('/:id', UserMeetingAccess, async (req, res) => {
  const meeting: DocumentType<UserMeetingClass> = await UserMeeting.findById(req.params.id).populate('host', 'username').populate('tutor', 'username');

  return res.status(200).json(meeting);
});

/** Get list of all participant's PeerJS IDs
 * 
 * @route /api/meetings/:id/participants
 */
MeetingRouter.get('/:id/participants', UserMeetingAccess, async (req, res) => {
  // TODO: Fill this out according to doc string!
  return res.status(200).json([]);
});

export default MeetingRouter;