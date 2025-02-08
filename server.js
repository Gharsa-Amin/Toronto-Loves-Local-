import express from "express";
import axios from "axios";
import * as cheerio from "cheerio";

const app = express();
const port = 5000; // Port for your API

// Middleware for CORS and JSON parsing
app.use(express.json());

// Define the scraping endpoint
app.get("/scrape", async (req, res) => {
	try {
		// Fetch HTML content from the target website
		const { data } = await axios.get(
			"https://thepurist.life/wardrobe/made-in-canada-the-ultimate-guide-to-canadian-fashion-brands-in-2025/"
		);

		// Load the HTML content into Cheerio for parsing
		const $ = cheerio.load(data);

		// Array to store the extracted data
		const scrapedData = [];

		// Scrape all <li> tags and extract website links
		$("li").each((index, element) => {
			// Get the text inside the <li> (optional, if you need it)
			const text = $(element).text().trim();

			// Find the <a> tag inside the <li> and get the href attribute (link)
			const link = $(element).find("a").attr("href");

			if (link) {
				// Ensure the link is a full URL
				const fullLink = link.startsWith("http")
					? link
					: `https://thepurist.life${link}`;

				// Push the link and the associated text (or title) into the array
				scrapedData.push({
					text: text,
					link: fullLink,
				});
			}
		});

		// Send the scraped data back as a JSON response
		res.json(scrapedData);
	} catch (error) {
		console.error("Error scraping data:", error);
		res.status(500).json({ error: "Failed to scrape data" });
	}
});

// Start the Express server
app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
