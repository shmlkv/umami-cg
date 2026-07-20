import { BOARD_TEMPLATE_TYPES, createBoardTemplate } from '../boardTemplates';

test.each([
  [
    BOARD_TEMPLATE_TYPES.founder,
    ['LearnaUnitEconomics', 'LearnaProductKpis', 'LearnaProductTrend', 'LearnaProductFunnel'],
  ],
  [
    BOARD_TEMPLATE_TYPES.product,
    ['LearnaProductKpis', 'LearnaProductFunnel', 'LearnaProductTrend'],
  ],
  [BOARD_TEMPLATE_TYPES.ai, ['LearnaAiOperations', 'LearnaProductTrend']],
] as const)('creates the %s template with its intended components', (template, expectedTypes) => {
  const parameters = createBoardTemplate(template);
  const componentTypes = parameters.rows?.flatMap(row =>
    row.columns.map(column => column.component?.type),
  );

  expect(componentTypes).toEqual(expectedTypes);
  expect(new Set(parameters.rows?.map(row => row.id)).size).toBe(parameters.rows?.length);
});

test('blank template has an empty layout', () => {
  expect(createBoardTemplate(BOARD_TEMPLATE_TYPES.blank)).toEqual({ rows: [] });
});
