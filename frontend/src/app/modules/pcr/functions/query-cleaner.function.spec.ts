import { cleanQuery } from "./query-cleaner.function";

describe('QueryCleaner', () => {

    let testCases = [
        "RTS150ING|U0623-017|250131|230626882",
        "RTS150ING'U0623-017'250131'230626882",
        "RTS150ING'U0623ß017'250131'230626882",
    ];

    testCases.forEach((testCase) => {
        it(`should clean ${testCase}`, () => {
            expect(cleanQuery(testCase)).toEqual('RTS150ING|U0623-017|250131|230626882');
        });
    });
});
