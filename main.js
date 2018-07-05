import express from 'express';
import fetch from 'node-fetch';
const app = express();
const router = express.Router();

router.use((req, res, next) => {
  fetch('https://api.github.com/meta')
    .then(response => response.json())
    .then(jsonData => {
      jsonData.hooks.forEach(url => {
        if (url.contains(req.connection.remoteAddress)) {
          next();
          return;
        }
      });
      res.status(403).send('Not valid GitHub IP');
    });
});

router.post('portfolio', (req, res) => {
  shell.exec('./depoly-website.sh');
});

app.use('/webhooks', router);
const port = 4567;
app.listen(port, error => {
  if (error) {
    return console.error(error);
  }

  console.log(`Server is listening on ${port}`);
});
