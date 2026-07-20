import { LoadingPanel } from '@/components/common/LoadingPanel';
import { useEventStatsQuery } from '@/components/hooks/queries/useEventStatsQuery';
import { formatLongNumber } from '@/lib/format';
import { LearnaKpiGrid } from './LearnaKpiGrid';

export function LearnaProductKpis({ websiteId }: { websiteId: string }) {
  const generated = useEventStatsQuery({
    websiteId,
    event: 'learning_path_succeeded',
    skipComparison: true,
  });
  const studying = useEventStatsQuery({ websiteId, event: 'study_started', skipComparison: true });
  const lessons = useEventStatsQuery({
    websiteId,
    event: 'lesson_completed',
    skipComparison: true,
  });
  const courses = useEventStatsQuery({
    websiteId,
    event: 'course_completed',
    skipComparison: true,
  });
  const isLoading = [generated, studying, lessons, courses].some(query => query.isLoading);
  const error = [generated, studying, lessons, courses].find(query => query.error)?.error;
  const generatedVisits = generated.data?.visits ?? 0;
  const lessonVisits = lessons.data?.visits ?? 0;
  const lessonVisitRatio = generatedVisits > 0 ? (lessonVisits / generatedVisits) * 100 : 0;

  return (
    <LoadingPanel isLoading={isLoading} error={error} minHeight="150px">
      <LearnaKpiGrid
        metrics={[
          {
            label: 'Generated courses',
            value: formatLongNumber(generated.data?.events ?? 0),
            detail: 'Successful learning paths',
          },
          {
            label: 'Study-start visits',
            value: formatLongNumber(studying.data?.visits ?? 0),
            detail: 'Unique visits with study started',
          },
          {
            label: 'Lessons completed',
            value: formatLongNumber(lessons.data?.events ?? 0),
            detail: 'Completed lesson events',
          },
          {
            label: 'Courses completed',
            value: formatLongNumber(courses.data?.events ?? 0),
            detail: 'Completed course events',
          },
          {
            label: 'Lesson-visit ratio',
            value: `${lessonVisitRatio.toFixed(1)}%`,
            detail: 'Directional ratio, not a user cohort',
          },
        ]}
      />
    </LoadingPanel>
  );
}
