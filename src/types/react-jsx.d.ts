import 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'scrambler-element': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        value?: string;
        unit?: string;
        duration?: string;
        locale?: string;
        'decimal-places'?: string;
        ref?: React.Ref<HTMLElement>;
      };
    }
  }
}