export declare type Case = {
    id: string;
    created_at: string;
    userId: string;
    resolved: string;
    definitions: {
        gov: string[][];
        opp: string[][];
    };
    contentions: {
        gov: Contention[];
        opp: Contention[];
    };
    framework: {
        gov: string;
        opp: string;
    }
    rounds: Round[];
}

export declare type Contention = {
    contention: string;
    warrant: string;
    impact: string;
}

export declare type Round = {
    round: number;
    side: "gov" | "opp";
    opponent_contentions: Contention[];
    opponent_definitions: string[][];
    opponent_framework: string;
    notes: string;
}