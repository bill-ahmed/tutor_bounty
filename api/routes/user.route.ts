import { Router, Request, Response, NextFunction } from "express";

const UserRouter = Router();

UserRouter.get('/isAlive', (req, res) => { res.status(200).send('User router working!') });

export default UserRouter;