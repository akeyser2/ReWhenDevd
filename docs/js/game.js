const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Function to fetch data from IGDB
const fetchAndDisplay = async () => {
    const rgameId = Math.floor(Math.random() * 276529);
    const url = "https://api.igdb.com/v4/games/";
    const payload = `fields name, screenshots.url;\r\nwhere id = ${rgameId};`;
    const headers = {
        'Client-ID': 'pewgatdhkl21mnroaq7yxm55sgyjdj',
        'Authorization': 'Bearer avt0rgh3ocsjie520q2hgz57ot3udw',
        'Content-Type': 'application/json',
        'Cookie': '__cf_bm=5LhK7yZhB2XYECaEXqn6epHZYaTZa.UzlZDft2v_Fho-1713901121-1.0.1.1-hqXMpCnQZwGlYKIDg2.L_WQK9XVIMmOquHjUc5F7Rc18ePzNo.QQ0zkQmyH6g8EMOy3aG5MvGCtp7jBu4Vrlgg'
    };

    let response = await axios.post(url, payload, { headers });
    let data = response.data;

    while (data.length < 1 || !data[0].screenshots) {
        const rgameId = Math.floor(Math.random() * 276529);
        const payload = `fields name, screenshots.url;\r\nwhere id = ${rgameId};`;
        response = await axios.post(url, payload, { headers });
        data = response.data;
    }

    const gameId = data[0].id;

    const releaseDateUrl = "https://api.igdb.com/v4/release_dates";
    const releasePayload = `fields y, game;\r\nwhere game = ${gameId};\r\nsort y asc;`;
    const releaseResponse = await axios.post(releaseDateUrl, releasePayload, { headers });
    const releaseData = releaseResponse.data;

    const randSc = Math.floor(Math.random() * data[0].screenshots.length);
    const gameName = data[0].name;
    let imageUrl = data[0].screenshots[randSc].url;
    const releaseYear = releaseData.length ? releaseData[0].y : 'Unknown';

    imageUrl = `https://${imageUrl.slice(2)}`.replace("thumb", "1080p");

    return { imageUrl, gameName, releaseYear };
};

// Route to serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route to get the game data
app.get('/api/game', async (req, res) => {
    try {
        const { imageUrl, gameName, releaseYear } = await fetchAndDisplay();
        res.json({ imageUrl, gameName, releaseYear });
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred.');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
