export class messages {
    public static AUTH = {
        LOGGED_IN: 'Logged in successfully',

        INVALID_CREDENTIALS: 'Invalid username or password',
        UNAUTHORIZED: 'You are not authorized to access this page',
        FORBIDDEN: 'You are not allowed to access this page',
    };

    public static BAK = {
        REAGENT_TRANSFER_SUCCESS: 'Reagent transfer successful',
        REAGENT_TRANSFER_FAILED: 'Reagent transfer failed',
        NO_LOT_FOUND: 'No lot found',
    };

    public static GENERAL = {
        BAD_REQUEST: 'Bad request',
        UNKNOWN: 'An unknown error occured',
        SERVER_ERROR: 'An error occured on the server',
    };
}