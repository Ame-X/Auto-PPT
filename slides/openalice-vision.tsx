import type { Annotated } from '@/lib/ppt';
import { SlideFrame } from '@/lib/slide-kit';

export const text = {
  number: {
    content: '09',
    summary: '页码角标',
    rationale: '收尾页，编号 09',
  },
  eyebrow: {
    content: 'The thesis',
    summary: '小字眉标',
    rationale: '把收尾页定位成"论点回收"，与封面眉标的"品类标签"形成结构对称',
  },
  thesis: {
    content: 'Your one-person Wall Street.',
    summary: '主标语回收',
    rationale: '把封面的 tagline 在结尾再敲一次，整份 deck 围绕同一句话首尾闭环',
  },
  recap1Label: {
    content: 'Full-spectrum',
    summary: '回收点 1',
    rationale: '回收两个核心卖点之一',
  },
  recap1Body: {
    content: 'One model. Every asset.',
    summary: '回收点 1 缩句',
    rationale: '极简两句，让听众离场时能复述',
  },
  recap2Label: {
    content: 'Full-lifecycle',
    summary: '回收点 2',
    rationale: '回收两个核心卖点之另一个',
  },
  recap2Body: {
    content: 'Research to exit. Always on.',
    summary: '回收点 2 缩句',
    rationale: '同上，对仗结构',
  },
  ask: {
    content:
      'If you trade for yourself, OpenAlice is the AI you would have hired if you could.',
    summary: '收尾语 / 行动呼吁',
    rationale:
      '不是硬 CTA（投资者向场合不合适），而是一句让听众对号入座的定位句',
  },
  byline: {
    content: 'github.com/traderalice/openalice',
    summary: '署名 / 项目地址',
    rationale: '给愿意深挖的听众一个落地入口',
  },
} satisfies Record<string, Annotated>;

export default function Slide() {
  return (
    <SlideFrame className="relative flex flex-col px-40 py-28">
      <div className="flex items-baseline gap-10">
        <span className="font-display text-accent text-[88px] leading-none">
          {text.number.content}
        </span>
        <p className="text-[32px] text-mute tracking-[0.3em] uppercase">
          {text.eyebrow.content}
        </p>
      </div>

      <div className="mt-32">
        <p className="font-display italic text-ink text-[140px] leading-[1.0] tracking-tight">
          {text.thesis.content}
        </p>
      </div>

      <div className="mt-24 grid grid-cols-2 gap-16 max-w-[1400px]">
        <div className="flex flex-col gap-4 border-l-[6px] border-accent pl-8">
          <p className="font-mono text-accent text-[26px] uppercase tracking-[0.25em]">
            {text.recap1Label.content}
          </p>
          <p className="font-display text-ink text-[44px] leading-[1.2]">
            {text.recap1Body.content}
          </p>
        </div>
        <div className="flex flex-col gap-4 border-l-[6px] border-accent pl-8">
          <p className="font-mono text-accent text-[26px] uppercase tracking-[0.25em]">
            {text.recap2Label.content}
          </p>
          <p className="font-display text-ink text-[44px] leading-[1.2]">
            {text.recap2Body.content}
          </p>
        </div>
      </div>

      <p className="mt-auto font-display text-ink text-[36px] leading-[1.35] max-w-[1700px]">
        {text.ask.content}
      </p>
      <p className="font-mono text-mute text-[24px] mt-6">{text.byline.content}</p>
    </SlideFrame>
  );
}
