const fetch = require("node-fetch");

exports.handler = async (event) => {
  const { url } = JSON.parse(event.body);

  if (!url) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "URL is required" }),
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
