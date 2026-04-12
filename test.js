/**
 * Manual S3/Contabo bucket test using filer + bucketizer.
 *
 * 1. Put `test.png` in this directory (same folder as this file).
 * 2. Replace the placeholder "test" values with real credentials and endpoint.
 * 3. From this package directory: `bun test.js`
 *
 * Uploads the same image twice under `public/…` and `private/…` key prefixes.
 * Prints the public URL for the public object and a presigned URL for the private one.
 *
 * If the public URL returns 403 in a browser: (1) turn on "Make public" for the bucket
 * in the Contabo Object Storage panel, and (2) set CONTABO_PUBLIC_URL_PREFIX to the exact
 * HTTPS prefix the panel shows (often https://REGION.contabostorage.com/TENANT:bucket-name).
 */

const path = require("path");
const fs = require("fs");

process.env.CONTABO_STORAGE_ACCESS_KEY = "fb87229dd5878bd57f05ddf4673cb859";
process.env.CONTABO_STORAGE_SECRET_KEY = "ceeb977184cdf02d731667cfe10451d8";
process.env.CONTABO_BUCKET_NAME = "divyadham";
process.env.CONTABO_BUCKET_REGION_URL = "https://sin1.contabostorage.com";
process.env.CONTABO_TENANT = "cf9234a7b7a94716b14d5c4404622f50";


const filer = require("./src/filer");
const bucketizer = require("./src/bucketizer");

const SOURCE_IMAGE = path.join(__dirname, "test.png");

/** @param {"public" | "private"} folder */
function buildObjectKey(folder) {
    const base = filer.generateRandomFileName(16);
    const ext = filer.getExtensionByFileName("test.png");
    return `${folder}/${base}.${ext}`;
}

async function main() {
    if (!fs.existsSync(SOURCE_IMAGE)) {
        console.error(`Missing ${SOURCE_IMAGE} — add test.png next to test.js`);
        process.exit(1);
    }

    const data = fs.readFileSync(SOURCE_IMAGE);

    const keyPublic = buildObjectKey("public");
    const keyPrivate = buildObjectKey("private");

    console.log("Uploading (public-read):", keyPublic);
    await bucketizer.bucketize(keyPublic, data, "public-read");

    console.log("Uploading (private):", keyPrivate);
    await bucketizer.bucketize(keyPrivate, data, "private");

    const publicUrl = await bucketizer.get({
        file_name: keyPublic,
        accumulator: "public",
    });
    const privateUrl = await bucketizer.get({
        file_name: keyPrivate,
        accumulator: "private",
    });

    console.log("\nPublic object URL (direct):\n", publicUrl);
    console.log("\nPrivate object presigned URL (~1h):\n", privateUrl);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
