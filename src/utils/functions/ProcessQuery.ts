/**
 * Process the query to be used in the search function
 * @param query - Query to process
 */
export function processQuery(query: string): string {
  
  const youtubeRegex = new RegExp(/^(?:https?:\/\/)?(?:www\.)?(?:music\.)?youtube\.com\/playlist\?list=(.*)$/);

  if (query.match(youtubeRegex)) {
    const queryParts = query.split('&si=');
    queryParts.pop();
    return queryParts.join('');
  } else {
    return query;
  }
}