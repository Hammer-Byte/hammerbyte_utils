const requestService = require("./saas/requester");
const { SAAS } = require("./constants");

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

    async send(email) {
        return requestService({
            service: SAAS.SERVICES.MAILER,
            path: "",
            method: "POST",
            headers: {
                [SAAS.HEADERS.APPLICATION_ID]: this.applicationId,
                [SAAS.HEADERS.APPLICATION_TOKEN]: this.applicationToken,
            },
            body: email,
        });
    }
}

const mailerInstance = new Mailer();
module.exports = mailerInstance;
