/**
 * This file contains constants used in the tests of the PCR module.
 *
 */
import { Batch, Reagent } from "../interfaces/reagent";

export const DUMMY_REAGENT: Reagent = {
    id: "RTS150ING|U0623-017|250131|230626882",
    created_at: new Date('2021-01-01'),
    created_by: "1",
    initial_amount: 1,
    current_amount: 1,
    removals: [
        { id: "1", reagentID: "RTS150ING|U0623-017|250131|230626882", created_at: new Date(), created_by: "1", amount: 1, comment: "TEST" },
    ],
};

export const DUMMY_BATCH: Batch = {
    id: 'TEST_BATCH',

    kind: {
        id: '1',
        name: 'Standard',
    },

    analysis: {
        id: '1',
        name: 'ANA1',
    },

    device: {
        id: '1',
        name: 'InGe1',
    },

    created_at: new Date(),
    created_by: '1',
    initial_amount: 3,
    current_amount: 1,

    reagents: [
        {
            id: "RTS150ING|U0623-017|250131|230626882", initial_amount: 1, current_amount: 1, created_at: new Date(), created_by: "1", removals: [
                { id: "1", reagentID: "RTS150ING|U0623-017|250131|230626882", created_at: new Date(), created_by: "TEST", amount: 1, comment: "TEST" },
            ],
        },
        {
            id: "RTS150ING|U0623-017|250131|230626883", initial_amount: 2, current_amount: 0, created_at: new Date(), created_by: "1",
            removals: [
                { id: "1", reagentID: "RTS150ING|U0623-017|250131|230626883", created_at: new Date(), created_by: "TEST", amount: 1, comment: "TEST" },
                { id: "2", reagentID: "RTS150ING|U0623-017|250131|230626883", created_at: new Date(), created_by: "TEST", amount: 1, comment: "TEST" },
            ],
        },
    ]
};