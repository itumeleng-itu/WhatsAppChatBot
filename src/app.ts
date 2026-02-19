import express from "express";
import webhookRoute from "../routes/webhook.route";

const app = express();

app.use(express.json()); // parse JSON requests

// Use the webhook route
app.use("/webhook", webhookRoute);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));