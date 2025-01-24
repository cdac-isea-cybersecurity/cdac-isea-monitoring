const fetch = require("node-fetch");

exports.handler = async (event) => {
  // Check if the request body exists
  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Request body is missing" }),
    };
  }

  let url;
  try {
    // Parse the request body
    const body = JSON.parse(event.body);
    url = body.url;

    // Validate the URL
    if (!url) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "URL is required" }),
      };
    }
  } catch (error) {
    // Handle JSON parsing errors
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid JSON input" }),
    };
  }

  try {
    const startTime = Date.now();
    const response = await fetch(url, { method: "HEAD" });
    const endTime = Date.now();
    const ping = endTime - startTime;

    if (response.ok) {
      const speed = ping < 500 ? "Fast" : ping < 1000 ? "Moderate" : "Slow";
      return {
        statusCode: 200,
        body: JSON.stringify({ isWorking: true, ping, speed }),
      };
    } else {
      return {
        statusCode: 200,
        body: JSON.stringify({ isWorking: false, ping: null, speed: null }),
      };
    }
  } catch (error) {
    return {
      statusCode: 200,
      body: JSON.stringify({ isWorking: false, ping: null, speed: null }),
    };
  }
};
