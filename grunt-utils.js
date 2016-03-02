module.exports = {
  prettyifyJson: prettifyJson
};

/**
 * Prettify an object for debugging
 *
 * @param  {Object} obj    The object to prettify
 * @param  {Number} spaces Number of spaces to pad with
 * @return {String}        Formatted string of JSON
 */
function prettifyJson(obj, spaces) {
  return JSON.stringify(obj, null, spaces || 4);
}
