import type { BoardParameters, BoardRow } from './types';

export const BOARD_TEMPLATE_TYPES = {
  blank: 'blank',
  founder: 'learna-founder',
  product: 'learna-product',
  ai: 'learna-ai',
} as const;

export type BoardTemplateType = (typeof BOARD_TEMPLATE_TYPES)[keyof typeof BOARD_TEMPLATE_TYPES];

const uuid = () => globalThis.crypto.randomUUID();

const component = (
  type: string,
  title: string,
  description: string,
  props?: Record<string, any>,
) => ({
  id: uuid(),
  component: {
    type,
    title,
    description,
    ...(props ? { props } : {}),
  },
});

const row = (columns: ReturnType<typeof component>[], size = 320): BoardRow => ({
  id: uuid(),
  columns,
  size,
});

export function createBoardTemplate(template: BoardTemplateType): BoardParameters {
  const rows: BoardRow[] = [];

  if (template === BOARD_TEMPLATE_TYPES.founder) {
    rows.push(
      row(
        [
          component(
            'LearnaUnitEconomics',
            'Revenue, spend, and contribution',
            'Tracked revenue with an explicit AI-cost model.',
            { currency: 'USD', costPerAiRequest: 0 },
          ),
        ],
        260,
      ),
      row(
        [
          component(
            'LearnaProductKpis',
            'Learning pulse',
            'Generated courses, study-start visits, and completions.',
          ),
        ],
        240,
      ),
      row(
        [
          component(
            'LearnaProductTrend',
            'Key learning actions over time',
            'Generated courses and completed learning work.',
          ),
        ],
        400,
      ),
      row(
        [
          component(
            'LearnaProductFunnel',
            'Activation funnel',
            'Directional stage conversion from intake to course completion.',
          ),
        ],
        560,
      ),
    );
  }

  if (template === BOARD_TEMPLATE_TYPES.product) {
    rows.push(
      row(
        [
          component(
            'LearnaProductKpis',
            'Product pulse',
            'Core learning outcomes for the selected period.',
          ),
        ],
        240,
      ),
      row(
        [
          component(
            'LearnaProductFunnel',
            'Activation funnel',
            'Where visits advance or drop across the learning loop.',
          ),
        ],
        560,
      ),
      row(
        [
          component(
            'LearnaProductTrend',
            'Learning outcomes over time',
            'Generated courses, completed lessons, and completed courses.',
          ),
        ],
        400,
      ),
    );
  }

  if (template === BOARD_TEMPLATE_TYPES.ai) {
    rows.push(
      row(
        [
          component(
            'LearnaAiOperations',
            'AI reliability and spend proxy',
            'Measured request health with an optional cost estimate.',
            { currency: 'USD', costPerAiRequest: 0 },
          ),
        ],
        260,
      ),
      row(
        [
          component(
            'LearnaProductTrend',
            'Generated value over time',
            'Learning output produced by AI-backed workflows.',
          ),
        ],
        400,
      ),
    );
  }

  return { rows };
}
