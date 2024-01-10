// Keep track of reagent removals by user and amount

export interface Removal {
    id: string;
    reagentID: string;
    created_at: Date;
    created_by: string;
    amount: number;
    comment: string;
}

// Used to post a new removal
export interface CreateRemoval {
    reagent_id: string;
    created_by: string;
    amount: number;
    comment: string;
}