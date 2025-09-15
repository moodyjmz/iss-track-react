import { createContext, useState } from 'react';

/**
 * Window state context value
 */
export interface WindowState {
  /** Whether the window is currently active/focused */
  isActive: boolean;
  /** Function to set the active state */
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Props for WindowStateProvider component
 */
export interface WindowStateProviderProps {
  /** Child components */
  children: React.ReactNode;
}

const WindowStateContext = createContext<WindowState>({} as WindowState);

const WindowStateProvider = ({ children }: WindowStateProviderProps) => {
    const [isActive, setIsActive] = useState<boolean>(true);
    return <WindowStateContext.Provider value={{ isActive, setIsActive }}>{children}</WindowStateContext.Provider>;
};

export {WindowStateContext, WindowStateProvider};