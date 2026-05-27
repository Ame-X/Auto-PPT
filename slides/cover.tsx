import type { Annotated } from '@/lib/ppt';
import { SlideFrame } from '@/lib/slide-kit';

export const text = {
  eyebrow: {
    content: 'A tutorial',
    summary: '封面眉标，告诉观众这是一份教程',
    rationale:
      '小字眉标比副标题轻，把"教程"这个定位放在视线进入主标题之前，给后面 8 张页面定基调',
  },
  title: {
    content: 'Auto-PPT',
    summary: '主标题：项目名',
    rationale:
      '封面直接打项目名，让观众第一眼知道在讲什么；用衬线大字号承担视觉重量，区别于内文 sans 字体',
  },
  thesis: {
    content: 'A deck is a folder of code.',
    summary: '一句话定位，整份 deck 的论点种子',
    rationale:
      '用陈述句而不是 feature 描述，把后面要展开的所有内容压缩成一行——后面每张 slide 都是在解开这一句话',
  },
  byline: {
    content: 'Made with Auto-PPT, about Auto-PPT.',
    summary: '自指署名，强调这份教程本身是 demo',
    rationale:
      '自举是这份 deck 最强的论据：你正在看的东西就是工具自身能力的证据。署名放最下面以小字呈现，不抢戏',
  },
} satisfies Record<string, Annotated>;

export default function Slide() {
  return (
    <SlideFrame className="relative flex flex-col justify-center px-40">
      <p className="text-[32px] text-mute tracking-[0.3em] uppercase mb-12">
        {text.eyebrow.content}
      </p>
      <h1 className="font-display text-ink text-[280px] leading-[0.95] tracking-tight">
        {text.title.content}
      </h1>
      <div className="mt-16 flex items-baseline gap-10">
        <span className="w-[120px] h-[4px] bg-accent translate-y-[-12px]" />
        <p className="font-display italic text-ink text-[64px] leading-tight">
          {text.thesis.content}
        </p>
      </div>
      <p className="absolute bottom-20 left-40 right-40 font-mono text-[24px] text-mute">
        {text.byline.content}
      </p>
    </SlideFrame>
  );
}
