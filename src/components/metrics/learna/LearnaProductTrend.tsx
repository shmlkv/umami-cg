import { useMemo } from 'react';
import { BarChart } from '@/components/charts/BarChart';
import { LoadingPanel } from '@/components/common/LoadingPanel';
import {
  useDateRange,
  useLocale,
  useTimezone,
  useWebsiteEventsSeriesQuery,
} from '@/components/hooks';
import { renderDateLabels } from '@/lib/charts';
import { generateTimeSeries } from '@/lib/date';

const series = [
  { event: 'learning_path_succeeded', label: 'Courses generated', color: '#2680eb' },
  { event: 'lesson_completed', label: 'Lessons completed', color: '#e68619' },
  { event: 'course_completed', label: 'Courses completed', color: '#44b556' },
] as const;

export function LearnaProductTrend({ websiteId }: { websiteId: string }) {
  const { timezone } = useTimezone();
  const {
    dateRange: { startDate, endDate, unit },
  } = useDateRange({ timezone });
  const { locale, dateLocale } = useLocale();
  const generated = useWebsiteEventsSeriesQuery(websiteId, { event: series[0].event });
  const lessons = useWebsiteEventsSeriesQuery(websiteId, { event: series[1].event });
  const courses = useWebsiteEventsSeriesQuery(websiteId, { event: series[2].event });
  const queries = [generated, lessons, courses];
  const chartData: any = useMemo(
    () => ({
      datasets: queries.map((query, index) => ({
        label: series[index].label,
        data: generateTimeSeries(
          (query.data ?? []).map(({ t, y }: { t: string; y: number }) => ({ x: t, y })),
          startDate,
          endDate,
          unit,
          dateLocale,
        ),
        backgroundColor: `${series[index].color}99`,
        borderColor: series[index].color,
        borderWidth: 1,
      })),
    }),
    [courses.data, dateLocale, endDate, generated.data, lessons.data, startDate, unit],
  );
  const isLoading = queries.some(query => query.isLoading);
  const error = queries.find(query => query.error)?.error;

  return (
    <LoadingPanel isLoading={isLoading} error={error} minHeight="360px">
      <BarChart
        chartData={chartData}
        minDate={startDate}
        maxDate={endDate}
        unit={unit}
        renderXLabel={renderDateLabels(unit, locale)}
        height="340px"
      />
    </LoadingPanel>
  );
}
