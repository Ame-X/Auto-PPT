import type { Annotated } from '@/lib/ppt';
import { SlideFrame } from '@/lib/slide-kit';

export const text = {
  number: {
    content: '01',
    summary: '页码角标',
    rationale: '第一张内容页，编号 01；硬编码以便重排时显式更新',
  },
  title: {
    content: 'The asset-class wall',
    summary: '本页主题：第一个痛点',
    rationale:
      '用户明确要求把两个核心痛点放在最前面铺垫；这是痛点 1——资产品类之间的鸿沟',
  },
  lede: {
    content:
      "If an AI is going to trade for you, it needs one way to think\nabout every asset you hold. Today, it has five.",
    summary: '导语：把"AI 需要统一抽象"这件事说出来',
    rationale:
      '用户原话：让 AI 操作资产必须有统一的操作方法，但市面抽象都是残的；"five" 与下面五个 silo 卡片对应，避免数字与视觉不符',
  },
  siloEquitiesLabel: {
    content: 'Equities',
    summary: '资产孤岛 1',
    rationale: '展示散裂感——每个资产类别一个独立的 API 和心智模型',
  },
  siloEquitiesAPI: {
    content: 'Alpaca · IBKR · Longbridge',
    summary: '股票对应的 API 生态',
    rationale: '具体到现实中的 broker，让"孤岛"不是抽象比喻',
  },
  siloCryptoLabel: {
    content: 'Crypto',
    summary: '资产孤岛 2',
    rationale: '加密资产是另一个完全独立的 broker 生态',
  },
  siloCryptoAPI: {
    content: 'CCXT · 100+ exchanges',
    summary: '加密资产对应的接入面',
    rationale: '强调即便 CCXT 已经统一了 100+ 交易所，它和股票 broker 之间还是两套系统',
  },
  siloFXLabel: {
    content: 'FX',
    summary: '资产孤岛 3',
    rationale: '外汇是又一套报价/下单逻辑',
  },
  siloFXAPI: {
    content: 'IBKR forex · OANDA',
    summary: '外汇对应的 broker',
    rationale: '具体到现实中的供应商',
  },
  siloCommoditiesLabel: {
    content: 'Commodities',
    summary: '资产孤岛 4',
    rationale: '商品/期货也是独立的接入和持仓模型',
  },
  siloCommoditiesAPI: {
    content: 'CME · EIA · futures rolls',
    summary: '商品对应的数据/合约源',
    rationale: 'EIA 是能源信息署，futures rolls 暗示期货合约换月——这些都是股票世界没有的概念',
  },
  siloMacroLabel: {
    content: 'Macro',
    summary: '资产孤岛 5',
    rationale: '宏观数据虽然不直接下单，但是决策依据，AI 也需要',
  },
  siloMacroAPI: {
    content: 'FRED · BLS · central banks',
    summary: '宏观数据源',
    rationale: '宏观数据源跟其他四类完全无关，进一步说明散裂',
  },
  closer: {
    content:
      'Without one model that spans them all, the AI cannot reason across your portfolio. It can only suggest, one silo at a time.',
    summary: '收束句：点明散裂的代价',
    rationale:
      '把痛点的"so what"说出来——不是 API 多本身有问题，而是 AI 没法跨品类思考；为后面 OpenAlice 的"统一接口"做铺垫',
  },
} satisfies Record<string, Annotated>;

function Silo({ label, api }: { label: string; api: string }) {
  return (
    <div className="flex flex-col gap-4 border border-rule rounded-md px-8 py-10 bg-slate-50">
      <p className="font-display text-ink text-[40px] leading-none">{label}</p>
      <div className="h-[2px] bg-rule" />
      <p className="font-mono text-mute text-[22px] leading-[1.4]">{api}</p>
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

      <p className="font-display italic text-ink text-[52px] leading-[1.25] mt-16 max-w-[1600px] whitespace-pre-line">
        {text.lede.content}
      </p>

      <div className="grid grid-cols-5 gap-6 mt-20">
        <Silo label={text.siloEquitiesLabel.content} api={text.siloEquitiesAPI.content} />
        <Silo label={text.siloCryptoLabel.content} api={text.siloCryptoAPI.content} />
        <Silo label={text.siloFXLabel.content} api={text.siloFXAPI.content} />
        <Silo
          label={text.siloCommoditiesLabel.content}
          api={text.siloCommoditiesAPI.content}
        />
        <Silo label={text.siloMacroLabel.content} api={text.siloMacroAPI.content} />
      </div>

      <p className="mt-auto font-display text-ink text-[36px] leading-[1.4] max-w-[1700px]">
        {text.closer.content}
      </p>
    </SlideFrame>
  );
}
