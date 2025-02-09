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
		const { data } = await axios.get("https://madeinca.ca/category/clothes/");

		// Load the HTML content into Cheerio for parsing
		const $ = cheerio.load(data);

		// Array to store the extracted data
		const scrapedData = [];

		// Scrape all <h3> tags and extract <a> tags inside them
		$("h3").each((index, element) => {
			const aTag = $(element).find("a"); // Find <a> inside <h3>
			const text = aTag.text().trim(); // Get the text inside <a>
			const link = aTag.attr("href"); // Get the href attribute of the <a> tag

			if (link) {
				// Ensure the link is a full URL
				const fullLink = link.startsWith("http")
					? link
					: `https://madeinca.ca${link}`;

				// Push the extracted text and link into the array
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
