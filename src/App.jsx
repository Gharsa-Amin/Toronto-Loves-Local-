// src/App.jsx
import { useState, useEffect } from "react";
import axios from "axios";

function App() {
	const [titles, setTitles] = useState([]);

	useEffect(() => {
		// Fetch scraped data from the server
		const fetchData = async () => {
			try {
				const response = await axios.get("http://localhost:5000/scrape");
				setTitles(response.data); // Update state with the scraped titles
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchData();
	}, []);

	return (
		<div>
			<h1>Scraped Titles</h1>
			<ul>
				{titles.map((title, index) => (
					<li key={index}>{title}</li>
				))}
			</ul>
		</div>
	);
}

export default App;
