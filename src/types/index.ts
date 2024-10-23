export interface Timestamp {
    seconds: number;
    nanoseconds: number;
}

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    createdAt: {
        seconds: number;
        nanoseconds: number;
    };
    phoneNumber: string;
}

export type CashbackStatus = 'pending' | 'success' | 'error';
