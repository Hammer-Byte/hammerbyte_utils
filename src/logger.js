const libChalk = require("chalk");
const libFs = require("fs");
const libPath = require("path");
const libOS = require("os");

class Logger {
    constructor() {
        if (Logger.instance) {
            return Logger.instance;
        }

        // Default values
        this.logsDirectory = "logs";
        this.saveLogs = false;
        this.log = console.log;

        Logger.instance = this;
    }

    /**
     * Users call this once at the start of their app
     */
    init({ logsDirectory = "logs", saveLogs = false } = {}) {
        this.logsDirectory = logsDirectory;
        this.saveLogs = saveLogs;
    }

    _getCurrentDateTime() {
        const now = new Date();
        const time = [
            now.getHours().toString().padStart(2, "0"),
            now.getMinutes().toString().padStart(2, "0"),
            now.getSeconds().toString().padStart(2, "0"),
        ].join(":");
        return { now, time };
    }

    info(msg) {
        const { now, time } = this._getCurrentDateTime();
        const output = `[#]${time} [INFO]    -> ${msg}`;
        this.log(libChalk.blue(output));
        this._save(now, output);
    }

    success(msg) {
        const { now, time } = this._getCurrentDateTime();
        const output = `[+]${time} [SUCCESS] -> ${msg}`;
        this.log(libChalk.green(output));
        this._save(now, output);
    }

    error(msg) {
        const { now, time } = this._getCurrentDateTime();
        const output = `[-]${time} [ERROR]   -> ${msg}`;
        this.log(libChalk.red(output));
        this._save(now, output);
    }

    _save(now, output) {
        if (this.saveLogs) {
            // Added .log extension for better file recognition
            const fileName = now.toLocaleDateString("en-GB").replace(/\//g, "-") + ".log";
            const path = libPath.join(this.logsDirectory, fileName);

            if (!libFs.existsSync(this.logsDirectory)) {
                libFs.mkdirSync(this.logsDirectory, { recursive: true });
            }

            libFs.appendFile(path, output + libOS.EOL, (err) => {
                if (err) this.log(libChalk.red(`[-] Log Save Error: ${err}`));
            });
        }
    }
}

const loggerInstance = new Logger();
// We don't freeze it yet so that .init() can change the config properties
module.exports = loggerInstance;
