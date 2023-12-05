/** 
 *  Due to wrong configurations of the computers using this app, the scanners often return faulty data.
 * This function is used to clean the query string from the scanner.
 * Expected Format: RTS150ING|U0623-017|250131|230626882
 * possible cases:
 * - RTS150ING|U0623-017|250131|230626882
 * - RTS150ING'U0623-017'250131'230627233
 * - RTS150ING'U0623ß017'250131'230625286
**/
export const cleanQuery = (query: string): string => {
    // replace all ' with |
    query = query.replace(/'/g, '|');
    // replace all ß with -
    query = query.replace(/ß/g, '-');

    return query;
}