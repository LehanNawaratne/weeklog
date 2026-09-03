import { z } from 'zod';

import { objectId } from './common.js';

export const createReportSchema = z.object({
  weekStart: z.coerce.date({ error: 'Provide a valid date inside the week' }),
  projectId: objectId
});
