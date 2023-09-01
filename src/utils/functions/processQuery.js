/**
 * Process the song query if needed
 * @param {string} query input query from user
 * @returns {string} The processed query
 */
export function processQuery(query) {
  // Process the song query if needed
  // Return the processed query
  if (query.includes('youtube.com') && query.includes('list=')) {
    const queryParts = query.split('&si=');
    queryParts.pop();
    return queryParts.join('');
  } else {
    return query;
  }
}