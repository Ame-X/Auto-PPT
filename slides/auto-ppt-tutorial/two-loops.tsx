import type { Annotated } from '@/lib/ppt';
import { SlideFrame } from '@/lib/slide-kit';

export const text = {
  number: {
    content: '06',
    summary: '页码角标',
    rationale: '位置编号',
  },
  title: {
    content: 'Two loops',
    summary: '本页主题：内容 loop 与排版 loop',
    rationale: 'agent 工作回路的核心区分，是这份工具最考究的一个设计点',
  },
  lede: {
    content:
      'Editing copy and adjusting layout are different jobs. Use different feedback loops.',
    summary: '导语：核心论点',
    rationale:
      '一句话把两种 loop 的存在理由说清楚——用错 loop 比没 loop 更糟，会自我欺骗',
  },
  contentName: {
    content: 'Content loop',
    summary: '左栏标题：内容 loop',
    rationale: '直接点名',
  },
  contentTool: {
    content: 'pnpm ppt text',
    summary: '左栏：内容 loop 的工具',
    rationale: 'AST 提取的 text 是文本编辑的 ground truth',
  },
  contentDo: {
    content: 'Read the deck as plain text. Edit copy, ordering, bullets, rationale.',
    summary: '左栏：内容 loop 适用场景',
    rationale: '让 agent 知道什么时候该走这个回路',
  },
  contentDont: {
    content: 'Do not open the browser. Screenshots will bias the copy.',
    summary: '左栏：内容 loop 的禁区',
    rationale: '强调反模式——对着图改字会下意识"让画面好看"，而忘了"让意思对"',
  },
  layoutName: {
    content: 'Layout loop',
    summary: '右栏标题：排版 loop',
    rationale: '直接点名',
  },
  layoutTool: {
    content: '/?slide=<slug>',
    summary: '右栏：排版 loop 的工具',
    rationale: '单页路由，原生 1920×1080，干净画布，配合任意浏览器工具截图',
  },
  layoutDo: {
    content: 'Open one slide in a browser. Judge font size, spacing, overflow.',
    summary: '右栏：排版 loop 适用场景',
    rationale: '让 agent 知道什么时候该走这个回路',
  },
  layoutDont: {
    content: 'Do not silently re-edit copy. Strings live in the content loop.',
    summary: '右栏：排版 loop 的禁区',
    rationale: '保护内容 loop——视觉修改不应该顺手改文字',
  },
  closer: {
    content: "Don't cross the streams.",
    summary: '收束句，致敬 Ghostbusters',
    rationale:
      '一句轻松的总结，让"两个 loop 不要混用"这件事变好记；同时也暗示混用会出问题',
  },
} satisfies Record<string, Annotated>;

function LoopCard({
  name,
  tool,
  doLine,
  dontLine,
}: {
  name: string;
  tool: string;
  doLine: string;
  dontLine: string;
}) {
  return (
    <div className="flex flex-col gap-8 border border-rule rounded-md p-12 h-full">
      <h2 className="font-display text-ink text-[64px] leading-none tracking-tight">
        {name}
      </h2>
      <div className="font-mono text-accent text-[32px] bg-slate-50 border border-rule rounded px-5 py-3 self-start">
        {tool}
      </div>
      <div className="mt-4 flex flex-col gap-6">
        <div className="flex gap-5">
          <span className="font-mono text-ink text-[26px] pt-1">do</span>
          <p className="font-display text-ink text-[34px] leading-[1.35] flex-1">
            {doLine}
          </p>
        </div>
        <div className="flex gap-5">
          <span className="font-mono text-accent text-[26px] pt-1">don't</span>
          <p className="font-display text-mute text-[34px] leading-[1.35] flex-1">
            {dontLine}
          </p>
        </div>
      </div>
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

      <p className="font-display italic text-ink text-[44px] leading-[1.3] mt-10 max-w-[1600px]">
        {text.lede.content}
      </p>

      <div className="grid grid-cols-2 gap-16 mt-16 flex-1">
        <LoopCard
          name={text.contentName.content}
          tool={text.contentTool.content}
          doLine={text.contentDo.content}
          dontLine={text.contentDont.content}
        />
        <LoopCard
          name={text.layoutName.content}
          tool={text.layoutTool.content}
          doLine={text.layoutDo.content}
          dontLine={text.layoutDont.content}
        />
      </div>

      <p className="mt-12 font-display italic text-accent text-[44px]">
        {text.closer.content}
      </p>
    </SlideFrame>
  );
}
