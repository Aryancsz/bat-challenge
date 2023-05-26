import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import fs from 'fs'
import path from 'path'
import { getSignedUrl } from "@aws-sdk/cloudfront-signer"; // ESM
dotenv.config();


const privateKey = fs.readFileSync(path.join(__dirname, './private.pem'))
const keyPairId = process.env.AWS_KEY_PAIR_ID as string;


const app: Express = express();
const port = process.env.PORT;

const cloudfrontDistributionDomain = "https://d3uxzurwtdsya.cloudfront.net";
const s3ObjectKey = "aws-logo.png";
const url = `${cloudfrontDistributionDomain}/${s3ObjectKey}`;
// 5min expire  time
const startDate = new Date();
startDate.setMinutes(startDate.getMinutes() + 5)
const dateLessThan = startDate.toLocaleString(); // any Date constructor compatible

const signedUrl = getSignedUrl({
  url,
  keyPairId,
  dateLessThan,
  privateKey,
});
console.log('<===== signedUrl =====>', signedUrl);


app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
