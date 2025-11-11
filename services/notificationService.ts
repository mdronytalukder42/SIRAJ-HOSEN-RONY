import { IncomeEntry, TicketEntry, EntryType, User } from '../types';

// This is a mock service. In a real application, this would use the SendGrid API.
// We'll simulate finding the admin and sending an email.
const ADMIN_EMAIL = 'admin@amintouch.com'; // Mock admin email

// Type guard to check if an entry is an IncomeEntry
const isIncomeEntry = (entry: IncomeEntry | TicketEntry): entry is IncomeEntry => {
    return 'amount' in entry && 'type' in entry;
};

export const sendNewEntryNotification = async (entry: IncomeEntry | TicketEntry, adminUser: User): Promise<void> => {
    console.log('--- Simulating SendGrid Email Notification ---');
    
    let subject = '';
    let body = '';
    let notificationMessage = '';

    if (isIncomeEntry(entry)) {
        subject = `New Income/OTP Entry by ${entry.userName}`;
        notificationMessage = `New Income/OTP entry from ${entry.userName}: ${entry.type} - ${entry.amount.toFixed(2)} QR`;
        body = `
            Hello ${adminUser.name},

            A new entry has been added by staff member ${entry.userName}.

            Details:
            - Date: ${entry.date}
            - Time: ${entry.time}
            - Type: ${entry.type}
            - Amount: ${entry.amount.toFixed(2)} QR
            - Description: ${entry.description}
            ${(entry.type === EntryType.IncomePayment || entry.type === EntryType.OTPPayment) && entry.recipient ? `- Recipient: ${entry.recipient}\n` : ''}
            Please review this entry in the Admin Dashboard.

            Thank you,
            AMIN TOUCH System
        `;
    } else { // It's a TicketEntry
        subject = `New Ticket Entry by ${entry.userName}`;
        notificationMessage = `New Ticket entry from ${entry.userName} for ${entry.passengerName} (PNR: ${entry.pnr})`;
        body = `
            Hello ${adminUser.name},

            A new ticket entry has been added by staff member ${entry.userName}.

            Details:
            - Issue Date: ${entry.issueDate}
            - Passenger: ${entry.passengerName}
            - PNR: ${entry.pnr}
            - Route: ${entry.from} -> ${entry.to}
            - Airline: ${entry.flightName}

            Please review this entry in the Admin Dashboard.

            Thank you,
            AMIN TOUCH System
        `;
    }

    const emailPayload = {
        to: ADMIN_EMAIL,
        from: 'noreply@amintouch.system',
        subject: subject,
        text: body.trim().replace(/^\s+/gm, ''), // Clean up indentation for logging
    };

    console.log('Sending email with payload:', emailPayload);
    // In a real implementation with a backend, you would make an API call here, e.g.:
    // await fetch('/api/send-email', { method: 'POST', body: JSON.stringify(emailPayload) });
    console.log(`Email "sent" successfully to ${ADMIN_EMAIL}`);
    console.log('-------------------------------------------');

    // Dispatch a custom event for the UI to catch
    window.dispatchEvent(new CustomEvent('newAdminNotification', {
        detail: { id: Date.now(), message: notificationMessage }
    }));


    // Simulate network delay for the notification
    await new Promise(resolve => setTimeout(resolve, 200));
};
