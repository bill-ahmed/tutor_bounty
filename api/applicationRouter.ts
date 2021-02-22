import { Router, Request, Response, NextFunction } from "express";

/** A router for the back-end API server */
const ApplicationRouter = Router();

ApplicationRouter.get('/isAlive', (req, res) => { res.status(200).send('Alive!'); })

export default ApplicationRouter;