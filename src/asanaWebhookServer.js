const express = require("express");
const bodyParser = require("body-parser");
const { handleAsanaWebhookEvent } = require("./utils/asanaSync");

const app = express();
app.use(bodyParser.json());

app.post("/webhook/asana", async (req, res) => {
  if (req.headers["x-hook-secret"]) {
    res.set("X-Hook-Secret", req.headers["x-hook-secret"]);
    return res.status(200).send();
  }

  const events = req.body.events;
  for (const event of events) {
    await handleAsanaWebhookEvent(event);
  }

  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Asana webhook listener running on port ${PORT}`);
});
