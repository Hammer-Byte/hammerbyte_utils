const requestService = require("./requester");
const { SAAS } = require("../constants");
const { HEADERS, SERVICES } = SAAS;

class Mailer {
    constructor() {
        if (Mailer.instance) {
            return Mailer.instance;
        }

        this.applicationId = undefined;
        this.applicationToken = undefined;

        Mailer.instance = this;
    }

    /**
     * Call once at app startup with SaaS API credentials.
     */
    init({ applicationId, applicationToken } = {}) {
        this.applicationId = applicationId;
        this.applicationToken = applicationToken;
    }

    async send({ to, subject, body, html_enabled = false } = {}) {
        return requestService({
            service: SERVICES.MAILER,
            path: "mails",
            method: "POST",
            headers: {
                [HEADERS.APPLICATION_ID]: this.applicationId,
                [HEADERS.APPLICATION_TOKEN]: this.applicationToken,
            },
            body: { to, subject, body, html_enabled },
        });
    }
}

const mailerInstance = new Mailer();
module.exports = mailerInstance;
