import { Column, Text } from '@umami/react-zen';
import { LoadingPanel } from '@/components/common/LoadingPanel';
import { useEventStatsQuery } from '@/components/hooks/queries/useEventStatsQuery';
import { formatLongCurrency, formatLongNumber } from '@/lib/format';
import { LearnaKpiGrid } from './LearnaKpiGrid';

export function LearnaAiOperations({
  websiteId,
  currency = 'USD',
  costPerAiRequest = 0,
}: {
  websiteId: string;
  currency?: string;
  costPerAiRequest?: number;
}) {
  const started = useEventStatsQuery({
    websiteId,
    event: 'ai_request_started',
    skipComparison: true,
  });
  const succeeded = useEventStatsQuery({
    websiteId,
    event: 'ai_request_succeeded',
    skipComparison: true,
  });
  const failed = useEventStatsQuery({
    websiteId,
    event: 'ai_request_failed',
    skipComparison: true,
  });
  const queries = [started, succeeded, failed];
  const isLoading = queries.some(query => query.isLoading);
  const error = queries.find(query => query.error)?.error;
  const successCount = succeeded.data?.events ?? 0;
  const failureCount = failed.data?.events ?? 0;
  const resolvedCount = successCount + failureCount;
  const successRate = resolvedCount > 0 ? (successCount / resolvedCount) * 100 : 0;
  const estimatedSpend = costPerAiRequest > 0 ? successCount * costPerAiRequest : null;

  return (
    <LoadingPanel isLoading={isLoading} error={error} minHeight="210px">
      <Column gap="3">
        <LearnaKpiGrid
          metrics={[
            { label: 'AI requests started', value: formatLongNumber(started.data?.events ?? 0) },
            { label: 'Successful requests', value: formatLongNumber(successCount) },
            { label: 'Failed requests', value: formatLongNumber(failureCount) },
            { label: 'Success rate', value: `${successRate.toFixed(1)}%` },
            {
              label: 'Estimated AI spend',
              value: estimatedSpend === null ? '—' : formatLongCurrency(estimatedSpend, currency),
              detail: costPerAiRequest > 0 ? 'Configured cost model' : 'Cost model not configured',
            },
          ]}
        />
        <Text size="sm" color="muted">
          Request counts are measured. Provider cost, tokens, latency, retries, and model mix
          require server-side usage facts.
        </Text>
      </Column>
    </LoadingPanel>
  );
}
