"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const cloudfront_signer_1 = require("@aws-sdk/cloudfront-signer"); // ESM
const privateKey = fs_1.default.readFileSync(path_1.default.join(__dirname, './private.pem'));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
const cloudfrontDistributionDomain = "https://d3uxzurwtdsya.cloudfront.net";
const s3ObjectKey = "aws-logo.png";
const url = `${cloudfrontDistributionDomain}/${s3ObjectKey}`;
const keyPairId = process.env.AWS_KEY_PAIR_ID;
const startDate = new Date();
startDate.setMinutes(startDate.getMinutes() + 5);
const dateLessThan = startDate.toLocaleString(); // any Date constructor compatible
const signedUrl = (0, cloudfront_signer_1.getSignedUrl)({
    url,
    keyPairId,
    dateLessThan,
    privateKey,
});
console.log('<===== signedUrl =====>', signedUrl);
app.get("/", (req, res) => {
    res.send("Express + TypeScript Server");
});
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
