import dotenv from "dotenv";
import { App } from "octokit";
import { createNodeMiddleware } from "@octokit/webhooks";
import fs from "fs";
import http from "http";
import SmeeClient from 'smee-client'

dotenv.config();

// Github app sensitive information

const appId = process.env.APP_ID;
const webhookSecret = process.env.WEBHOOK_SECRET;
const privateKeyPath = process.env.PRIVATE_KEY_PATH;

const privateKey = fs.readFileSync(privateKeyPath, "utf-8");

const app = new App({
  appId: appId,
  privateKey: privateKey,
  webhooks: {
    secret: webhookSecret
  }
});

const messageForNewPRs = "¡Gracias pibe!"
async function handlePullRequestOpened({ octokit, payload }) {
  console.log(`Received a PR event for #${payload.pull_request.number}`);

  try {
    await octokit.request("POST /repos/{owner}/{repo}/issues/{issue_number}/comments", {
      owner: payload.repository.owner.login,
      repo: payload.repository.name,
      issue_number: payload.pull_request.number,
      body: messageForNewPRs,
      headears: {
        "x-github-api-version": "2022-11-28"
      },
    });
  }
  catch (error) {
    if (error.response) {
      console.error(`Error! status: ${error.response.status}. Message: ${error.response.data.message}`)
    }
    console.error(error)
  };
}
app.webhooks.on("pull_request.opened", handlePullRequestOpened);

  app.webhooks.onError((error) => {
    if (error.name === "AggregateError") {
      console.error(`Error processing request: ${error.event}`);
    } else {
      console.error(error)
    }
  });


  const port = 3000;
  const host = 'localhost';
  const path = "/api/webhook";
  const localWebhookUrl = `https://${host}:${port}${path}`;

  const middleware = createNodeMiddleware(app.webhooks, { path });

  http.createServer(middleware).listen(port, ()=>{
    console.log(`Server is listening for events at:${localWebhookUrl}`);
    console.log('Press CTRL + C to quit')
  });
  
const smee = new SmeeClient({
  source: process.env.WEBHOOK_PROXY_URL,
  target: 'http://localhost:3000/events',
  logger: console
});
const events = smee.start();

// Stop forwarding events
events.close()