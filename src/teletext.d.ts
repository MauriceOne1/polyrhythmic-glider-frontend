declare module '@techandsoftware/teletext' {
  export const Colour: {
    readonly BLACK: symbol;
    readonly BLUE: symbol;
    readonly CYAN: symbol;
    readonly GREEN: symbol;
    readonly MAGENTA: symbol;
    readonly RED: symbol;
    readonly WHITE: symbol;
    readonly YELLOW: symbol;
  };

  export const Level: Record<number, symbol>;

  export class Attributes {
    static readonly NEW_BACKGROUND: symbol;
    static charFromAttribute(attribute: symbol): string;
    static charFromTextColour(colour: symbol): string;
  }

  export interface TeletextInstance {
    addTo(selector: string): void;
    destroy(): void;
    remove(): void;
    setDefaultG0Charset(charset: string, withUpdate?: boolean): void;
    setAspectRatio(aspectRatio: number | 'natural'): void;
    setHeight(height: number): void;
    setLevel(level: symbol): void;
    setPageRows(rows: string[]): void;
  }

  export function Teletext(options?: unknown): TeletextInstance;
}
