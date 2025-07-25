import { Router } from 'express';
import { getRetentionReport } from '../controllers/retention.controller';

const router = Router();
/**
 * @openapi
 * /retention/report:
 *   get:
 *     tags:
 *       - Retention
 *     summary: Get client retention report
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   employeeId:
 *                     type: integer
 *                   month:
 *                     type: string
 *                     format: date
 *                   clients:
 *                     type: integer
 *                   percentage:
 *                     type: number
 */
router.get('/report', getRetentionReport);

export default router;
