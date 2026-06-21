import type { Request, Response } from "express";
import app from "../backend/app";

export default function(req: Request, res: Response) {
  return app(req, res);
}
