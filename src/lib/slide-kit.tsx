import { useState, type ReactNode } from 'react';

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

export function Asset({
  src,
  width,
  height,
  description,
  alt,
  className = '',
}: {
  src?: string;
  width: number;
  height: number;
  description: string;
  alt?: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const showPlaceholder = !src || failed;

  if (showPlaceholder) {
    return (
      <div
        data-asset-placeholder="true"
        data-asset-src={src ?? ''}
        style={{ width, height }}
        className={`flex flex-col items-center justify-center gap-6 bg-slate-100 border-2 border-dashed border-slate-400 text-slate-600 p-10 overflow-hidden ${className}`}
      >
        <div className="font-mono text-[22px] tracking-tight">
          {width} × {height}
        </div>
        <div
          className="font-sans text-[26px] leading-[1.35] text-center max-w-full"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 6,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {description}
        </div>
        {src && (
          <div className="font-mono text-[18px] text-slate-500 mt-2">{src}</div>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt ?? description}
      width={width}
      height={height}
      onError={() => setFailed(true)}
      style={{ width, height, objectFit: 'cover' }}
      className={className}
    />
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
