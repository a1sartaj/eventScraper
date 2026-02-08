import express from "express";
import EmailCapture from "../models/EmailCapture.js";

const emailRouter = express.Router();

emailRouter.post("/", async (req, res) => {
    const { email, consent, eventId } = req.body;

    if (!email || !consent) {
        return res.status(400).json({ message: "Email & consent required" });
    }

    const saved = await EmailCapture.create({
        email,
        consent,
        eventId,
    });

    res.json(saved);
});

export default emailRouter;
