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
