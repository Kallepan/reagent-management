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

    MAX_REAGENT_AMOUNT: 'Maximale Menge sind 999',
  };

  public static PCR = {
    INVALID_DATA: 'Ungültige Daten',

    SEARCH_ERROR: 'Fehler beim Suchen der Reagenz',
    NO_BATCHES_FOUND: 'Keinen Batch gefunden',
    MULTIPLE_BATCHES_FOUND: 'Mehrere Batch gefunden',

    REMOVAL_CREATE_SUCCESS: 'Die Reagenz wurde erfolgreich entnommen',
    REMOVAL_CREATE_FAILED: 'Die Reagenz konnte nicht entnommen werden',

    REMOVAL_DELETE_SUCCESS: 'Die Entnahme wurde erfolgreich gelöscht',
    REMOVAL_DELETE_FAILED: 'Die Entnahme konnte nicht gelöscht werden',

    REAGENT_CREATE_SUCCESS: 'Die Reagenz wurde erfolgreich erstellt',
    REAGENT_CREATE_ERROR: 'Die Reagenz konnte nicht erstellt werden',

    BATCH_DELETE_SUCCESS: 'Der Batch wurde erfolgreich gelöscht',
    BATCH_DELETE_FAILED: 'Der Batch konnte nicht gelöscht werden',

    REMOVAL_MAX_REACHED: 'Maximale empfohlene Anzahl an Entnahmen erreicht',
  };

  public static GENERAL = {
    BAD_REQUEST: 'Bad request',
    UNKNOWN_ERROR: 'An unknown error occured',
    UPDATE_FAILED: 'Update fehlgeschlagen',
    SERVER_ERROR: 'Ein Serverfehler ist aufgetreten',
    FEATURE_FLAG_DISABLED: 'Diese Funktion ist fuer Sie nicht verfügbar',
    FEATURE_NOT_IMPLEMENTED: 'Diese Funktion ist noch nicht implementiert',
    NO_RESULTS_FOUND: 'Keine Ergebnisse gefunden',

    FORM_ERRORS: {
      MIN: 'Wert muss größer oder gleich sein',
      MAX: 'Wert muss kleiner oder gleich sein',
      REQUIRED: 'Dieses Feld ist erforderlich',
      MIN_LENGTH: 'Mindestlänge ist',
      MAX_LENGTH: 'Maximale Länge ist',
      PATTERN: 'Ungültiges Format',
    },
  };
}
