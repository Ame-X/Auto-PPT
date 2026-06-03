import type { Annotated } from '@/lib/ppt';
import { SlideFrame } from '@/lib/slide-kit';

export const text = {
  number: {
    content: '02',
    summary: '页码角标',
    rationale: '第二个痛点页，编号 02',
  },
  title: {
    content: 'The lifecycle gap',
    summary: '本页主题：第二个痛点',
    rationale:
      '用户明确指出：交易最大的痛点不在于怎么买，而在买完之后的持有/调仓/卖出；这一页把这个 gap 立起来',
  },
  lede: {
    content:
      "Buying is the easy 10%. The other 90% — holding, rebalancing,\nknowing when to sell — is where money is actually made or lost.",
    summary: '导语：把痛点的重心说清楚',
    rationale:
      '用户原话的英文化表达：痛点不在买，而在持有/调仓/卖出；用 10%/90% 的对比强化',
  },
  stage1Label: {
    content: 'Research',
    summary: '生命周期阶段 1',
    rationale: '四阶段时间轴：研究 → 入场 → 持有 → 退出',
  },
  stage2Label: {
    content: 'Enter',
    summary: '生命周期阶段 2',
    rationale: '入场，即"买"，市面工具几乎都聚焦在这一步',
  },
  stage3Label: {
    content: 'Manage',
    summary: '生命周期阶段 3',
    rationale: '持有/调仓——用户口中"最痛"的阶段',
  },
  stage4Label: {
    content: 'Exit',
    summary: '生命周期阶段 4',
    rationale: '退出/卖出，决定盈亏兑现的关键',
  },
  toolFocus: {
    content: 'Where every tool lives',
    summary: '标注：市面工具聚集的位置',
    rationale: '把"工具都堆在 Enter"这个事实可视化，让对比更直观',
  },
  realityFocus: {
    content: 'Where your money lives',
    summary: '标注：钱实际待的位置',
    rationale: '把"钱大部分时间在 Manage 阶段"这个事实可视化，与上面工具分布形成对照',
  },
  closer: {
    content:
      'Every AI trader you have seen is a recommender. None of them are stewards. OpenAlice is built to be the steward.',
    summary: '收束句：定义 recommender vs steward 的差别，引出 OpenAlice',
    rationale:
      '把"AI 现在只会推荐、不会陪你管仓"这个观察具象化，并在最后一句点 OpenAlice 名字，作为下一页的过渡钩子',
  },
} satisfies Record<string, Annotated>;

function StageBar({
  stages,
  toolStage,
  realityStage,
  toolLabel,
  realityLabel,
}: {
  stages: string[];
  toolStage: number;
  realityStage: number;
  toolLabel: string;
  realityLabel: string;
}) {
  return (
    <div className="relative w-full mt-12">
      {/* tool-focus marker above the bar */}
      <div
        className="absolute -top-20 flex flex-col items-center"
        style={{
          left: `${(toolStage + 0.5) * (100 / stages.length)}%`,
          transform: 'translateX(-50%)',
        }}
      >
        <p className="font-mono text-mute text-[24px] uppercase tracking-[0.2em] whitespace-nowrap">
          {toolLabel}
        </p>
        <div className="text-mute text-[36px] leading-none">▼</div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {stages.map((stage, i) => {
          const isReality = i === realityStage;
          return (
            <div
              key={stage}
              className={`relative h-[180px] flex items-center justify-center border-2 rounded-md ${
                isReality
                  ? 'border-accent bg-accent/5'
                  : 'border-rule bg-white'
              }`}
            >
              <p
                className={`font-display text-[56px] leading-none ${
                  isReality ? 'text-accent' : 'text-ink'
                }`}
              >
                {stage}
              </p>
            </div>
          );
        })}
      </div>

      {/* reality marker below */}
      <div
        className="absolute -bottom-20 flex flex-col items-center"
        style={{
          left: `${(realityStage + 0.5) * (100 / stages.length)}%`,
          transform: 'translateX(-50%)',
        }}
      >
        <div className="text-accent text-[36px] leading-none">▲</div>
        <p className="font-mono text-accent text-[24px] uppercase tracking-[0.2em] whitespace-nowrap">
          {realityLabel}
        </p>
      </div>
    </div>
  );
}

export default function Slide() {
  const stages = [
    text.stage1Label.content,
    text.stage2Label.content,
    text.stage3Label.content,
    text.stage4Label.content,
  ];
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

      <p className="font-display italic text-ink text-[52px] leading-[1.25] mt-12 max-w-[1700px] whitespace-pre-line">
        {text.lede.content}
      </p>

      <div className="mt-32 px-8">
        <StageBar
          stages={stages}
          toolStage={1}
          realityStage={2}
          toolLabel={text.toolFocus.content}
          realityLabel={text.realityFocus.content}
        />
      </div>

      <p className="mt-auto font-display text-ink text-[36px] leading-[1.4] max-w-[1700px]">
        {text.closer.content}
      </p>
    </SlideFrame>
  );
}
