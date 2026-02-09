import axios from "axios";
import * as cheerio from "cheerio";
import Event from "../models/Event.js"

export const scrapeEvents = async () => {
  try {
    console.log("Scraping TimeOut events...")

    const SOURCE = "timeout";
    const url = "https://www.timeout.com/sydney/things-to-do"

    const { data } = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    const $ = cheerio.load(data)
    const events = [];

    const articles = $("article");

    for (let i = 0; i < articles.length; i++) {
      const el = articles[i];

      let title = $(el).find("h3").text().trim()
      let description = $(el)
        .find('[data-testid="summary_testID"]')
        .text()
        .trim();
      let image = $(el).find("img").attr("src")
      let link = $(el).find("a").attr("href");

      if (!title || !link) continue;

      const eventUrl = "https://www.timeout.com" + link

      // -------- DETAIL PAGE SCRAPE --------
      let dateTime = ""
      let venueName = ""

      try {
        const detail = await axios.get(eventUrl, {
          headers: { "User-Agent": "Mozilla/5.0" },
        });

        const $$ = cheerio.load(detail.data)

        dateTime =
          $$("time").attr("datetime") ||
          $$("time").text().trim() ||
          "";

        venueName =
          $$('[data-testid="venue-name"]').first().text().trim() ||
          $$("address").first().text().trim() ||
          "";

      } catch (err) {
        console.log("Detail scrape failed:", eventUrl)
      }

      // -------- CLEAN DATA --------
      description = description.replace(/\s+/g, " ").trim()
      venueName = venueName.replace(/\s+/g, " ").trim()

      if (!dateTime) {
        dateTime = new Date().toISOString(); // fallback
      }

      events.push({
        title,
        description,
        image,
        eventUrl,
        dateTime,
        venueName: venueName || "Sydney",
        sourceWebsite: SOURCE,
        lastScrapedAt: new Date(),
      });
    }

    console.log(`Found ${events.length} events`)

    // -------- SAVE TO DB --------
    for (const ev of events) {
      const existing = await Event.findOne({ eventUrl: ev.eventUrl })

      if (!existing) {
        await Event.create({ ...ev, status: "new" })
      } else {
        if (
          existing.title !== ev.title ||
          existing.dateTime !== ev.dateTime ||
          existing.venueName !== ev.venueName
        ) {
          existing.title = ev.title;
          existing.description = ev.description
          existing.dateTime = ev.dateTime
          existing.venueName = ev.venueName
          existing.status = "updated"
          existing.lastScrapedAt = new Date()
          await existing.save();
        }
      }
    }

    // -------- INACTIVE DETECTION --------
    const scrapedUrls = events.map((e) => e.eventUrl);
    const dbEvents = await Event.find({ sourceWebsite: SOURCE })

    for (const dbEvent of dbEvents) {
      if (!scrapedUrls.includes(dbEvent.eventUrl)) {
        dbEvent.status = "inactive";
        await dbEvent.save();
      }
    }

    console.log("Scraping completed successfully");
  } catch (error) {
    console.error("Scraper error:", error.message);
  }
};
