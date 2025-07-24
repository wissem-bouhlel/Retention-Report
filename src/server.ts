import express, { Express, Request, Response } from "express";
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { format, parseISO } from 'date-fns';

const app: Express = express();
const PORT = 3000;

interface Appointment {
  client_id: number;
  employee_id: number;
  date: string;
}

interface RetentionStats {
  [month: string]: {
    [employeeId: string]: {
      clients: number;
      percentage: number;
    };
  };
}

const getMonthKey = (dateStr: string): string =>
  format(parseISO(dateStr), 'yyyy-MM');

const init = async () => {
  const db = await open({
    filename: './salon.sqlite',
    driver: sqlite3.Database,
  });

  app.get('/retention-report', async (_req, res) => {
    try {
      const appointments: Appointment[] = await db.all(`
        SELECT client_id, employee_id, date FROM APPOINTMENTS ORDER BY date ASC
      `);

      console.log("appointments:", appointments);

      if (appointments.length === 0) return res.json({});

      const months = new Set<string>(appointments.map(a => getMonthKey(a.date)));
      console.log("months:", months);
      const monthList = Array.from(months).sort();
      console.log("monthList:", monthList);
      const referenceMonth = monthList[0];

      const refClients: Record<number, { employee_id: number }> = {};
      for (const appt of appointments) {
        const month = getMonthKey(appt.date);
        if (month !== referenceMonth) continue;

        if (!refClients[appt.client_id]) {
          refClients[appt.client_id] = { employee_id: appt.employee_id };
        }
      }

      console.log("refClients:", refClients);


      const employeeStats: Record<number, Record<string, Set<number>>> = {};
      for (const [clientIdStr, { employee_id }] of Object.entries(refClients)) {
        const clientId = parseInt(clientIdStr);
        employeeStats[employee_id] ??= {};
        employeeStats[employee_id][referenceMonth] ??= new Set();
        employeeStats[employee_id][referenceMonth].add(clientId);
      }

      console.log("employeeStats:", employeeStats);

      for (const appt of appointments) {
        const month = getMonthKey(appt.date);
        if (month === referenceMonth) continue;

        const ref = refClients[appt.client_id];
        if (!ref) continue;

        const refEmp = ref.employee_id;
        employeeStats[refEmp][month] ??= new Set();
        employeeStats[refEmp][month].add(appt.client_id);
      }

      const result: RetentionStats = {};
      for (const [empIdStr, monthsData] of Object.entries(employeeStats)) {
        const empId = parseInt(empIdStr);
        const baseClients = monthsData[referenceMonth]?.size ?? 1;

        for (const [month, clients] of Object.entries(monthsData)) {
          result[month] ??= {};
          result[month][empId] = {
            clients: clients.size,
            percentage:
              month === referenceMonth
                ? 100
                : Math.round((clients.size / baseClients) * 100),
          };
        }
      }

      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Something went wrong' });
    }
  });

  app.get("/", (_req: Request, res: Response) => {
    res.send("kaka");
});
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
};

init();
