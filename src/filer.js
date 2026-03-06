const libCrypto = require("crypto");
const libFs = require("fs");
const libPath = require("path");

class Filer {
    constructor() {
        if (Filer.instance) {
            return Filer.instance;
        }
        Filer.instance = this;
    }

    generateRandomFileName(length = 16) {
        return libCrypto
            .randomBytes(length)
            .toString("base64")
            .replace(/[^a-zA-Z0-9]/g, "")
            .slice(0, length);
    }

    prepareDirectories(directories, basePath = process.cwd()) {
        const dirList = Array.isArray(directories) ? directories : [directories];
        dirList.forEach((dir) => {
            const fullPath = libPath.resolve(basePath, dir);
            if (!libFs.existsSync(fullPath)) {
                libFs.mkdirSync(fullPath, { recursive: true });
            }
        });
    }

    getContentTypeByFileName(fileName) {
        const mimeTypes = {
            // Images
            jpg: "image/jpeg",
            jpeg: "image/jpeg",
            png: "image/png",
            gif: "image/gif",
            webp: "image/webp",
            svg: "image/svg+xml",
            // Videos
            mp4: "video/mp4",
            mov: "video/quicktime",
            avi: "video/x-msvideo",
            mkv: "video/x-matroska",
            webm: "video/webm",
            // Audio
            mp3: "audio/mpeg",
            wav: "audio/wav",
            ogg: "audio/ogg",
            // Documents
            pdf: "application/pdf",
            doc: "application/msword",
            docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            xls: "application/vnd.ms-excel",
            xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            ppt: "application/vnd.ms-powerpoint",
            pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            csv: "text/csv",
            txt: "text/plain",
            // Archives
            zip: "application/zip",
            rar: "application/x-rar-compressed",
        };

        return mimeTypes[fileName.split(".").pop().toLowerCase()] ?? "application/octet-stream";
    }

    getExtensionByFileName(fileName) {
        return fileName.split(".").pop();
    }

    prepareTemplated(templatePath, injects) {
        try {
            const absolutePath = libPath.resolve(process.cwd(), templatePath);
            let content = libFs.readFileSync(absolutePath, "utf8");

            for (const [key, value] of Object.entries(injects)) {
                const placeholder = new RegExp(`{{${key}}}`, "g");
                content = content.replace(placeholder, value);
            }
            return content;
        } catch (error) {
            throw new Error(`File: Template error at ${templatePath}. ${error.message}`);
        }
    }
}

const filerInstance = new Filer();
module.exports = filerInstance;
