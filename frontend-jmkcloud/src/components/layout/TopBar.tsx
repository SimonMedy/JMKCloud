import { ReactNode } from "react";

interface TopBarProps {
  leftContent?: ReactNode;
  rightContent?: ReactNode;
}

const TopBar: React.FC<TopBarProps> = ({ leftContent, rightContent }) => {
  return (
    <header className="p-4 border-b flex items-center justify-between">
      {leftContent && <div className="flex items-center gap-2">{leftContent}</div>}
      {rightContent && <div className="ml-auto flex items-center gap-4">{rightContent}</div>}
    </header>
  );
};

export default TopBar;
