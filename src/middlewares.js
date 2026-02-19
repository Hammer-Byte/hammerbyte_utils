const logger = require("./logger");

module.exports = {
    express: {
        requestLogger: async (req, res, next) => {
            logger.info(
                `Incoming Request - ${req.method} ${req.url} | USER_EMAIL : ${req?.user?.email} | Device : ${req?.device?.description} | Device Active : ${req?.device?.active}`,
            );
            next();
        },
    },
    bun: {
        requestLogger: async ({ request }) => {
            logger.info(`Incoming Request - ${request.method} ${request.url} | USER_EMAIL : ${request?.user?.email}`);
        },
    },
};
