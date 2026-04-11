import { describe, expect, it } from 'vitest';
import cn from './classname-helper';

describe('classname-helper', () => {
  it('should merge basic tailwind classes', () => {
    const result = cn('flex', 'text-center');
    expect(result).toBe('flex text-center');
  });

  it('should resolve tailwind class conflicts correctly utilizing tailwind-merge', () => {
    const result = cn('p-4 p-2', 'text-red-500 text-blue-500');
    // twMerge keeps the last specified conflict
    expect(result).toBe('p-2 text-blue-500');
  });

  it('should evaluate conditional clsx objects correctly', () => {
    const isActive = true;
    const isError = false;

    const result = cn('base-class', {
      'active-class': isActive,
      'error-class': isError,
    });

    expect(result).toContain('base-class');
    expect(result).toContain('active-class');
    expect(result).not.toContain('error-class');
  });

  it('should evaluate arrays and undefined values correctly', () => {
    const result = cn('class1', undefined, null, ['class2', 'class3'], false && 'class4');
    expect(result).toBe('class1 class2 class3');
  });
});
