import type { Annotated } from '@/lib/ppt';
import { SlideFrame } from '@/lib/slide-kit';

export const text = {
  number: {
    content: '05',
    summary: '页码角标',
    rationale: '展开第二个卖点，编号 05',
  },
  title: {
    content: 'Full-lifecycle',
    summary: '本页主题',
    rationale: '回应痛点 2，展开"全生命周期陪伴"的具体形态',
  },
  lede: {
    content: 'Research → Enter → Manage → Exit. Always on. Always with you.',
    summary: '导语：四阶段时间线',
    rationale: '与痛点页的四阶段呼应，但这一次每个阶段都有 OpenAlice 在场',
  },
  stage1Label: {
    content: 'Research',
    summary: '阶段 1 标题',
    rationale: '研究阶段',
  },
  stage1Body: {
    content:
      'Screens markets across every asset class. Reads the news archive. Runs fundamental and technical analysis on demand.',
    summary: '阶段 1 内容',
    rationale:
      '对应项目中的 market-data / news / analysis 模块，让 AI 在买入前已经做完作业',
  },
  stage2Label: {
    content: 'Enter',
    summary: '阶段 2 标题',
    rationale: '入场阶段',
  },
  stage2Body: {
    content:
      'Sizes positions against your account. Drafts the order. You see it before it goes out — every time.',
    summary: '阶段 2 内容',
    rationale:
      '强调下单是 AI 起草 + 用户审核的协作流程，铺垫下一页 Trading-as-Git',
  },
  stage3Label: {
    content: 'Manage',
    summary: '阶段 3 标题',
    rationale: '持有/调仓阶段——用户口中"最痛"的阶段',
  },
  stage3Body: {
    content:
      'Watches equity curves, news, and indicators around the clock. Surfaces rebalance signals when conviction or risk changes.',
    summary: '阶段 3 内容',
    rationale:
      '把"陪你管仓"具体化：监控曲线/新闻/指标，主动推送调仓建议；这是 OpenAlice 的核心差异化',
  },
  stage4Label: {
    content: 'Exit',
    summary: '阶段 4 标题',
    rationale: '退出阶段',
  },
  stage4Body: {
    content:
      'Triggers stop alerts, suggests trims, drafts the closing order. Closes the loop the same way it opened it.',
    summary: '阶段 4 内容',
    rationale: '把退出与入场形成对称——开仓和平仓走同一套审核流程',
  },
  closer: {
    content:
      'You spend ten minutes a day reviewing. OpenAlice spends 24 hours watching.',
    summary: '收束句：分工总结',
    rationale: '把"全生命周期"翻译成时间分配——10 分钟 vs 24 小时，直观且易记',
  },
} satisfies Record<string, Annotated>;

function Stage({
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
      <div className="flex items-baseline gap-6">
        <span className="font-mono text-accent text-[24px]">{index}</span>
        <p className="font-display text-ink text-[52px] leading-none">{label}</p>
      </div>
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

      <div className="grid grid-cols-4 gap-10 mt-20">
        <Stage index="01" label={text.stage1Label.content} body={text.stage1Body.content} />
        <Stage index="02" label={text.stage2Label.content} body={text.stage2Body.content} />
        <Stage index="03" label={text.stage3Label.content} body={text.stage3Body.content} />
        <Stage index="04" label={text.stage4Label.content} body={text.stage4Body.content} />
      </div>

      <p className="mt-auto font-display italic text-ink text-[40px] leading-[1.3] max-w-[1700px]">
        {text.closer.content}
      </p>
    </SlideFrame>
  );
}
