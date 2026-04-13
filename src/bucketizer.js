const requestService = require("./saas/requester");
const { SAAS } = require("./constants");

class Bucketizer {
    constructor() {
        if (Bucketizer.instance) {
            return Bucketizer.instance;
        }

        this.applicationId = undefined;
        this.applicationToken = undefined;

        Bucketizer.instance = this;
    }

    /**
     * Call once at app startup with SaaS API credentials.
     */
    init({ applicationId, applicationToken } = {}) {
        this.applicationId = applicationId;
        this.applicationToken = applicationToken;
    }

    async getPutter(file, accumulator) {
        return requestService({
            service: SAAS.SERVICES.BUCKETIZER,
            path: "",
            method: "POST",
            headers: {
                [SAAS.HEADERS.APPLICATION_ID]: String(this.applicationId),
                [SAAS.HEADERS.APPLICATION_TOKEN]: this.applicationToken,
            },
            body: { file, accumulator },
        });
    }
}


const bucketizerInstance = new Bucketizer();
module.exports = bucketizerInstance;
