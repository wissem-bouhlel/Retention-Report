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
 *               type: object
 *               additionalProperties:
 *                 type: object
 *                 properties:
 *                   clients:
 *                     type: integer
 *                   percentage:
 *                     type: number
 */
router.get('/report', getRetentionReport);

export default router;
