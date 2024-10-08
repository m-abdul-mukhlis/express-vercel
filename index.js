const axios = require('axios')
const cheerio = require('cheerio')
const cors = require('cors')
const bodyParser = require("body-parser");
const dotenv = require('dotenv');
const express = require('express')
const app = express()

dotenv.config();
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/src', express.static('src'))

app.get('/', (req, res) => {
  res.sendFile("index.html", { root: '.' })
})

app.post('/api/post_images', (req, res) => {
  const url = req?.body?.url
  axios(url).then((response) => {
    const $ = cheerio.load(response.data);
    const pic = [];
    const pictures = $('figure');
    const title = folderNamePreprocess($('title').text());
    for (let i = 0; i < pictures.length; i++) {
      let src = pictures[i.toString()].children[0].attribs.src;
      pic.push({ src: src, title: title });
    }
    res.status(200).json({ message: 'success', result: { data: pic, token: process.env.BOT_TOKEN } })
  }).catch((e) => {
    res.status(400).json({ message: e, result: {} })
  })
})

const folderNamePreprocess = (folder_name) => {
  folder_name = folder_name.replace(/[ |?<\\*:"']/g, '');
  return folder_name;
}

app.listen(process.env.PORT || 4000)

module.exports = app