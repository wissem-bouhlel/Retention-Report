import { format, parseISO } from 'date-fns';
import { Appointment } from '../entities/Appointment';
import { AppDataSource } from '../data-source';

interface RetentionEntry {
  employeeId: number;
  month: string;
  clients: number;
  percentage: string;
}

// Converts ISO date string to 'YYYY-MM' format
const getMonthKey = (dateStr: string): string => format(parseISO(dateStr), 'yyyy-MM');

export class RetentionService {
  /**
   * Generates a retention report for employees based on client appointments.
   * For each employee, tracks how many clients from the reference month (first month)
   * returned in subsequent months, and calculates retention percentage.
   */
  async generateReport(): Promise<RetentionEntry[]> {
    const appointmentRepo = AppDataSource.getRepository(Appointment);

    // Get all appointments sorted by date (ascending)
    const appointments = await appointmentRepo.find({
      order: { date: 'ASC' },
    });

    if (appointments.length === 0) return [];

    const result: RetentionEntry[] = [];

    // 1. Identify all months from the data
    // and determine the reference month (first month in the dataset)
    const allMonths = Array.from(new Set(appointments.map(appt => getMonthKey(appt.date)))).sort();
    const referenceMonth = allMonths[0];

    // 2. Map of client_id => employee_id for the reference month
    // This will track the first appointment of each client in the reference month
    // Output => { client_id: employee_id }
    const refClients: Record<number, number> = {};

    for (const appt of appointments) {
      const month = getMonthKey(appt.date);

      // Only consider first appointment in the reference month
      if (month === referenceMonth && !(appt.client_id in refClients)) {
        refClients[appt.client_id] = appt.employee_id;
      }
    }

    // 3. Build map: employee_id => month => Set of client_ids
    const employeeStats: Record<number, Record<string, Set<number>>> = {};

    // Track first-time clients per employee in reference month
    // Output => { employee_id: { month: Set(client_ids) } }
    for (const [clientIdStr, empId] of Object.entries(refClients)) {
      const clientId = parseInt(clientIdStr);
      employeeStats[empId] ??= {};
      employeeStats[empId][referenceMonth] ??= new Set();
      employeeStats[empId][referenceMonth].add(clientId);
    }

    // Track retained clients in following months (regardless of which employee served them)
    // Output => { employee_id: { month: Set(client_ids) } }
    for (const appt of appointments) {
      const month = getMonthKey(appt.date);
      if (month === referenceMonth) continue;

      const clientId = appt.client_id;
      const refEmp = refClients[clientId];
      if (!refEmp) continue; // Skip if client wasn't in the reference month

      employeeStats[refEmp][month] ??= new Set();
      employeeStats[refEmp][month].add(clientId);
    }

    // 4. Format as a flat list of records
    // Output => [{ employeeId, month, clients, percentage }, ...]
    for (const [empIdStr, monthsMap] of Object.entries(employeeStats)) {
      const employeeId = parseInt(empIdStr);
      const baseClients = monthsMap[referenceMonth]?.size ?? 1;

      for (const [month, clientSet] of Object.entries(monthsMap)) {
        result.push({
          employeeId,
          month,
          clients: clientSet.size,
          percentage: month === referenceMonth
            ? '100%'
            : `${Math.round((clientSet.size / baseClients) * 100)}%`,
        });
      }
    }

    // Sort by month, then by employee Id
    result.sort((a, b) =>
      a.month !== b.month
      ? a.month.localeCompare(b.month)
      : a.employeeId - b.employeeId
    );

    return result;
  }
}
