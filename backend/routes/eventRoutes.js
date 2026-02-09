import express from "express";
import Event from "../models/Event.js";
import jwt from "jsonwebtoken";

const eventRouter = express.Router();

// Get all active events
eventRouter.get("/", async (req, res) => {
    const events = await Event.find({ status: { $ne: "inactive" } }).sort({ createdAt: -1 });

    res.json(events);
})


eventRouter.get("/dashboard", async (req, res) => {
    const { city, search, startDate, endDate } = req.query;

    const query = {};

    if (city) query.city = city;

    if (search) {
        query.$or = [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { venueName: { $regex: search, $options: "i" } },
        ];
    }

    if (startDate || endDate) {
        query.dateTime = {};
        if (startDate) query.dateTime.$gte = startDate;
        if (endDate) query.dateTime.$lte = endDate;
    }

    const events = await Event.find(query).sort({ createdAt: -1 });

    res.json(events);
})


eventRouter.post("/import/:id", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const event = await Event.findById(req.params.id);

    event.status = "imported";
    event.importedAt = new Date();
    event.importedBy = decoded.id;
    event.importNotes = req.body.notes || "";

    await event.save();

    res.json(event);
})



export default eventRouter
