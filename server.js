const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.static(__dirname, { index: "index.html" }));

app.listen(PORT, () => {
  console.log(`Art website running at http://localhost:${PORT}`);
});
