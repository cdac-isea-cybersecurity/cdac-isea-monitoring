// List of websites to monitor
const websites = [
  { name: "isea.gov.in", url: "https://isea.gov.in" },
  { name: "infosecawareness.in", url: "https://infosecawareness.in" },
  { name: "isea.app", url: "https://isea.app" },
  { name: "ivp.isea.app", url: "https://ivp.isea.app" },
  { name: "staysafeonline.in", url: "https://staysafeonline.in" },
];

// Function to ping a website
async function pingWebsite(url) {
  try {
    const response = await fetch(url, { mode: "no-cors" });
    return response.ok || true; // Assume success if no CORS error
  } catch (error) {
    return false; // Website is down or unreachable
  }
}

// Function to update the UI
function updateUI(website, status) {
  const listItem = document.createElement("li");
  listItem.innerHTML = `
    <span>${website.name}</span>
    <div class="status ${status ? "working" : "not-working"}"></div>
  `;
  document.getElementById("website-list").appendChild(listItem);
}

// Monitor websites and update UI
async function monitorWebsites() {
  for (const website of websites) {
    const isWorking = await pingWebsite(website.url);
    updateUI(website, isWorking);
  }
}

// Start monitoring
monitorWebsites();

// Refresh monitoring every 5 minutes
setInterval(monitorWebsites, 5 * 60 * 1000);
