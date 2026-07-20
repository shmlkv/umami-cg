import { z } from 'zod';
import { getCompareDate } from '@/lib/date';
import { getQueryFilters, parseRequest } from '@/lib/request';
import { json, unauthorized } from '@/lib/response';
import { filterParams, withDateRange } from '@/lib/schema';
import { canViewWebsite } from '@/permissions';
import { getWebsiteEventStats } from '@/queries/sql/events/getWebsiteEventStats';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ websiteId: string }> },
) {
  const schema = withDateRange({
    skipComparison: z.literal('true').optional(),
    ...filterParams,
  });

  const { auth, query, error } = await parseRequest(request, schema);

  if (error) {
    return error();
  }

  const { websiteId } = await params;

  if (!(await canViewWebsite(auth, websiteId))) {
    return unauthorized();
  }

  const filters = await getQueryFilters(query, websiteId);

  const data = await getWebsiteEventStats(websiteId, filters);

  if (query.skipComparison === 'true') {
    return json({
      data: {
        ...data,
        comparison: { events: 0, visitors: 0, visits: 0, uniqueEvents: 0 },
      },
    });
  }

  const { startDate, endDate } = getCompareDate(
    filters.compare ?? 'prev',
    filters.startDate,
    filters.endDate,
  );

  const comparison = await getWebsiteEventStats(websiteId, {
    ...filters,
    startDate,
    endDate,
  });

  return json({ data: { ...data, comparison } });
}
