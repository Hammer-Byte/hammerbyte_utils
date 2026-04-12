const { SAAS } = require("../constants");
const { HOST } = SAAS;

async function requestService({
    headers = {},
    service,
    path = "/",
    method = "GET",
    getQuery = false,
    body = false,
    onRequestStart = false,
    onResponseReceieved = false,
    onRequestFailure = false,
    onRequestEnd = false,
    parseResponseBody = true,
} = {}) {
    if (onRequestStart) await onRequestStart();

    // Build base URL
    let url = (HOST || "http://127.0.0.1:8080")
    .replace(/\/$/, "") // Remove trailing slash if exists

    if(service) {
        url = url.concat("/").concat(service);
    }

    if(path) {
        url = url.concat("/").concat(path);
    }

    console.log(url);

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

module.exports = requestService;
