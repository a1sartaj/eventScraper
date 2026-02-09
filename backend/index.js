import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import connectDB from './config/db.js'
import Event from './models/Event.js'
import { scrapeEvents } from './scraper/scrapeEvents.js'
import cron from 'node-cron'
import eventRouter from './routes/eventRoutes.js'
import emailRouter from './routes/emailRoutes.js'
import authRouter from './routes/authRoutes.js'
import passport from "./config/passport.js"


const app = express();
const PORT = process.env.PORT || 3000

app.use(express.json());
app.use(cors());
app.use(passport.initialize())

connectDB()

// Run scraper every 6 hours
cron.schedule("0 */6 * * *", async () => {
    console.log("Auto scraping started...")

    try {
        await scrapeEvents();
        console.log("Auto scraping finished");
    } catch (err) {
        console.error("Cron error:", err.message)
    }
});


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get("/test-save", async (req, res) => {
    try {
        const event = await Event.create({
            title: "Test Event",
            dateTime: "10 Feb 2026",
            venueName: "Sydney Hall",
            description: "Test event saved successfully",
            eventUrl: "test-" + Date.now(),
            sourceWebsite: "manual",
            lastScrapedAt: new Date(),
        });

        res.json({ message: "Event created successfully", event });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get("/scrape", async (req, res) => {
    await scrapeEvents()
    res.send("Scraping done")
});

app.use('/api/events', eventRouter)
app.use('/api/email', emailRouter)
app.use('/api/auth', authRouter)


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})


