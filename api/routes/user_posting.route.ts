import bodyParser from "body-parser";
import { Router, Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { 
  ALLOWED_MEETING_DURATIONS, 
  ALLOWED_USER_POSTING_CATEGORIES, 
  MAX_USER_POSTING_DESCRIPTION_LENGTH, 
  MAX_USER_POSTING_MONETARY_VALUE, 
  MAX_USER_POSTING_TITLE_LENGTH, 
  MIN_USER_POSTING_MONETARY_VALUE
} from '../../shared/shared_constants';

import UserPosting from "../models/user_posting/user_posting.model";
import Logger from "../utils/logger";
import { Utils } from "../utils/sanitizer";

const UserPostingRouter = Router();

UserPostingRouter.get('/isAlive', (req, res) => { res.status(200).send('UserPostingRouter working!') });

/** Create a new user posting.
 * 
 * @route /api/userPostings/new
 * 
 */
UserPostingRouter.post('/new', bodyParser.json(), async (req: Request, res: Response) => {
  await body('title', 'Title is required.').isString().trim().isLength({ min: 1, max: MAX_USER_POSTING_TITLE_LENGTH }).run(req);
  await body('description', 'Description is required.').isString().trim().isLength({ min: 1, max: MAX_USER_POSTING_DESCRIPTION_LENGTH }).run(req);

  await body('startDate', 'Starting date is required.').toDate().run(req);
  await body('startTime', 'Start time is required.').toDate().run(req);
  
  await body('duration', 'Duration is required and must be one of dropdown options.').isString().isIn(ALLOWED_MEETING_DURATIONS).run(req);
  await body('category', 'Category Duration is required and must be one of dropdown options.').isString().isIn(ALLOWED_USER_POSTING_CATEGORIES).run(req);

  await body('value', 'Monetary value is required.').isNumeric().isLength({ min: MIN_USER_POSTING_MONETARY_VALUE, max: MAX_USER_POSTING_MONETARY_VALUE }).run(req);

  const errors = validationResult(req);

  if(!errors.isEmpty())
    return res.status(400).json(errors.array({ onlyFirstError: true }));
  
  // Posting is valid, try and create one!
  try {
    let { title, description, startDate, startTime, value, duration, category } = req.body;

    // Sanitize description HTML first
    description = Utils.Sanitizer.sanitizeHTML(description);

    let userPosting = await UserPosting.create({
      title,
      description,
      startDate,
      startTime,
      value,
      duration,
      category,
      user: req.user
    });

    await userPosting.save();

    // TODO: Send id of the user posting back?
    res.sendStatus(200);

  } catch (error) {
    Logger.error('Failed to create new user posting.');
    Logger.error(error.stack);

    return res.status(500).json([{ msg: 'A server error occurred!' }]);
  }
});

UserPostingRouter.get('/:id', bodyParser.json(), async (req: Request, res: Response) => {
  try {
    let uid = req.params['id'];
    let userPost = await UserPosting.findById(uid);
    return res.json(userPost);
  } catch (err) {
    return res.status(500);
  }
});

UserPostingRouter.get('/', bodyParser.json(), async (req: Request, res: Response) => {
  console.log(req.query);
  // Create the query for the user posts.
  let query = {};
  // category: "Computer Science"
  // dateEnd: "2021-03-31"
  // dateStart: "2021-03-01"
  // duration: "1 hour"
  // page: 0
  // priceEnd: "2"
  // priceStart: "1"
  // search: "hhhh"
  
  // Check for search string.
  if ("search" in req.query) query["title"] = {"$regex": req.query.search, "$options": "i"};
  // Check for price min and max.
  let priceFilter = {};
  if ("priceStart" in req.query) priceFilter["$gte"] = Number(req.query.priceStart);
  if ("priceEnd" in req.query) priceFilter["$lte"] = Number(req.query.priceEnd);
  if ("priceStart" in req.query || "priceEnd" in req.query) query["value"] = priceFilter;
  // Check for date min and max.
  let dateFilter = {};
  if ("dateStart" in req.query) dateFilter["$gte"] = new Date(String(req.query.dateStart)).toISOString();
  if ("dateEnd" in req.query) dateFilter["$lte"] = new Date(String(req.query.dateEnd)).toISOString();
  if ("dateStart" in req.query || "dateEnd" in req.query) query["startDate"] = dateFilter;
  // Check for duration.
  if ("duration" in req.query) query["duration"] = req.query.duration;
  // Check for category.
  if ("category" in req.query) query["category"] = req.query.category;
  console.log(query);
  try {
    let userPostings = await UserPosting.find(query).limit(5).skip(5*Number(req.query.page));
    return res.json(userPostings);
  } catch (err) {
    return res.status(500);
  }
});

export default UserPostingRouter;
