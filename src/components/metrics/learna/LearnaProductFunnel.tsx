import { Column, Grid, ProgressBar, Row, Text } from '@umami/react-zen';
import { LoadingPanel } from '@/components/common/LoadingPanel';
import { useEventStatsQuery } from '@/components/hooks/queries/useEventStatsQuery';
import { formatLongNumber } from '@/lib/format';

const stages = [
  ['intake_started', 'Intake started'],
  ['learning_path_started', 'Generation started'],
  ['learning_path_succeeded', 'Course generated'],
  ['study_started', 'Study started'],
  ['lesson_completed', 'Lesson completed'],
  ['course_completed', 'Course completed'],
] as const;

export function LearnaProductFunnel({ websiteId }: { websiteId: string }) {
  const intake = useEventStatsQuery({
    websiteId,
    event: stages[0][0],
    skipComparison: true,
  });
  const generation = useEventStatsQuery({
    websiteId,
    event: stages[1][0],
    skipComparison: true,
  });
  const generated = useEventStatsQuery({
    websiteId,
    event: stages[2][0],
    skipComparison: true,
  });
  const studying = useEventStatsQuery({
    websiteId,
    event: stages[3][0],
    skipComparison: true,
  });
  const lesson = useEventStatsQuery({
    websiteId,
    event: stages[4][0],
    skipComparison: true,
  });
  const course = useEventStatsQuery({
    websiteId,
    event: stages[5][0],
    skipComparison: true,
  });
  const queries = [intake, generation, generated, studying, lesson, course];
  const values = queries.map(query => query.data?.visits ?? 0);
  const isLoading = queries.some(query => query.isLoading);
  const error = queries.find(query => query.error)?.error;
  const first = values[0] || 1;
  const maxValue = Math.max(...values, 1);

  return (
    <LoadingPanel isLoading={isLoading} error={error} minHeight="420px">
      <Column gap="4">
        <Text size="sm" color="muted">
          Unique visits with each action. This is a directional stage view, not a strict user
          cohort.
        </Text>
        {stages.map(([, label], index) => {
          const value = values[index];
          const previous = index === 0 ? value : values[index - 1];
          const stepRate = index === 0 ? 100 : previous > 0 ? (value / previous) * 100 : 0;
          const totalRate = (value / first) * 100;

          return (
            <Grid key={label} columns="minmax(140px, 1fr) minmax(180px, 3fr) auto" gap="4">
              <Column gap="1">
                <Text weight="bold">{label}</Text>
                <Text size="sm" color="muted">
                  {index === 0 ? 'Entry stage' : `${stepRate.toFixed(1)}% from previous`}
                </Text>
              </Column>
              <Row alignItems="center">
                <ProgressBar
                  value={value}
                  minValue={0}
                  maxValue={maxValue}
                  style={{ width: '100%' }}
                />
              </Row>
              <Column alignItems="end" minWidth="86px">
                <Text weight="bold" style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {formatLongNumber(value)}
                </Text>
                <Text size="sm" color="muted">
                  {totalRate.toFixed(1)}% total
                </Text>
              </Column>
            </Grid>
          );
        })}
      </Column>
    </LoadingPanel>
  );
}
