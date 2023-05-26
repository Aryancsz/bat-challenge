import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import AWS from "aws-sdk";
const privateKey = fs.readFileSync(path.join(__dirname, "./private.pem"));

dotenv.config();

const keyPairId = process.env.AWS_KEY_PAIR_ID as string;

const app: Express = express();
const port = process.env.PORT;

const cloudfront = new AWS.CloudFront.Signer(
  keyPairId,
  privateKey.toString()
);

const cloudfrontDistributionDomain = "https://d3uxzurwtdsya.cloudfront.net";
const s3ObjectKey = "aws-logo.png";
const url = `${cloudfrontDistributionDomain}/${s3ObjectKey}`;
const startDate = new Date();
startDate.setMinutes(startDate.getMinutes() + 5);
const expires = startDate.valueOf()
const response = cloudfront.getSignedUrl({
  url,
  expires: expires,
});
console.log('<===== signedUrl =====>', response);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
