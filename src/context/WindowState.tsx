import { createContext, useState } from 'react';

type WindowState = {
  isActive: boolean;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
}

const WindowStateContext = createContext<WindowState>({} as WindowState);

const WindowStateProvider = ({children}: {children: React.ReactNode}) => {
    const [isActive, setIsActive] = useState(true);
    return <WindowStateContext value={{isActive, setIsActive}}>{children}</WindowStateContext>
};

export {WindowStateContext, WindowStateProvider};