require("dotenv").config();
const express = require("express");
const axios = require("axios");
const app = express();
const PORT = 5001;

app.get("/", (req, res) => {
  res.send("Hello from the backend!");
});

function formatDateToODataString(date) {
  // Get the offset in hours and minutes
  const tzOffset = -date.getTimezoneOffset(); // Timezone offset in minutes
  const sign = tzOffset >= 0 ? "+" : "-"; // Determine if it's positive or negative

  // Get absolute values for hours and minutes
  const offsetHours = String(Math.floor(Math.abs(tzOffset) / 60)).padStart(
    2,
    "0"
  );
  const offsetMinutes = String(Math.abs(tzOffset) % 60).padStart(2, "0");

  // Return formatted string (YYYY-MM-DDTHH:MM:SS±HH:MM)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}T${String(
    date.getHours()
  ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(
    date.getSeconds()
  ).padStart(2, "0")}${sign}${offsetHours}:${offsetMinutes}`;
}

app.get("/schedule", async (req, res) => {
  // Extract start and end date from the query parameters
  const { start, end } = req.query;
  console.log("running");

  //   // Parse start date and set to 12:00 AM
  //   const startDate = new Date(start);
  //   startDate.setHours(0, 0, 0, 0); // Set time to 12:00 AM (midnight)

  //   // Parse end date and set to 11:59:59 PM
  //   const endDate = new Date(end);
  //   endDate.setHours(23, 59, 59, 999); // Set time to 11:59:59 PM (end of day)

  //   // Format the start and end dates to match OData's format
  //   const formattedStartDate = formatDateToODataString(startDate);
  //   const formattedEndDate = formatDateToODataString(endDate);

  try {
    // Construct the OData filter query using the formatted dates
    // const filter = `$filter="Start Date Time" le ${formattedEndDate} and "End Date Time" ge ${formattedStartDate}`;
    const filter = `$filter="Start Date Time" le ${end} and "End Date Time" ge ${start}`;

    // console.log(filter);

    const url = `https://fmp.pse.cloud/fmi/odata/v4/Scheduling/ResourceScheduler?${filter}`;

    const config = {
      method: "GET",
      url: url,
      auth: {
        username: process.env.FM_USER,
        password: process.env.FM_PASSWORD,
      },
      headers: {
        "Content-Type": "application/json", // Adjust as needed
      },
    };

    // Make the OData API call using axios
    const response = await axios(config);

    // Send back the filtered data
    console.log(response);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching OData:", error.message);
    res.status(500).json({ error: "Error fetching data from OData service." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
