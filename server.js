import express from "express"; // Use ES module import for express
import axios from "axios"; // Correct import style for axios
import * as cheerio from "cheerio"; // Correct import style for Cheerio

const app = express();
const port = 5000; // Port for your API

// Middleware for CORS and JSON parsing

app.use(express.json());

// Define the scraping endpoint
app.get("/scrape", async (req, res) => {
	try {
		// Fetch HTML content from the website
		const { data } = await axios.get(
			"https://www.ellecanada.com/fashion/shopping/best-canadian-fashion-brands-under-the-radar"
		);

		// Load the HTML content into Cheerio for parsing
		const $ = cheerio.load(data);

		// Array to store the extracted data
		const scrapedData = [];

		// Scraping <h3> tags and their nested <a> tags
		$("h3").each((index, element) => {
			const title = $(element).text().trim(); // Extract text from <h3>

			// Check for any <a> tags inside the <h3> and extract the href attribute
			const link = $(element).find("a").attr("href");

			if (title && link) {
				// Ensure the link is a full URL
				const fullLink = link.startsWith("http")
					? link
					: `https://www.ellecanada.com${link}`;

				// Push the extracted title and link to the array
				scrapedData.push({
					title,
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
