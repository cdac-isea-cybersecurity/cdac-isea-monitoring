// List of websites to monitor
const websites = [
  { name: "isea.gov.in", url: "https://isea.gov.in" },
  { name: "infosecawareness.in", url: "https://infosecawareness.in" },
  { name: "isea.app", url: "https://isea.app" },
  { name: "ivp.isea.app", url: "https://ivp.isea.app" },
  { name: "staysafeonline.in", url: "https://staysafeonline.in" },
];

// Function to ping a website and measure speed
async function pingWebsite(website) {
  const startTime = Date.now();
  try {
    const response = await fetch(website.url, { mode: "no-cors" });
    const endTime = Date.now();
    const ping = endTime - startTime;
    const speed = ping < 500 ? "Fast" : ping < 1000 ? "Moderate" : "Slow";
    return { isWorking: true, ping, speed };
  } catch (error) {
    return { isWorking: false, ping: null, speed: null };
  }
}

// Function to update the UI
function updateUI(website, status, ping, speed) {
  const listItem = document.createElement("li");
  listItem.innerHTML = `
    <span>${website.name}</span>
    <div class="loading">${status === null ? "Testing..." : ""}</div>
    <div class="speed">${speed ? `Speed: ${speed}` : ""}</div>
    <div class="ping">${ping ? `Ping: ${ping}ms` : ""}</div>
    <div class="status ${status ? "working" : "not-working"}"></div>
  `;
  document.getElementById("website-list").appendChild(listItem);
}

// Function to clear the list before updating
function clearList() {
  const list = document.getElementById("website-list");
  list.innerHTML = ""; // Clear the list
}

// Monitor websites and update UI
async function monitorWebsites() {
  clearList(); // Clear the list before updating
  for (const website of websites) {
    updateUI(website, null, null, null); // Show loading state
    const { isWorking, ping, speed } = await pingWebsite(website);
    updateUI(website, isWorking, ping, speed);
  }
}

// Function to check custom website
async function checkCustomWebsite() {
  const url = document.getElementById("custom-url").value;
  if (!url) {
    alert("Please enter a valid URL.");
    return;
  }

  const customResult = document.getElementById("custom-result");
  customResult.innerHTML = "Testing...";

  const startTime = Date.now();
  try {
    const response = await fetch(url, { mode: "no-cors" });
    const endTime = Date.now();
    const ping = endTime - startTime;
    const speed = ping < 500 ? "Fast" : ping < 1000 ? "Moderate" : "Slow";
    customResult.innerHTML = `
      <strong>Status:</strong> Working 🟢<br>
      <strong>Speed:</strong> ${speed}<br>
      <strong>Ping:</strong> ${ping}ms
    `;
  } catch (error) {
    customResult.innerHTML = `
      <strong>Status:</strong> Not Working 🔴<br>
      <strong>Error:</strong> ${error.message}
    `;
  }
}

// Start monitoring
monitorWebsites();

// Refresh monitoring every 5 minutes
setInterval(monitorWebsites, 5 * 60 * 1000);
