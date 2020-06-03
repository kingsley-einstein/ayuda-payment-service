export const cors = (origin: string) => {
  return (req: any, res: any, next: any) => {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Headers", "Authorization, Content-Type");
    res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE");
    // req.header("Host", process.env.NODE_ENV === "production" ? process.env.HOST : "");
    next();
  }
}
