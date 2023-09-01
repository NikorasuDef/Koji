/**
 * Process the song query if needed
 * @param {string} query input query from user
 * @returns {string} The processed query
 */
export function processQuery(query) {
  // Process the song query if needed
  // Return the processed query
  const youtubeDomains = [
    'youtube.com',
    'www.youtube.com',
    'music.youtube.com',
    'www.music.youtube.com'
  ];

  if (youtubeDomains.some(domain => query.includes(domain)) && query.includes('&list=')) {
    const queryParts = query.split('&si=');
    queryParts.pop();
    return queryParts.join('');
  } else {
    return query;
  }
}