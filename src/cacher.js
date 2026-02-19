class Cacher {
    constructor() {
        if (Cacher.instance) {
            return Cacher.instance;
        }
        this._cache = {};
        Cacher.instance = this;
    }

    /**
     * Adds data to the cache using a generator function
     * @param {string} key
     * @param {function} dataGenerator - An async function that returns data
     */
    async add(key, dataGenerator) {
        try {
            const data = await dataGenerator();
            this._cache[key] = { data, dataGenerator };
            return data;
        } catch (error) {
            throw new Error(`Cache: Failed to add KEY:${key}. ${error.message}`);
        }
    }

    /**
     * Retrieves data from the cache by key
     */
    get(key) {
        return this._cache[key]?.data;
    }

    /**
     * Re-runs the generator function to update the stored data
     */
    async refresh(key) {
        if (!this._cache[key]) {
            throw new Error(`Cache: Cannot refresh non-existent KEY:${key}`);
        }

        try {
            const data = await this._cache[key].dataGenerator();
            this._cache[key].data = data;
            return data;
        } catch (error) {
            throw new Error(`Cache: Failed to refresh KEY:${key}. ${error.message}`);
        }
    }

    /**
     * Returns all currently cached keys
     */
    getKeys() {
        return Object.keys(this._cache);
    }
}

const cacherInstance = new Cacher();
module.exports = cacherInstance;
