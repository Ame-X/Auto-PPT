import type { Annotated } from '@/lib/ppt';
import { SlideFrame } from '@/lib/slide-kit';

export const text = {
  number: {
    content: '03',
    summary: '页码角标',
    rationale: '前面两页铺痛点，这一页揭晓产品，编号 03',
  },
  title: {
    content: 'Enter OpenAlice.',
    summary: '主标题：让产品登场',
    rationale: '直接的剧本写法——两个 pain slide 之后用"Enter"这个动词让产品入场',
  },
  thesis: {
    content:
      'An AI partner that covers every asset, across the whole journey.',
    summary: '一句话产品定位',
    rationale:
      '这一句把痛点 1（全资产）和痛点 2（全生命周期）的答案直接拼出来；"partner"而不是"tool"，呼应"steward not recommender"',
  },
  pillar1Tag: {
    content: 'Answer to pain #1',
    summary: '左柱标签',
    rationale: '显式把柱子对应到痛点编号，让结构清晰',
  },
  pillar1Title: {
    content: 'Full-spectrum',
    summary: '左柱主题：全资产',
    rationale: '用户原话的两个卖点之一——全品类资产',
  },
  pillar1Body: {
    content:
      'One unified trading model the AI can actually think in. Equities, crypto, FX, commodities, macro — all behind one abstraction.',
    summary: '左柱说明',
    rationale: '点出统一抽象的价值，铺垫下一页的展开',
  },
  pillar2Tag: {
    content: 'Answer to pain #2',
    summary: '右柱标签',
    rationale: '同上，与左柱对应',
  },
  pillar2Title: {
    content: 'Full-lifecycle',
    summary: '右柱主题：全周期',
    rationale: '用户原话的另一个卖点——全生命周期',
  },
  pillar2Body: {
    content:
      'A companion for the entire trade, not the entry signal. Research, position, monitor, rebalance, exit — 24/7.',
    summary: '右柱说明',
    rationale: '强调它陪你走完整段持仓，铺垫下下页',
  },
  byline: {
    content: 'Your one-person Wall Street.',
    summary: '页脚 tagline 回扣',
    rationale: '把封面的 tagline 在产品揭晓页再敲一次，强化记忆',
  },
} satisfies Record<string, Annotated>;

function Pillar({
  tag,
  title,
  body,
}: {
  tag: string;
  title: string;
  body: string;
}) {
  return (
    <div className="flex flex-col gap-8 border-t-[6px] border-accent pt-10">
      <p className="font-mono text-accent text-[24px] uppercase tracking-[0.25em]">
        {tag}
      </p>
      <p className="font-display text-ink text-[88px] leading-[0.95] tracking-tight">
        {title}
      </p>
      <p className="font-display text-mute text-[34px] leading-[1.35] max-w-[700px]">
        {body}
      </p>
    </div>
  );
}

export default function Slide() {
  return (
    <SlideFrame className="relative flex flex-col px-32 py-28">
      <div className="flex items-baseline gap-10">
        <span className="font-display text-accent text-[88px] leading-none">
          {text.number.content}
        </span>
        <h1 className="font-display text-ink text-[88px] leading-none tracking-tight">
          {text.title.content}
        </h1>
      </div>

      <p className="font-display italic text-ink text-[60px] leading-[1.2] mt-14 max-w-[1700px]">
        {text.thesis.content}
      </p>

      <div className="grid grid-cols-2 gap-24 mt-24">
        <Pillar
          tag={text.pillar1Tag.content}
          title={text.pillar1Title.content}
          body={text.pillar1Body.content}
        />
        <Pillar
          tag={text.pillar2Tag.content}
          title={text.pillar2Title.content}
          body={text.pillar2Body.content}
        />
      </div>

      <p className="mt-auto font-mono text-mute text-[28px]">{text.byline.content}</p>
    </SlideFrame>
  );
}
