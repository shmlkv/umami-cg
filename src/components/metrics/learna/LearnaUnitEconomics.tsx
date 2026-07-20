import { Column, Text } from '@umami/react-zen';
import { LoadingPanel } from '@/components/common/LoadingPanel';
import { useResultQuery } from '@/components/hooks';
import { useEventStatsQuery } from '@/components/hooks/queries/useEventStatsQuery';
import { formatLongCurrency, formatLongNumber } from '@/lib/format';
import { LearnaKpiGrid } from './LearnaKpiGrid';

export function LearnaUnitEconomics({
  websiteId,
  currency = 'USD',
  costPerAiRequest = 0,
}: {
  websiteId: string;
  currency?: string;
  costPerAiRequest?: number;
}) {
  const revenue = useResultQuery<any>('revenue', { websiteId, currency });
  const aiSuccess = useEventStatsQuery({
    websiteId,
    event: 'ai_request_succeeded',
    skipComparison: true,
  });
  const generated = useEventStatsQuery({
    websiteId,
    event: 'learning_path_succeeded',
    skipComparison: true,
  });
  const isLoading = revenue.isLoading || aiSuccess.isLoading || generated.isLoading;
  const error = revenue.error || aiSuccess.error || generated.error;
  const trackedRevenue = Number(revenue.data?.total?.sum ?? 0);
  const successfulRequests = aiSuccess.data?.events ?? 0;
  const generatedCourses = generated.data?.events ?? 0;
  const hasCostModel = costPerAiRequest > 0;
  const estimatedSpend = hasCostModel ? successfulRequests * costPerAiRequest : null;
  const contribution = estimatedSpend === null ? null : trackedRevenue - estimatedSpend;
  const margin =
    contribution !== null && trackedRevenue > 0 ? (contribution / trackedRevenue) * 100 : null;
  const costPerCourse =
    estimatedSpend !== null && generatedCourses > 0 ? estimatedSpend / generatedCourses : null;

  return (
    <LoadingPanel isLoading={isLoading} error={error} minHeight="220px">
      <Column gap="3">
        <LearnaKpiGrid
          metrics={[
            {
              label: 'Tracked revenue',
              value: formatLongCurrency(trackedRevenue, currency),
              detail: `${formatLongNumber(revenue.data?.total?.count ?? 0)} revenue events`,
            },
            {
              label: 'Estimated AI spend',
              value: estimatedSpend === null ? '—' : formatLongCurrency(estimatedSpend, currency),
              detail: hasCostModel
                ? `${formatLongCurrency(costPerAiRequest, currency)} per successful request`
                : 'Set cost per AI request in component settings',
            },
            {
              label: 'Contribution',
              value: contribution === null ? '—' : formatLongCurrency(contribution, currency),
              detail: 'Tracked revenue minus estimated AI spend',
            },
            {
              label: 'Contribution margin',
              value: margin === null ? '—' : `${margin.toFixed(1)}%`,
              detail: 'Requires revenue and a configured cost model',
            },
            {
              label: 'Cost per course',
              value: costPerCourse === null ? '—' : formatLongCurrency(costPerCourse, currency),
              detail: 'Estimated spend / generated courses',
            },
          ]}
        />
        <Text size="sm" color="muted">
          Revenue is exact only when server-side revenue events are connected. AI spend is an
          estimate until provider usage and cost are persisted.
        </Text>
      </Column>
    </LoadingPanel>
  );
}
