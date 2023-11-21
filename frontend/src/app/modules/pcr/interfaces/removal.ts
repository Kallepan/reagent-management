// Keep track of reagent removals by user and amount

export interface Removal {
    id: string;
    reagentID: string;
    at: Date;
    by: string;
    amount: number;
}

// Used to post a new removal
export interface CreateRemoval {
    reagentID: string;
    by: string;
    at: string;
    amount: number;
}