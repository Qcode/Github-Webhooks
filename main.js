import express from 'express';
import crypto from 'crypto';
import bodyParser from 'body-parser';
import shell from 'shelljs';
const app = express();
const router = express.Router();

router.use(bodyParser.text({ type: 'application/json' }));

router.use((req, res, next) => {
  const signature = req.get('X-Hub-Signature');
  if (!signature) {
    res.status(400).send('No GitHub SHA signature');
    return;
  }

  if (!process.env.WEBHOOK_TOKEN) {
    res.status(500).send('No Webhook Token set on server');
    return;
  }

  if (!req.body) {
    res.status(400).send('No body in request');
    return;
  }

  const hash = Buffer.from(
    crypto
      .createHmac('sha1', process.env.WEBHOOK_TOKEN)
      .update(req.body)
      .digest('hex'),
    'utf-8'
  );

  const stringToValidate = Buffer.from(
    req.get('X-Hub-Signature').substring(5),
    'utf-8'
  );

  if (crypto.timingSafeEqual(hash, stringToValidate)) {
    next();
    return;
  }

  res.status(403).send('Invalid SHA-1 signature');
});

router.post('/portfolio', (req, res) => {
  res.status(200).send('Deployed website');
  shell.exec('./deploy-website.sh');
});

app.use('/webhooks', router);
const port = 4567;
app.listen(port, error => {
  if (error) {
    return console.error(error);
  }

  console.log(`Server is listening on ${port}`);
});
