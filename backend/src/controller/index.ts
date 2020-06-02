import { Request, Response } from 'express';

export interface Controller {
    create?(req: Request, response: Response): any;
    delete?(req: Request, response: Response): any;
    index?(req: Request, response: Response): any;
}