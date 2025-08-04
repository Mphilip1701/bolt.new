import { describe, expect, it } from 'vitest';
import { stripIndents } from './stripIndent';

describe('stripIndents', () => {
  it('preserves relative indentation', () => {
    const input = `\n  line1\n    line2\n`;
    expect(stripIndents(input)).toBe('line1\n  line2');
  });

  it('works with template strings', () => {
    const result = stripIndents`\n    line1\n      line2\n    `;
    expect(result).toBe('line1\n  line2');
  });
});
