import type { Annotated } from '@/lib/ppt';
import { SlideFrame, Title, Body, TwoColumn } from '@/lib/slide-kit';

export const text = {
  title: {
    content: 'Mixing slide-kit with raw tailwind',
    summary: '示范双栏 + 自由 tailwind 排版',
    rationale:
      '让 AI 看到 "slide-kit 不够用就直接 tailwind" 的混合写法，避免 AI 觉得 slide-kit 是唯一通路',
  },
  blurb: {
    content:
      'slide-kit gives you SlideFrame, Title, Body, Bullet, TwoColumn. Beyond that, drop into tailwind directly. The 1920×1080 canvas is yours.',
    summary: '左栏解说：约束 + 自由的边界',
    rationale:
      '把 "什么时候用 kit、什么时候不用" 明确写出来，减少 AI 在风格选择上的犹豫',
  },
  caption: {
    content: 'Right column: a colored block standing in for an image.',
    summary: '右栏图片占位的说明文字',
    rationale: '右边是个色块占位（不是真图），用一行小字解释清楚是占位',
  },
} satisfies Record<string, Annotated>;

export default function Slide() {
  return (
    <SlideFrame className="flex flex-col gap-16 p-32">
      <Title>{text.title.content}</Title>
      <TwoColumn
        className="flex-1"
        left={<Body>{text.blurb.content}</Body>}
        right={
          <div className="flex flex-col gap-6 h-full">
            <div className="flex-1 bg-gradient-to-br from-indigo-500 to-fuchsia-500 rounded-2xl" />
            <p className="text-[28px] text-slate-500">{text.caption.content}</p>
          </div>
        }
      />
    </SlideFrame>
  );
}
