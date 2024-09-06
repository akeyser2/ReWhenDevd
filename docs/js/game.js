const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

const getRandomGameScreenshot = async () => {
  let rgame_id = Math.floor(Math.random() * 276529);
  let url = "https://api.igdb.com/v4/games/";
  
  const headers = {
    'Client-ID': 'placeholder',
    'Authorization': 'Bearer placeholder',
    'Content-Type': 'application/json',
    'Cookie': 'placeholder'
  };

  let payload = `fields name, screenshots.url;\nwhere id = ${rgame_id};`;

  let response = await axios.post(url, payload, { headers });
  let data = response.data;

  // If no data or no screenshots, keep trying
  while (data.length < 1 || !data[0].screenshots) {
    rgame_id = Math.floor(Math.random() * 276529);
    payload = `fields name, screenshots.url;\nwhere id = ${rgame_id};`;
    response = await axios.post(url, payload, { headers });
    data = response.data;
  }

  const game_id = data[0].id;
  const game_name = data[0].name;

  // Get release dates
  url = "https://api.igdb.com/v4/release_dates";
  payload = `fields y, game;\nwhere game = ${game_id};\nsort y asc;`;
  let rd_response = await axios.post(url, payload, { headers });
  let rd_data = rd_response.data;

  // Select a random screenshot
  const rand_sc = Math.floor(Math.random() * data[0].screenshots.length);
  let image_url = data[0].screenshots[rand_sc].url;

  // Check for release year
  let release_year = rd_data.length > 0 ? rd_data[0].y : null;

  // Fix URL for higher resolution
  image_url = `https://${image_url.slice(2)}`;
  image_url = image_url.replace("thumb", "1080p");

  console.log(release_year);

  return { image_url, game_name, release_year };
};

getRandomGameScreenshot().then(result => {
  console.log(result);
}).catch(error => {
  console.error(error);
});