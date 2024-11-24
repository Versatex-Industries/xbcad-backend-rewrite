const logger = (message, level = 'info') => {
    const timestamp = new Date().toISOString();
    switch (level) {
        case 'info':
            console.info(`[INFO] ${timestamp}: ${message}`);
            break;
        case 'warn':
            console.warn(`[WARN] ${timestamp}: ${message}`);
            break;
        case 'error':
            console.error(`[ERROR] ${timestamp}: ${message}`);
            break;
        default:
            console.log(`[LOG] ${timestamp}: ${message}`);
    }
};

module.exports = logger;
