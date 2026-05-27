import type { ReactNode } from 'react';

export function SlideFrame({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`w-[1920px] h-[1080px] bg-white text-slate-900 overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
}

export function Title({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h1 className={`text-[96px] font-bold leading-tight tracking-tight ${className}`}>
      {children}
    </h1>
  );
}

export function Body({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return <p className={`text-[40px] leading-snug ${className}`}>{children}</p>;
}

export function Bullet({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <li className={`text-[36px] leading-snug list-disc list-inside ${className}`}>
      {children}
    </li>
  );
}

export function TwoColumn({
  left,
  right,
  className = '',
}: {
  left: ReactNode;
  right: ReactNode;
  className?: string;
}) {
  return (
    <div className={`grid grid-cols-2 gap-16 ${className}`}>
      <div>{left}</div>
      <div>{right}</div>
    </div>
  );
}
