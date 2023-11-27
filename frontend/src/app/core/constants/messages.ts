export class messages {
    public static AUTH = {
        LOGGED_IN: 'Login erfolgreich',
        LOGGED_OUT: 'Logout erfolgreich',

        INVALID_CREDENTIALS: 'Ungültiger Identifier oder Passwort',
        UNAUTHORIZED: 'Sie sind nicht berechtigt, diese Funktion auszuführen',
        FORBIDDEN: 'Sie dürfen diese Funktion nicht ausführen',
    };

    public static BAK = {
        REAGENT_TRANSFER_SUCCESS: 'Die Reagenz wurde erfolgreich aktualisiert',
        NO_LOT_FOUND: 'Keine Lotnummer gefunden',

        LOT_UPDATE_SUCCESS: 'Die Lot wurde erfolgreich aktualisiert',
        LOT_CREATE_SUCCESS: 'Die Lot wurde erfolgreich erstellt',
    };

    public static GENERAL = {
        BAD_REQUEST: 'Bad request',
        UNKNOWN_ERROR: 'An unknown error occured',
        UPDATE_FAILED: 'Update fehlgeschlagen',
        SERVER_ERROR: 'An error occured on the server',
        FEATURE_FLAG_DISABLED: 'Diese Funktion ist fuer Sie nicht verfügbar',
        FEATURE_NOT_IMPLEMENTED: 'Diese Funktion ist noch nicht implementiert',
        NO_RESULTS_FOUND: 'Keine Ergebnisse gefunden',
    };
}