const ERRORS = {
    UNAUTHORIZED: "Unauthorized",
    MISSING_FILE: "File name is required",
    MISSING_ACCUMULATOR: "Accumulator is required",
};

// HammerByte SaaS client + API: headers, base URL, service path segments.
const SAAS = {
    HEADERS: {
        APPLICATION_ID: "application-id",
        APPLICATION_TOKEN: "application-token",
    },
    HOST: "https://hammerbyte.co.in/api/services",
    // HOST: "https://your-production-saas.example",
    SERVICES: {
        MAILER: "mailer",
        BUCKETIZER: "bucketizer",
        TEXTER: "texter",
    },
    ACCUMULATORS: {
        PRIVATE: "private",
        PUBLIC: "public-read",
    },
};

module.exports = { ERRORS, SAAS };
