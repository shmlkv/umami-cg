import { Column, Grid, Text } from '@umami/react-zen';
import type { ReactNode } from 'react';

export interface LearnaKpi {
  label: string;
  value: ReactNode;
  detail?: string;
}

export function LearnaKpiGrid({ metrics }: { metrics: LearnaKpi[] }) {
  return (
    <Grid columns="repeat(auto-fit, minmax(160px, 1fr))" gap>
      {metrics.map(({ label, value, detail }) => (
        <Column
          key={label}
          justifyContent="center"
          paddingX="6"
          paddingY="4"
          borderRadius
          backgroundColor="surface-base"
          border
          gap="2"
        >
          <Text weight="bold" wrap="nowrap">
            {label}
          </Text>
          <Text
            size="4xl"
            weight="bold"
            wrap="nowrap"
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {value}
          </Text>
          {detail && (
            <Text size="sm" color="muted">
              {detail}
            </Text>
          )}
        </Column>
      ))}
    </Grid>
  );
}
