import { S3Client } from "bun";

class Bucketizer {
    constructor() {
        if (Bucketizer.instance) {
            return Bucketizer.instance;
        }
        // Configuration (can be read from Bun.env)
        this.client = new S3Client({
            accessKeyId: process.env.CONTABO_STORAGE_ACCESS_KEY,
            secretAccessKey: process.env.CONTABO_STORAGE_SECRET_KEY,
            bucket: process.env.CONTABO_BUCKET_NAME,
            endpoint: process.env.CONTABO_BUCKET_REGION_URL,
        });
        Bucketizer.instance = this;
    }

    async exists({ file_name }) {
        return await this.client.file(file_name).exists();
    }

    async get({ file_name, accumulator = "private" }) {
        const bucketFile = contaboStorageClient.file(file_name);
        return accumulator == "private"
            ? bucketFile.presign({ expiresIn: 3600 })
            : `${process.env.CONTABO_BUCKET_REGION_URL}/${process.env.CONTABO_BUCKET_NAME}/${file_name}`;
    }

    async bucketize(key, data, acl = "private") {
        const file = this.client.file(key);
        // Bun's S3 write returns a promise that resolves when the upload is complete
        return await file.write(data, { acl });
    }
}

const bucketizerInstance = new Bucketizer();
module.exports = bucketizerInstance;
