declare global {
  /**
   * Props for ValueDisplay component
   */
  interface ValueDisplayProps {
      /** The value to display (number or string) */
      value: string | number;
      /** Title/label for the value */
      title: string;
      /** Number of decimal places for numeric values */
      decimalPlaces?: number;
      /** Unit to display with the value */
      unit?: string;
      /** Locale for number formatting */
      locale?: string;
  }

  /**
   * Props for loading components
   */
  interface LoaderProps {
      /** Optional CSS class name */
      className?: string;
      /** Loading message */
      message?: string;
  }

  /**
   * Error boundary fallback props
   */
  interface ErrorFallbackProps {
      /** The error that occurred */
      error: Error;
      /** Function to reset the error boundary */
      resetErrorBoundary: () => void;
  }

  /**
   * Common React component props
   */
  interface BaseComponentProps {
      /** Optional CSS class name */
      className?: string;
      /** Optional test ID for testing */
      testId?: string;
      /** Child elements */
      children?: React.ReactNode;
  }
}

export {};