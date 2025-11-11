export enum Role {
  Admin = 'ADMIN',
  Staff = 'STAFF',
}

export interface User {
  id: string;
  name: string;
  username: string;
  role: Role;
}

export enum EntryType {
    IncomeAdd = 'Income Add',
    IncomeMinus = 'Income Minus',
    IncomePayment = 'Income Payment',
    OTPAdd = 'OTP Add',
    OTPMinus = 'OTP Minus',
    OTPPayment = 'OTP Payment',
}

export interface IncomeEntry {
    id: string;
    userId: string;
    userName: string;
    date: string;
    time: string;
    type: EntryType;
    amount: number;
    description: string;
    recipient?: string;
}

export enum TripType {
    OneWay = '1 Way',
    Return = 'Return',
}

export interface TicketEntry {
    id:string;
    userId: string;
    userName: string;
    issueDate: string;
    passengerName: string;
    pnr: string;
    tripType: TripType;
    flightName: string;
    from: string;
    to: string;
    departureDate: string;
    arrivalDate: string;
    returnDate?: string;
    fromIssuer: string;
    bdNumber?: string;
    qrNumber?: string;
    ticketCopy: { fileName: string; dataUrl: string } | null;
}