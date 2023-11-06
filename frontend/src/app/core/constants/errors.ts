export class errors {
    public static AUTH = {
        INVALID_CREDENTIALS: 'Invalid username or password',
        UNAUTHORIZED: 'You are not authorized to access this page',
    };

    public static GENERAL = {
        BAD_REQUEST: 'Bad request',
        UNKNOWN: 'An unknown error occured',
        SERVER_ERROR: 'An error occured on the server',
    };

    public static BAK = {
        REAGENT_TRANSFER_FAILED: 'Reagent transfer failed',
    };
}