import type { Annotated } from '@/lib/ppt';
import { SlideFrame } from '@/lib/slide-kit';

export const text = {
  number: {
    content: '04',
    summary: '页码角标',
    rationale: '展开第一个卖点，编号 04',
  },
  title: {
    content: 'Full-spectrum',
    summary: '本页主题',
    rationale: '回应痛点 1，展开"全品类资产"的具体形态',
  },
  lede: {
    content: 'One trading model. Every market.',
    summary: '导语：一句话压缩卖点',
    rationale: '极简两句的对照，传达"统一接口 × 全市场覆盖"',
  },
  layer1Label: {
    content: 'Asset coverage',
    summary: '资产覆盖层',
    rationale: '从上往下：先讲覆盖哪些资产',
  },
  layer1Items: {
    content: 'Equities  ·  Crypto  ·  FX  ·  Commodities  ·  Macro',
    summary: '资产类别清单',
    rationale: '与痛点页的五个 silo 一一对应，让听众看到"前面的鸿沟在这里被填上了"',
  },
  layer2Label: {
    content: 'Broker integrations',
    summary: '券商集成层',
    rationale: '中层：每个资产类别背后接了哪些券商',
  },
  layer2Items: {
    content: 'Alpaca  ·  Interactive Brokers (full TWS API)  ·  CCXT 100+  ·  Longbridge',
    summary: '集成的券商列表',
    rationale: 'IBKR 标注 full TWS API 是因为我们做了零依赖 TS 端口，是项目的一个工程亮点',
  },
  layer3Label: {
    content: 'Market data',
    summary: '数据层',
    rationale: '底层：数据从哪来，是统一模型的另一个支柱',
  },
  layer3Items: {
    content:
      'TypeScript-native OpenBB port  ·  no Python sidecar  ·  cross-asset symbol search',
    summary: '数据层亮点',
    rationale: 'TS-native OpenBB 是项目的核心工程投入之一，去掉 Python 进程让本地部署更轻',
  },
  unifyTag: {
    content: 'Unified API',
    summary: '统一接口标签',
    rationale: '右侧锚点标签，强调这三层共享同一个 AI 可调用的接口',
  },
  unifyBody: {
    content:
      'A single IBroker interface; a single account model; a single set of guards. The AI thinks in one language, not six.',
    summary: '统一接口说明',
    rationale: '把"统一接口"具体到代码里真实存在的东西（IBroker / account / guards），不是营销话术',
  },
  closer: {
    content:
      'Multi-account routing inside one trader. Your IBKR equities, your CCXT spot, your futures account — managed as one portfolio.',
    summary: '收束句：多账户聚合',
    rationale: '把统一接口的最终用户价值落到"多账户合并管理"，最贴近投资者直觉',
  },
} satisfies Record<string, Annotated>;

function Layer({ label, items }: { label: string; items: string }) {
  return (
    <div className="flex flex-col gap-3 py-6 border-b border-rule">
      <p className="font-mono text-mute text-[22px] uppercase tracking-[0.2em]">
        {label}
      </p>
      <p className="font-display text-ink text-[40px] leading-[1.2]">{items}</p>
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

      <p className="font-display italic text-ink text-[60px] leading-[1.15] mt-12">
        {text.lede.content}
      </p>

      <div className="grid grid-cols-[1fr_auto] gap-20 mt-16">
        <div className="flex flex-col">
          <Layer label={text.layer1Label.content} items={text.layer1Items.content} />
          <Layer label={text.layer2Label.content} items={text.layer2Items.content} />
          <Layer label={text.layer3Label.content} items={text.layer3Items.content} />
        </div>

        <div className="flex flex-col gap-6 max-w-[520px] border-l-[6px] border-accent pl-10 self-center">
          <p className="font-mono text-accent text-[26px] uppercase tracking-[0.25em]">
            {text.unifyTag.content}
          </p>
          <p className="font-display text-ink text-[34px] leading-[1.3]">
            {text.unifyBody.content}
          </p>
        </div>
      </div>

      <p className="mt-auto font-display text-ink text-[34px] leading-[1.4] max-w-[1700px]">
        {text.closer.content}
      </p>
    </SlideFrame>
  );
}
