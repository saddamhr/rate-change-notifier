/**
 * Logs informational messages to the console.
 * @param {string} message - The message to log.
 */
function logInfo(message) {
    console.log(`INFO: ${message}`);
  }
  
  /**
   * Logs error messages to the console.
   * @param {string} message - The error message to log.
   */
  function logError(message) {
    console.error(`ERROR: ${message}`);
  }
  
  module.exports = { logInfo, logError };
  