const { SAAS } = require("../constants");

async function requestService({ headers = {}, service, path = "/", method = "GET", getQuery = false, body = false } = {}) {
    // Build base URL
    let url = (SAAS.HOST || "http://127.0.0.1:8080").replace(/\/$/, ""); // Remove trailing slash if exists

    if (service) {
        url = url.concat("/").concat(service);
    }

    if (path) {
        url = url.concat("/").concat(path);
    }

    // Append Query Parameters
    if (getQuery) {
        const queryParams = new URLSearchParams(getQuery).toString();
        url += `?${queryParams}`;
    }

    const fetchOptions = {
        method: method.toUpperCase(),
        headers: {
            ...(!(body instanceof (global.FormData || Object)) && { "Content-Type": "application/json" }),
            ...headers,
        },
    };

    if (body) {
        fetchOptions.body = body instanceof (global.FormData || Object) ? body : JSON.stringify(body);
    }

    const response = await fetch(url, fetchOptions);
    const result = {
        responseCode: response.status,
        responseBody: undefined,
    };

    const raw = await response.text();
    try {
        result.responseBody = raw ? JSON.parse(raw) : raw;
    } catch (error) {
        result.responseBody = raw;
    }

    return result;
}

module.exports = requestService;
