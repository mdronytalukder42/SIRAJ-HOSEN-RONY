import { User, Role, IncomeEntry, EntryType, TicketEntry, TripType } from '../types';
import { sendNewEntryNotification } from './notificationService';

// --- MOCK DATABASE ---

// Internal type to hold passwords for mock login
interface MockUser extends User {
  password_cleartext: string;
}

const users: MockUser[] = [
  { id: '1', name: 'AL AMIN', username: 'admin9197', role: Role.Admin, password_cleartext: 'Admin9197' },
  { id: '2', name: 'RONY TALUKDER', username: 'ronytalukder', role: Role.Staff, password_cleartext: '@jead2016R' },
  { id: '3', name: 'MAHIR', username: 'mahir', role: Role.Staff, password_cleartext: 'Mahir3' },
  { id: '4', name: 'SAKIL ADNAN', username: 'sakiladnan', role: Role.Staff, password_cleartext: 'Sakiladnan' },
];

let incomeEntries: IncomeEntry[] = [];
let ticketEntries: TicketEntry[] = [];

// --- MOCK API FUNCTIONS ---

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const adminUser = users.find(u => u.role === Role.Admin);


export const apiLogin = async (username: string, pass: string, role: Role): Promise<User | null> => {
  await delay(500);
  const lowercasedUsername = username.toLowerCase();
  // FIX: Made password check case-insensitive to prevent common login failures.
  const userRecord = users.find(u => u.username.toLowerCase() === lowercasedUsername && u.role === role && u.password_cleartext.toLowerCase() === pass.toLowerCase());
  
  if (userRecord) {
    // Exclude password from the returned user object
    const { password_cleartext, ...userToReturn } = userRecord;
    return userToReturn;
  }
  
  return null;
};

export const apiLogout = () => {
    // Session is cleared in useAuth hook
    return Promise.resolve();
};

export const apiChangePassword = async (userId: string, currentPass: string, newPass: string): Promise<{ success: boolean, message: string }> => {
    await delay(500);
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
        return { success: false, message: 'User not found.' };
    }

    if (users[userIndex].password_cleartext !== currentPass) {
        return { success: false, message: 'Incorrect current password.' };
    }

    users[userIndex].password_cleartext = newPass;
    console.log(`User ${userId} password changed to ${newPass}`);
    return { success: true, message: 'Password updated successfully!' };
};


export const getStaffMembers = async (): Promise<User[]> => {
    await delay(300);
    // Exclude password from the returned user objects
    return users
        .filter(u => u.role === Role.Staff)
        .map(({ password_cleartext, ...userToReturn }) => userToReturn);
};

// --- INCOME ENTRY FUNCTIONS ---

export const getAllEntries = async (): Promise<IncomeEntry[]> => {
    await delay(500);
    return [...incomeEntries].sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateB.getTime() - dateA.getTime();
    });
};

export const getEntriesByUserId = async (userId: string): Promise<IncomeEntry[]> => {
    await delay(500);
    return incomeEntries.filter(e => e.userId === userId).sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateB.getTime() - dateA.getTime();
    });
};

export const addEntry = async (entry: Omit<IncomeEntry, 'id' | 'time'>): Promise<IncomeEntry> => {
    await delay(400);
    const newEntry: IncomeEntry = {
        ...entry,
        id: `e${Date.now()}`,
        time: new Date().toLocaleTimeString('en-GB')
    };
    incomeEntries.unshift(newEntry);
    
    // Trigger notification
    if (adminUser) {
        sendNewEntryNotification(newEntry, adminUser).catch(console.error);
    } else {
        console.warn('Admin user not found, skipping notification.');
    }
    
    return newEntry;
};

export const updateEntry = async (updatedEntry: IncomeEntry): Promise<IncomeEntry> => {
    await delay(400);
    const index = incomeEntries.findIndex(e => e.id === updatedEntry.id);
    if (index !== -1) {
        incomeEntries[index] = updatedEntry;
        return updatedEntry;
    }
    throw new Error('Entry not found');
};

export const deleteEntry = async (entryId: string): Promise<void> => {
    await delay(400);
    incomeEntries = incomeEntries.filter(e => e.id !== entryId);
};


// --- TICKET ENTRY FUNCTIONS ---

export const getAllTicketEntries = async (): Promise<TicketEntry[]> => {
    await delay(500);
    return [...ticketEntries].sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime());
};

export const getTicketEntriesByUserId = async (userId: string): Promise<TicketEntry[]> => {
    await delay(500);
    return ticketEntries.filter(t => t.userId === userId).sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime());
};

export const addTicketEntry = async (entry: Omit<TicketEntry, 'id'>): Promise<TicketEntry> => {
    await delay(400);
    const newEntry: TicketEntry = {
        ...entry,
        id: `t${Date.now()}`,
    };
    ticketEntries.unshift(newEntry);
    
    // Trigger notification
    if (adminUser) {
        sendNewEntryNotification(newEntry, adminUser).catch(console.error);
    } else {
        console.warn('Admin user not found, skipping notification.');
    }
    
    return newEntry;
};

export const updateTicketEntry = async (updatedEntry: TicketEntry): Promise<TicketEntry> => {
    await delay(400);
    const index = ticketEntries.findIndex(t => t.id === updatedEntry.id);
    if (index !== -1) {
        ticketEntries[index] = updatedEntry;
        return updatedEntry;
    }
    throw new Error('Ticket entry not found');
};

export const deleteTicketEntry = async (ticketId: string): Promise<void> => {
    await delay(400);
    ticketEntries = ticketEntries.filter(t => t.id !== ticketId);
};
