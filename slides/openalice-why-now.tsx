import type { Annotated } from '@/lib/ppt';
import { SlideFrame } from '@/lib/slide-kit';

export const text = {
  number: {
    content: '08',
    summary: '页码角标',
    rationale: '时机页，编号 08',
  },
  title: {
    content: 'Why now',
    summary: '本页主题：市场时机',
    rationale: '投资者听众必看的"时机"叙事——为什么这个产品 2025/2026 才能成立',
  },
  lede: {
    content: 'Three curves crossed in the last two years. OpenAlice sits at the intersection.',
    summary: '导语：三条曲线交汇',
    rationale: '用"三条曲线交点"的隐喻把 timing 论证结构化',
  },
  trend1Label: {
    content: 'Agents got real',
    summary: '趋势 1 标题',
    rationale: 'AI agent 能力到位是产品成立的前提',
  },
  trend1Body: {
    content:
      'Claude Code, Codex, and the wider agent stack finally reason well enough to run a multi-step trade plan without supervision on every step.',
    summary: '趋势 1 内容',
    rationale: '具体到现有 agent 产品名，让"能力到位"不空泛',
  },
  trend2Label: {
    content: 'Broker APIs opened',
    summary: '趋势 2 标题',
    rationale: '券商 API 对零售投资者全面开放',
  },
  trend2Body: {
    content:
      'Alpaca, IBKR Gateway, CCXT, Longbridge — for the first time a retail trader can wire every account they hold into one process.',
    summary: '趋势 2 内容',
    rationale: '强调"散户首次能把所有账户接入同一个进程"——这正是 OpenAlice 的供给端机会',
  },
  trend3Label: {
    content: 'Retail wants control back',
    summary: '趋势 3 标题',
    rationale: '需求端：散户对中心化平台的不信任在累积',
  },
  trend3Body: {
    content:
      'After FTX, after Robinhood lock-ups, after every "your funds are safu" — a self-hosted alternative is no longer a niche preference.',
    summary: '趋势 3 内容',
    rationale: '点几个让人共鸣的近期事件，把"散户要回控制权"这件事坐实',
  },
  closer: {
    content: 'OpenAlice is built where supply, demand, and capability finally meet.',
    summary: '收束句：交点定位',
    rationale: '把三条趋势收束到"供给/需求/能力的交点"这个简洁的定位句',
  },
} satisfies Record<string, Annotated>;

function Trend({
  index,
  label,
  body,
}: {
  index: string;
  label: string;
  body: string;
}) {
  return (
    <div className="flex flex-col gap-6 border-t-[6px] border-accent pt-8">
      <p className="font-mono text-accent text-[24px]">{index}</p>
      <p className="font-display text-ink text-[52px] leading-[1.05] tracking-tight">
        {label}
      </p>
      <p className="font-display text-mute text-[28px] leading-[1.35]">{body}</p>
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

      <p className="font-display italic text-ink text-[48px] leading-[1.2] mt-12 max-w-[1700px]">
        {text.lede.content}
      </p>

      <div className="grid grid-cols-3 gap-16 mt-20">
        <Trend index="01" label={text.trend1Label.content} body={text.trend1Body.content} />
        <Trend index="02" label={text.trend2Label.content} body={text.trend2Body.content} />
        <Trend index="03" label={text.trend3Label.content} body={text.trend3Body.content} />
      </div>

      <p className="mt-auto font-display italic text-ink text-[40px] leading-[1.3] max-w-[1700px]">
        {text.closer.content}
      </p>
    </SlideFrame>
  );
}
