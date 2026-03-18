import { ReadableKeyPipe } from './readable-key.pipe';

describe('ReadableKeyPipe', () => {
  it('formats slug values into readable labels', () => {
    const pipe = new ReadableKeyPipe();

    expect(pipe.transform('creative-coding')).toBe('Creative Coding');
    expect(pipe.transform('sound_design')).toBe('Sound Design');
  });
});
