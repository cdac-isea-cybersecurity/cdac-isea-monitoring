# CDAC ISEA Website Monitoring Dashboard
![GitHub](https://img.shields.io/badge/license-MIT-blue) ![GitHub last commit](https://img.shields.io/github/last-commit/cdac-isea-cybersecurity/cdac-isea-monitoring) ![GitHub repo size](https://img.shields.io/github/repo-size/cdac-isea-cybersecurity/cdac-isea-monitoring) [![Netlify Status](https://api.netlify.com/api/v1/badges/77bef363-9ed7-4dfc-a6e2-1fc7e6d5beb0/deploy-status)](https://app.netlify.com/sites/cdacstatus/deploys)


A live monitoring dashboard to track the status of CDAC ISEA and related websites. Built with **HTML**, **CSS**, and **JavaScript**, this tool provides real-time updates on website availability.

## Features
- **Real-time monitoring**: Tracks the status of multiple websites.
- **Responsive design**: Works seamlessly on both mobile and desktop devices.
- **Simple and intuitive**: Easy-to-understand UI with color-coded status indicators.
- **Auto-refresh**: Updates website status every 5 minutes.

## Websites Monitored
- [isea.gov.in](https://isea.gov.in)
- [infosecawareness.in](https://infosecawareness.in)
- [isea.app](https://isea.app)
- [ivp.isea.app](https://ivp.isea.app)
- [staysafeonline.in](https://staysafeonline.in)

## How It Works
The dashboard uses JavaScript to ping each website and checks if it is reachable. The status is displayed using color-coded indicators:
- 🟢 **Green**: Website is working.
- 🔴 **Red**: Website is not working.

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/cdac-isea-cybersecurity/cdac-isea-monitoring.git
