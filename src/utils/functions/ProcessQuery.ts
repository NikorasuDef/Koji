/**
 * Process the query to be used in the search function.
 * Removes unnecessary parts from YouTube playlist URLs.
 * @param query - Query to process
 * @returns Cleaned query or the original query if it doesn't match the expected format.
 */
export function processQuery(query: string): string {
  try {
    const youtubeRegex = new RegExp(/^(?:https?:\/\/)?(?:www\.)?(?:music\.)?youtube\.com\/playlist\?list=(.*)$/);
    const match = query.match(youtubeRegex);

    if (match) {
      const queryParts = query.split('&si=')
      queryParts.pop();
      
      console.log(queryParts);
      return queryParts.join('');
    } else {
      console.log(query)
      return query;
    }
  } catch (error) {
    console.error('Error processing query:', error);
    return query;
  }
}
