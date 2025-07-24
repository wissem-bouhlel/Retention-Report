import { format, parseISO } from 'date-fns';
import { Appointment } from '../entities/Appointment';
import { AppDataSource } from '../data-source';

type RetentionStats = Record<string, Record<number, { clients: number; percentage: number }>>;

const getMonthKey = (dateStr: string): string =>
  format(parseISO(dateStr), 'yyyy-MM');

export class RetentionService {
  async generateReport(): Promise<RetentionStats> {
    const appointmentRepo = AppDataSource.getRepository(Appointment);
    const appointments = await appointmentRepo.find({
      order: { date: 'ASC' },
    });

    const result: RetentionStats = {};

    const monthList = Array.from(new Set(appointments.map(a => getMonthKey(a.date)))).sort();
    const referenceMonth = monthList[0];

    const refClients: Record<number, number> = {}; // client_id => employee_id

    // Find first appointment in reference month per client
    for (const appt of appointments) {
      const month = getMonthKey(appt.date);
      if (month !== referenceMonth) continue;

      if (!(appt.client_id in refClients)) {
        refClients[appt.client_id] = appt.employee_id;
      }
    }

    const employeeStats: Record<number, Record<string, Set<number>>> = {};
    for (const [clientIdStr, empId] of Object.entries(refClients)) {
      const clientId = parseInt(clientIdStr);
      employeeStats[empId] ??= {};
      employeeStats[empId][referenceMonth] = employeeStats[empId][referenceMonth] ?? new Set();
      employeeStats[empId][referenceMonth].add(clientId);
    }

    // Track return visits in future months
    for (const appt of appointments) {
      const month = getMonthKey(appt.date);
      if (month === referenceMonth) continue;

      const refEmp = refClients[appt.client_id];
      if (!refEmp) continue;

      employeeStats[refEmp][month] = employeeStats[refEmp][month] ?? new Set();
      employeeStats[refEmp][month].add(appt.client_id);
    }

    // Format result
    for (const [empIdStr, monthsData] of Object.entries(employeeStats)) {
      const empId = parseInt(empIdStr);
      const baseCount = monthsData[referenceMonth]?.size ?? 1;

      for (const [month, clients] of Object.entries(monthsData)) {
        result[month] ??= {};
        result[month][empId] = {
          clients: clients.size,
          percentage: month === referenceMonth
            ? 100
            : Math.round((clients.size / baseCount) * 100),
        };
      }
    }

    return result;
  }
}
