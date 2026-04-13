/**
 * Combined service test:
 * 1) Mailer service via `src/mailer`
 * 2) Bucketizer service via `src/bucketizer` (`getPutter`)
 *
 * Run from `hammerbyte_utils/`:
 *   bun test/test.js
 */

const path = require("path");
const fs = require("fs/promises");

const { mailer, bucketizer, CONSTANTS } = require("..");

const MAILER_APPLICATION_ID = 1;
const MAILER_APPLICATION_TOKEN = "C05F575B1F670CF3";
const MAIL_TO = "hammerbyte.nisarg@gmail.com";
const TEST_FILE_NAME = "test.png";

const { SAAS } = CONSTANTS;

async function runMailerServiceTest() {
    console.log("\n=== Mailer Service Test ===");
    mailer.init({
        applicationId: MAILER_APPLICATION_ID,
        applicationToken: MAILER_APPLICATION_TOKEN,
    });

    const result = await mailer.send({
        recipient: MAIL_TO,
        subject: "Combined service test (hammerbyte_utils)",
        body: "Hello from test/test.js",
        html_enabled: false,
    });

    console.log("Mailer response:", result);
}

async function runBucketizerServiceTest() {
    console.log("\n=== Bucketizer Service Test ===");
    bucketizer.init({
        applicationId: MAILER_APPLICATION_ID,
        applicationToken: MAILER_APPLICATION_TOKEN,
    });

    const result = await bucketizer.getPutter(TEST_FILE_NAME, SAAS.ACCUMULATORS.PRIVATE);

    const { responseBody } = result;
    const putUrl = responseBody?.urls?.put;
    const getUrl = responseBody?.urls?.get;
    if (!putUrl || !getUrl) {
        throw new Error("Bucketizer response missing presigned put/get URLs");
    }

    const filePath = path.join(__dirname, "test.png");
    const fileBuffer = await fs.readFile(filePath);

    const putResponse = await fetch(putUrl, {
        method: "PUT",
        body: fileBuffer,
        headers: {
            "Content-Type": "image/png",
        },
    });

    if (!putResponse.ok) {
        const errText = await putResponse.text();
        throw new Error(`PUT to storage failed: ${putResponse.status} ${errText}`);
    }

    console.log(getUrl);
}

async function main() {
    // await runMailerServiceTest();
    await runBucketizerServiceTest();
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
