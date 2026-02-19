import { Router, Request, Response } from "express";

const router = Router();

// Example webhook route
router.post("/", (req: Request, res: Response) => {
  console.log("Webhook received:", req.body);
  res.status(200).send("Webhook received successfully!");
});

export default router;