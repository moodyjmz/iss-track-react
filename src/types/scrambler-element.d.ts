/// <reference types="react" />

declare global {
  // Type definitions for scrambler-element custom web component
  interface ScramblerElementAttributes {
    value?: string;
    unit?: string;
    duration?: string;
    locale?: string;
    'decimal-places'?: string;
  }

  // Define the element interface extending HTMLElement
  interface ScramblerElement extends HTMLElement {
    value: string;
    unit: string | null;
    duration: string;
    locale: string;
    setAttribute(name: keyof ScramblerElementAttributes, value: string): void;
    getAttribute(name: keyof ScramblerElementAttributes): string | null;
  }

  // Module augmentation for HTMLElementTagNameMap
  interface HTMLElementTagNameMap {
    'scrambler-element': ScramblerElement;
  }

  // JSX namespace extension for React
  namespace JSX {
    interface IntrinsicElements {
      'scrambler-element': React.DetailedHTMLProps<
        React.HTMLAttributes<ScramblerElement>,
        ScramblerElement
      > & ScramblerElementAttributes & {
        ref?: React.Ref<ScramblerElement>;
      };
    }
  }
}

export {};