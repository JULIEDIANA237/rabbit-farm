import { formatKitCode, formatLitterCode, nextLitterCode } from './codes.js';

describe('codes', () => {
  it('formate les codes de portée et de lapereaux (§12)', () => {
    expect(formatLitterCode(1)).toBe('L001');
    expect(formatKitCode('L001', 7)).toBe('L001-07');
    expect(formatKitCode('L001', 14)).toBe('L001-14');
  });

  it('propose le prochain code de portée libre', () => {
    expect(nextLitterCode([])).toBe('L001');
    expect(nextLitterCode(['L001', 'L007', 'SPECIAL', 'l003'])).toBe('L008');
  });
});
