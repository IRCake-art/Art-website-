require('dotenv').config();
const express = require('express');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key:    process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const app = express();
const PORT = 3000;

app.use(express.static(__dirname, { index: 'index.html' }));

const FOLDER_MAP = {
  doodle:  'Doodles',
  digital: 'Digital',
};

app.get('/api/images/:tab', async (req, res) => {
  const { tab } = req.params;
  const folder = FOLDER_MAP[tab];
  if (!folder) return res.status(400).json({ error: 'Unknown tab' });

  try {
    const result = await cloudinary.search
      .expression(`folder:${folder}`)
      .sort_by('public_id', 'asc')
      .max_results(100)
      .execute();

    const images = result.resources.map(r => ({
      src: r.secure_url,
      alt: r.public_id,
    }));

    res.json(images);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
});

app.listen(PORT, () => {
  console.log(`Art website running at http://localhost:${PORT}`);
});
