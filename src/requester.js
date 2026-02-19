class Requester {
    constructor() {
        if (Requester.instance) {
            return Requester.instance;
        }
        Requester.instance = this;
    }

    /**
     * Validates and sanitizes the request body
     */
    validateRequestBody(body = {}, requiredFields = []) {
        const missingFields = new Set();

        requiredFields.forEach((field) => {
            if (!(field in body)) missingFields.add(field);
        });

        const validatedBody = Object.keys(body).reduce((obj, key) => {
            let value = body[key];
            if (typeof value === "string") value = value.trim();

            if (requiredFields.includes(key)) {
                if (
                    (typeof value === "string" && value.length === 0) ||
                    (Array.isArray(value) && value.length === 0) ||
                    value === null ||
                    value === undefined
                ) {
                    missingFields.add(key);
                }
            }
            obj[key] = value;
            return obj;
        }, {});

        return {
            validatedRequestBody: validatedBody,
            isRequestBodyValid: missingFields.size === 0,
            missingRequestBodyFields: Array.from(missingFields),
        };
    }

    /**
     * Core service for making HTTP requests
     */
    async requestService({
        requestHeaders = {},
        requestServiceName,
        requestPath = "/",
        requestMethod = "GET",
        requestGetQuery = false,
        requestPostBody = false,
        onRequestStart = false,
        onResponseReceieved = false,
        onRequestFailure = false,
        onRequestEnd = false,
        parseResponseBody = true,
    } = {}) {
        if (onRequestStart) await onRequestStart();

        // Build base URL
        let url = (process.env.SERVICE_NGINX || "http://127.0.0.1:8080")
            .replace(/\/$/, "") // Remove trailing slash if exists
            .concat("/")
            .concat(requestServiceName)
            .concat(requestPath);

        // Append Query Parameters
        if (requestGetQuery) {
            const queryParams = new URLSearchParams(requestGetQuery).toString();
            url += `?${queryParams}`;
        }

        const fetchOptions = {
            method: requestMethod.toUpperCase(),
            headers: {
                ...(!(requestPostBody instanceof (global.FormData || Object)) && { "Content-Type": "application/json" }),
                ...requestHeaders,
            },
        };

        if (requestPostBody) {
            fetchOptions.body = requestPostBody instanceof (global.FormData || Object) ? requestPostBody : JSON.stringify(requestPostBody);
        }

        try {
            const response = await fetch(url, fetchOptions);
            let result = response;

            if (parseResponseBody) {
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    result = await response.json();
                } else {
                    result = await response.text();
                }
            }

            if (onResponseReceieved) await onResponseReceieved(result, response.status);
            return result; // Return result for easier async/await usage
        } catch (e) {
            if (onRequestFailure) await onRequestFailure(e);
            throw e; // Re-throw so the caller knows it failed
        } finally {
            if (onRequestEnd) await onRequestEnd();
        }
    }
}

const requesterInstance = new Requester();
module.exports = requesterInstance;
