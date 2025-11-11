
import { IncomeEntry, User, EntryType, TicketEntry } from '../types';

declare const jspdf: any;

const logoBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAGfUExURQAAANqcRsGgT7yYR7ucSLGSRquNR6aJR6aJR6aJR6WIRqWERJ+DER9JDRw/CxU0CNyjSMGlUrOiTbifS7WgS7GbSrGYSKyRSKqPSKeKR6GHR56FRZ2ERZqDRZiBRZeBRJWARJSAQ5F/QpB+Qot6PId3PId2PIZ2PIV1PIV1O4N0OoNzOn9xOX1wOYFsM3hpH3JmHHFkG29hGG5fF2xeFnFbE3VaE3pbE3xbFHtcEn5cEIBcDoNaD4RZD4laEIlbEYtcEo1eE49fFJFgFZJiFpVkF5hmGZpoGpxqG59tHZ9tHaFuHqNyIKRzIadyIKh1Ia56JKt5I697JbB+J7J/KLWAKbaCK7iELb+IাবলীরKbOULrGUrjEVrXBUK/ASavASajASqi/SaW9SKG6R523RpuzRJixQ5KwQY+uP4yoPoenPIWjNoGgMoCgMoCgM4SjNX+eMHybLXqYLXCWK3GVKnOSKHGSJ2+PHWyOGWuNGGeLFl+JFVyHE1uGEFeFEVSEEFOAEVGAEVCAEFJ/D058Dk17DEs5Ckk3CUIvB0ArBj8oBjwmBjsoBjopBTkoBTgnBTgmBSAgAP///y1a+yYAAAAhdFJOUwABAgMEBQYHCQwPEhQVFxgZGhweHyAiKCkqKywtLi8xMjQ1/bJ3AAAE/UlEQVR4Xu2cW3uqPBCAQ+fGAhAFRUTQo1jwouA13v//3xMt07Z7d5KcmQd9ns/JdJo7d2Z2EwAAAAAAAAAAAAAAAAAAAAA/LkmS5HFJkvyUu5zkeSRpSZI8m+5y2jQ0Q/I4JUlSaZp+l82UJJ/X3bW0L/3oTUn+q45Kkr/m6qY25C+l/yF/yH+R/2p/5C+lP6Z/TP/3V/1p+xP2/yr7F/ZH2H+0P8D+Eftn7C+xf0h/wP4R+4fsB9kfst9gf5T9Q/ZD7I/YD7I/ZD/A/hH7h+wH2R+y32B/lP1D9kPsj9gPsj9kP8D+EfuH7AfZH7LfYH+U/UP2Q+yP2A+yP2Q/wP4R+4fsB9kfst9gf5T9Q/ZD7A+xN7eN9UfYE1s/YJ+S/1l/zP5j+tP+9/Sv/f/R/pf94fpT/wD8M/kP85/yP/Zf3S/zv9p/9T/k/+n/lP9T/hP+0/7j/lf+o/7b/mv+x/zf+w/5T/uf8r/33/M/8p/zP/af8r/33/c/9h/xP/S/4L/uf87/kv+i/6L/ov8R/0X/S/5b/gv+S/5H/kv+5/wP+B/wP+B/yP+Q/yH/Y/7H/I/5H/I/5H/If5D/If9j/sf8j/kf8j/kf8j/kP8h/2P+x/yP+R/yP+R/yH+Q/yH/Y/7H/I/5H/I/5H/If5D/If9j/sf8j/kf8j/kf8j/kP8h/yP+Q/yP+R/yP+R/yP+Q/yH/Y/7H/I/5H/I/5H/If5D/If9j/sf8j/kf8j/kf8j/kP8h/yP+Q/yP+R/yP+R/yP+Q/yH/Y/7H/I/5H/I/5H/If5D/If9j/sf8j/kf8j/kf8j/kP8h/yP+Q/yP+R/yP+R/yP+Q/yH/Y/7H/I/5H/I/5H/If5D/If9j/sf8j/kf8j/kf8j/kP8h/yP+Q/yP+R/yP+R/yP+Q/yH/Y/7H/I/5H/I/5H/If5D/If9j/sf8j/kf8j/kf8j/kP8h/yP+Q/yP+R/yP+R/yP+Q/yH/Y/7H/I/5H/I/5H/If5D/If9j/sf8j/kf8j/kf8j/kP8h/yP+Q/yP+R/yP+R/yP+Q/yH/Y/7H/I/5H/I/5H/If5D/If9j/sf8j/kf8j/kf8j/kP8h/yP+Q/yP+R/yP+R/yP+Q/yH/Y/7H/I/5H/I/5H/If5D/If9j/sf8j/kf8j/kf8j/kP8h/yP+Q/yP+R/yP+R/yP+Q/yH/Y/7H/I/5H/I/5H/If5D/If9j/sf8j/kf8j/kf8j/kP8h/yP+Q/yP+R/yP+R/yP+Q/yH/Y/7H/I/5H/I/5H/If5D/If9j/sf8j/kf8j/kf8j/kP8h/yP+Q/yP+R/yP+R/yP+Q/yH/Y/7H/I/5H/I/5H/If5D/If9j/sf8j/kf8j/kf8j/kP8r/o//D9K/9/9H/lf2h+3P+h/z3/K/1P+U/6r/tP+S/7b/mP+3/yH/K/9z/n/97/mv/J/5D/pf9L/kv+5/wf87/kP+1/wP+B/yv/L/8g/5L/m/8n/y/9T/qv+l/z//H//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADz4P/4M/ANuY37z0+R8aAAAAAElFTSuQmCC";

export const generateInvoice = (user: User, entries: IncomeEntry[], month: string) => {
  const { jsPDF } = jspdf;
  const doc = new jsPDF();

  doc.addImage(logoBase64, 'PNG', 14, 15, 50, 20);

  doc.setFontSize(16);
  doc.setTextColor(40);
  doc.text(`Income Report - ${month}`, 14, 42);

  doc.setFontSize(12);
  doc.text(`Staff Name: ${user.name}`, 14, 55);
  doc.text(`Staff Username: ${user.username}`, 14, 62);

  const tableColumn = ["Date", "Type", "Description", "Amount (QR)"];
  const tableRows: (string | number)[][] = [];

  let totalIncome = 0;
  let totalOtpCash = 0;

  entries.forEach(entry => {
    let descriptionText = entry.description;
    if ((entry.type === EntryType.IncomePayment || entry.type === EntryType.OTPPayment) && entry.recipient) {
        descriptionText += ` (To: ${entry.recipient})`;
    }

    const entryData = [
      entry.date,
      entry.type,
      descriptionText,
      entry.amount.toFixed(2),
    ];
    tableRows.push(entryData);
    
    if (entry.type === EntryType.IncomeAdd) {
      totalIncome += entry.amount;
    } else if (entry.type === EntryType.IncomeMinus || entry.type === EntryType.IncomePayment) {
        totalIncome -= entry.amount;
    } else if (entry.type === EntryType.OTPAdd) {
        totalOtpCash += entry.amount;
    } else if (entry.type === EntryType.OTPMinus || entry.type === EntryType.OTPPayment) {
        totalOtpCash -= entry.amount;
    }
  });

  doc.autoTable({
    startY: 70,
    head: [tableColumn],
    body: tableRows,
    theme: 'grid',
    headStyles: { fillColor: [33, 150, 243] },
  });

  const finalY = (doc as any).lastAutoTable.finalY;
  doc.setFontSize(12);
  doc.text(`Total Daily Income: ${totalIncome.toFixed(2)} QR`, 14, finalY + 10);
  doc.text(`Total OTP Cash: ${totalOtpCash.toFixed(2)} QR`, 14, finalY + 17);
  
  const grandTotal = totalIncome + totalOtpCash;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`Grand Total: ${grandTotal.toFixed(2)} QR`, 14, finalY + 27);
  
  doc.save(`Invoice_${user.name.replace(' ', '_')}_${month}.pdf`);
};

export const generateTicketReport = (tickets: TicketEntry[], reportTitle: string, isAdminView: boolean) => {
  const { jsPDF } = jspdf;
  const doc = new jsPDF({ orientation: 'landscape' });

  doc.addImage(logoBase64, 'PNG', 14, 15, 50, 20);

  doc.setFontSize(16);
  doc.setTextColor(40);
  doc.text(reportTitle, 14, 42);

  doc.setFontSize(10);
  doc.text(`Report generated on: ${new Date().toLocaleDateString()}`, 14, 50);

  const tableColumnAdmin = ["Staff", "Issue Date", "Passenger", "PNR", "Route", "Airline", "Departure", "Arrival", "Issuer"];
  const tableColumnStaff = ["Issue Date", "Passenger", "PNR", "Route", "Airline", "Departure", "Arrival", "Issuer"];
  const tableColumn = isAdminView ? tableColumnAdmin : tableColumnStaff;
  
  const tableRows: (string | number)[][] = [];

  tickets.forEach(ticket => {
    const route = `${ticket.from} -> ${ticket.to}`;
    const rowData = [
      ticket.issueDate,
      ticket.passengerName,
      ticket.pnr,
      route,
      ticket.flightName,
      ticket.departureDate,
      ticket.arrivalDate,
      ticket.fromIssuer,
    ];
    if (isAdminView) {
      rowData.unshift(ticket.userName);
    }
    tableRows.push(rowData);
  });

  const staffColumnStyles = {
    0: { cellWidth: 25 },    // Issue Date
    1: { cellWidth: 40 },    // Passenger
    2: { cellWidth: 25 },    // PNR
    3: { cellWidth: 40 },    // Route
    4: { cellWidth: 30 },    // Airline
    5: { cellWidth: 25 },    // Departure
    6: { cellWidth: 25 },    // Arrival
    7: { cellWidth: 30 },    // Issuer
  };

  const adminColumnStyles = {
    0: { cellWidth: 30 },    // Staff
    1: { cellWidth: 25 },    // Issue Date
    2: { cellWidth: 40 },    // Passenger
    3: { cellWidth: 25 },    // PNR
    4: { cellWidth: 40 },    // Route
    5: { cellWidth: 30 },    // Airline
    6: { cellWidth: 25 },    // Departure
    7: { cellWidth: 25 },    // Arrival
    8: { cellWidth: 30 },    // Issuer
  };

  doc.autoTable({
    startY: 60,
    head: [tableColumn],
    body: tableRows,
    theme: 'grid',
    headStyles: { fillColor: [33, 150, 243] },
    styles: { fontSize: 8 },
    columnStyles: isAdminView ? adminColumnStyles : staffColumnStyles,
  });
  
  const safeTitle = reportTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  doc.save(`${safeTitle}.pdf`);
};