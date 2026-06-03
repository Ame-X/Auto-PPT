import type { Annotated } from '@/lib/ppt';
import { SlideFrame } from '@/lib/slide-kit';

export const text = {
  eyebrow: {
    content: 'A full-stack AI trading agent',
    summary: '封面眉标，告诉听众这是一个什么品类的产品',
    rationale:
      '投资者/产品向听众第一眼要看到品类标签——"AI 交易 agent"比项目名更能定位认知；用 full-stack 暗示后面会展开的两大卖点',
  },
  title: {
    content: 'OpenAlice',
    summary: '主标题：项目名',
    rationale: '封面给项目名最高视觉权重，让听众离开会场至少记住这个词',
  },
  thesis: {
    content: 'Your one-person Wall Street.',
    summary: '一句话定位，整份 deck 的论点种子',
    rationale:
      '用户在 README 自己定的 tagline；它把"一个 AI agent 顶替整条投行流水线"的野心压缩进一句话，所有后续 slide 都是这句话的拆解',
  },
  byline: {
    content: 'A small sharing session · 2026',
    summary: '副署名，说明语境',
    rationale: '场合是小型分享会，留一个轻量的时间/场合标记，不抢标题',
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
