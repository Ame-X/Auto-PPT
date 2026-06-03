import type { Annotated } from '@/lib/ppt';
import { SlideFrame, Title, Body } from '@/lib/slide-kit';

export const text = {
  title: {
    content: 'Welcome to Auto-PPT',
    summary: '封面主标题',
    rationale:
      'scaffold 默认页，让 clone 完仓库的用户立刻看到一张能跑的 slide，建立对项目的第一印象',
  },
  subtitle: {
    content: 'Each slide is a .tsx file. Edit me.',
    summary: '副标题，提示用户编辑入口在哪里',
    rationale:
      '第一眼就把整个 Harness 的核心 affordance 摆出来——slide 就是 tsx 文件、改就改这个文件',
  },
} satisfies Record<string, Annotated>;

export default function Slide() {
  return (
    <SlideFrame className="flex flex-col items-center justify-center text-center gap-16 p-32">
      <Title className="text-[140px]">{text.title.content}</Title>
      <Body className="text-[56px] text-slate-500">{text.subtitle.content}</Body>
    </SlideFrame>
  );
}
