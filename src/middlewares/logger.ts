import { Request as ERequest, Response as EResponse, NextFunction} from "express";

export const logger = () => {
  return (req: ERequest, res: EResponse, next: NextFunction) => {
    res.on("finish", () => {
      const o = {
      method: req.method,
      path: req.path,
      status: res.statusCode
     };
     console.table([o]);
    })
    next();
  }
}
