import type { Annotated } from '@/lib/ppt';
import { SlideFrame } from '@/lib/slide-kit';

export const text = {
  number: {
    content: '08',
    summary: '页码角标',
    rationale: '位置编号',
  },
  title: {
    content: 'Hand it off',
    summary: '本页主题：如何把仓库交给 agent',
    rationale: '前面把约定、loop、节奏都讲完了，这一页告诉观众"现在怎么用"',
  },
  lede: {
    content: 'Clone, open in any coding agent, and just talk to it.',
    summary: '导语：上手方式',
    rationale: '强调零额外配置——agent + SKILL.md 就足够',
  },
  promptLabel: {
    content: 'You say:',
    summary: '左侧角色标签',
    rationale: '类似剧本台词，标明这一段是用户的话',
  },
  prompt: {
    content:
      'Make me a 5-slide pitch deck for a CLI that turns terminal recordings into animated GIFs. The audience is developer-tool buyers.',
    summary: '示范性的用户指令',
    rationale:
      '一个具体、领域明确、有受众的请求——这种 prompt 是 agent 能直接动手做事的形态',
  },
  responseLabel: {
    content: 'The agent does:',
    summary: '右侧角色标签',
    rationale: '同上，标明这一段是 agent 的行为',
  },
  responseLines: {
    content: `pnpm ppt list
pnpm ppt new title
pnpm ppt new the-problem
pnpm ppt new the-product
pnpm ppt new how-it-works
pnpm ppt new pricing
# edits slides.config.ts
# writes each slides/*.tsx
pnpm ppt text`,
    summary: '示范性的 agent 动作序列',
    rationale:
      '展示 agent 在仓库里实际会跑的命令序列；用 # 注释表示文件编辑动作，避免假装 agent 在终端里写完整代码',
  },
  closer: {
    content: 'No new tooling to learn. The repo and SKILL.md are the entire spec.',
    summary: '收束句',
    rationale:
      '把 hand-off 的低成本说出来——这是 Auto-PPT 相对于其他 PPT 工具的核心优势之一',
  },
} satisfies Record<string, Annotated>;

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

      <div className="grid grid-cols-2 gap-16 mt-14 flex-1">
        <div className="flex flex-col gap-5">
          <p className="font-mono text-accent text-[26px]">
            {text.promptLabel.content}
          </p>
          <div className="border-l-4 border-accent pl-8 py-2">
            <p className="font-display italic text-ink text-[40px] leading-[1.35]">
              "{text.prompt.content}"
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <p className="font-mono text-accent text-[26px]">
            {text.responseLabel.content}
          </p>
          <pre className="bg-slate-50 border border-rule rounded-md p-8 font-mono text-[24px] leading-[1.55] text-ink whitespace-pre">
            {text.responseLines.content}
          </pre>
        </div>
      </div>

      <p className="mt-auto font-display text-ink text-[34px] leading-[1.4] max-w-[1700px]">
        {text.closer.content}
      </p>
    </SlideFrame>
  );
}
