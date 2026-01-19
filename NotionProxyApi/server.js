require('dotenv').config({
  path: __dirname + '/.env'
});
console.log("ENV:", process.env.NOTION_TOKEN);

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());

// Serve static Angular app files
app.use(express.static(path.join(__dirname, '../tbb-dashboard/dist/my-app/browser')));
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fs = require('fs');
const vm = require('vm'); // ✅ Add this

const fcmAdmin = require("firebase-admin");

const NOTION_TOKEN = process.env.NOTION_TOKEN;

if (!NOTION_TOKEN) {
  throw new Error("NOTION_TOKEN is missing"); // 🔐 Replace with your Notion token
}
const NOTION_VERSION = '2022-06-28';



app.post('/api/createRelationId', async (req, res) => {
  try {
    const response = await axios.post(
      'https://api.notion.com/v1/pages',
      req.body,
      {
        headers: {
          Authorization: `Bearer ${NOTION_TOKEN}`,
          'Notion-Version': NOTION_VERSION,
          'Content-Type': 'application/json'
        }
      }
    );
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { error: 'Unknown error' });
  }
});

app.post('/api/getRelationName', async (req, res) => {
  try {
    const response = await axios.post(
      'https://api.notion.com/v1/databases/5e00bcb25c3d4276b1de54de3576894a/query',
      req.body,
      {
        headers: {
          Authorization: `Bearer ${NOTION_TOKEN}`,
          'Notion-Version': NOTION_VERSION,
          'Content-Type': 'application/json'
        }
      }
    );
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { error: 'Unknown error' });
  }
});

app.post('/api/getAllPagesFromDB', async (req, res) => {
  try {
    const response = await axios.post(
      'https://api.notion.com/v1/databases/2ed1ee2b-915f-8060-a2ca-deb203b60012/query',
      req.body,
      {
        headers: {
          Authorization: `Bearer ${NOTION_TOKEN}`,
          'Notion-Version': NOTION_VERSION,
          'Content-Type': 'application/json'
        }
      }
    );
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { error: 'Unknown error' });
  }
});

app.patch('/api/patchRelationIdToTrade', async (req, res) => {
  try {
    // const url = "https://api.notion.com/v1/pages/" + req.url
    const pageId = req.body.url;
    const payload = req.body.payload;
    const response = await axios.patch(
      `https://api.notion.com/v1/pages/${pageId}`,
      req.body.payload,
      {
        headers: {
          Authorization: `Bearer ${NOTION_TOKEN}`,
          'Notion-Version': NOTION_VERSION,
          'Content-Type': 'application/json'
        }
      }
    );
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { error: 'Unknown error' });
  }
});

app.patch('/api/updatePropertiesToTrade', async (req, res) => {
  try {
    // const url = "https://api.notion.com/v1/pages/" + req.url
    const pageId = req.body.url;
    const payload = req.body.payload;
    const response = await axios.patch(
      `https://api.notion.com/v1/pages/${pageId}`,
      req.body.payload,
      {
        headers: {
          Authorization: `Bearer ${NOTION_TOKEN}`,
          'Notion-Version': NOTION_VERSION,
          'Content-Type': 'application/json'
        }
      }
    );
    res.json(response.data.properties.PnL);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { error: 'Unknown error' });
  }
});

app.post('/api/createNewEntry', async (req, res) => {
  try {
    const response = await axios.post(
      'https://api.notion.com/v1/pages',
      req.body,
      {
        headers: {
          Authorization: `Bearer ${NOTION_TOKEN}`,
          'Notion-Version': NOTION_VERSION,
          'Content-Type': 'application/json'
        }
      }
    );
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { error: 'Unknown error' });
  }
});

app.get('/api/news', async (req, res) => {
  let browser;

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/115.0.0.0 Safari/537.36'
    );

    await page.goto('https://www.forexfactory.com/calendar', { waitUntil: 'domcontentloaded' });

    // Wait for dynamic JS to render content
    await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 3000)));

    const html = await page.content();
    fs.writeFileSync('calendar_loaded.html', html); // Optional debug

    const scriptMatch = html.match(/window\.calendarComponentStates\[1\]\s*=\s*({[\s\S]*?});/);
    if (!scriptMatch) throw new Error('calendarComponentStates[1] not found');

    const codeToRun = `
      const result = {};
      window = { calendarComponentStates: {} };
      window.calendarComponentStates[1] = ${scriptMatch[1]};
      result.data = window.calendarComponentStates[1];
      result;
    `;

    const sandbox = {};
    const script = new vm.Script(codeToRun);
    const context = vm.createContext(sandbox);
    const { data: calendarData } = script.runInContext(context);

    const allowedCurrencies = ['EUR', 'USD', 'GBP'];
    const allowedImpacts = ['high', 'non-economic'];
    const news = [];

    calendarData.days.forEach(day => {
      const dateText = day.date.replace(/<[^>]+>/g, '').trim();

      day.events.forEach(event => {
        const currency = event.currency;
        const impact = (event.impactName || '').toLowerCase();
        const eventName = event.name;
        const time = event.timeLabel;

        const isHighOrNonEcon =
          allowedCurrencies.includes(currency) &&
          allowedImpacts.includes(impact);

        const isSpecialMediumEvent =
          impact === 'medium' &&
          allowedCurrencies.includes(currency) &&
          eventName.toLowerCase().includes('president') &&
          eventName.toLowerCase().includes('speaks');

        if (isHighOrNonEcon || isSpecialMediumEvent) {
          news.push({
            date: dateText,
            time,
            currency,
            event: eventName,
            impact
          });
        }
      });
    });

    res.json(news);

  } catch (err) {
    console.error('[ERROR]', err);
    res.status(500).json({
      error: 'Failed to fetch and parse news',
      details: err.message
    });
  } finally {
    if (browser) await browser.close();
  }
});

app.post("/api/sendNotif", async (req, res) => {
  const { token, title, body } = req.body;

  try {
    await fcmAdmin.messaging().send({
      token: token,
      notification: { title, body }
    });
    res.status(200).json({ message: "Notification sent successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({message:"Error sending notification",err});
  }
});

// Health check endpoint for connection monitoring
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'NotionProxyApi',
    timestamp: new Date().toISOString(),
    port: 3000
  });
});

app.post('/api/getPropFirmAccountSettings', async (req, res) => {
  try {
    const response = await axios.post(
      'https://api.notion.com/v1/databases/ef10ac6f79524ea49e4bc0997e0ee704/query',
      req.body,
      {
        headers: {
          Authorization: `Bearer ${NOTION_TOKEN}`,
          'Notion-Version': NOTION_VERSION,
          'Content-Type': 'application/json'
        }
      }
    );
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { error: 'Unknown error' });
  }
});

// SPA fallback - serve index.html for any non-API routes (MUST BE LAST)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../tbb-dashboard/dist/my-app/index.html'));
});

app.listen(3000, () => console.log('✅ Server running at http://localhost:3000'));
