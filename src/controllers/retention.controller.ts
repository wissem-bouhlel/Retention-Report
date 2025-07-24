import { Request, Response } from 'express';
import { RetentionService } from '../services/retention.service';

const service = new RetentionService();

export const getRetentionReport = async (_req: Request, res: Response) => {
  try {
    const report = await service.generateReport();
    res.status(200).json(report);
  } catch (err) {
    console.error('Error generating report:', err);
    res.status(500).json({ error: 'Failed to generate report' });
  }
};
