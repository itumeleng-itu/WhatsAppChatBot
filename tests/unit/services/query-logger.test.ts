import { QueryLogger, QueryLog } from '../../../src/services/query-logger.service';

describe('QueryLogger', () => {
  let logger: QueryLogger;

  beforeEach(() => {
    logger = new QueryLogger();
  });

  it('should log a query', async () => {
    await logger.logQuery('learner1', 'What is AI?');

    const logs: QueryLog[] = await logger.getLogs('queries');
    expect(Array.isArray(logs)).toBe(true);
    expect(logs.some((l) => l.query === 'What is AI?')).toBe(true);
  });

  it('should log a response', async () => {
    await logger.logResponse('learner1', 'What is AI?', 'Artificial Intelligence', 0.9);

    const logs: QueryLog[] = await logger.getLogs('responses');
    expect(Array.isArray(logs)).toBe(true);
    expect(logs.some((l) => l.response === 'Artificial Intelligence')).toBe(true);
  });

  it('should handle numeric confidence correctly', async () => {
    const confidence = 0.75;
    await logger.logResponse('learner2', 'What is ML?', 'Machine Learning', confidence);

    const logs: QueryLog[] = await logger.getLogs('responses');
    const log = logs.find((l) => l.query === 'What is ML?');
    expect(log?.confidence).toBe(confidence);
  });

  it('should return empty array if log file does not exist', async () => {
    const logs: QueryLog[] = await logger.getLogs('nonexistent', '1900-01-01');
    expect(logs).toEqual([]);
  });

  it('should log responses with optional category', async () => {
    await logger.logResponse('learner3', 'Explain NLP', 'Natural Language Processing', 0.8, 'AI');

    const logs: QueryLog[] = await logger.getLogs('responses');
    const log = logs.find((l) => l.query === 'Explain NLP');
    expect(log?.category).toBe('AI');
  });
});
