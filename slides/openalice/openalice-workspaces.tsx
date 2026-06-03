import type { Annotated } from '@/lib/ppt';
import { SlideFrame } from '@/lib/slide-kit';

export const text = {
  number: {
    content: '07',
    summary: '页码角标',
    rationale: '扩展性设计页，编号 07',
  },
  title: {
    content: 'Workspaces',
    summary: '本页主题：能力扩展机制',
    rationale: 'Workspace 是项目的架构基石，让能力可以独立加进来而不让核心膨胀',
  },
  lede: {
    content: 'Capabilities grow as templates. The core stays small.',
    summary: '导语：扩展模型的精髓',
    rationale: '把"模板化扩展"这个设计哲学压缩进一句话',
  },
  templateAllLabel: {
    content: 'Three live templates today',
    summary: '模板区标题',
    rationale: '三个已有模板的总览标签',
  },
  templateChatLabel: {
    content: 'chat',
    summary: '模板 1 名称',
    rationale: '通用对话工作区',
  },
  templateChatBody: {
    content:
      'General-purpose Alice. Full MCP tool surface, long-running research threads.',
    summary: '模板 1 说明',
    rationale: '强调 chat 是最通用、能力最齐全的入口',
  },
  templateQuantLabel: {
    content: 'auto-quant',
    summary: '模板 2 名称',
    rationale: '量化研究工作区',
  },
  templateQuantBody: {
    content:
      'Backtesting and strategy iteration harness. Loops between hypothesis, code, and result.',
    summary: '模板 2 说明',
    rationale: '把"量化研究"具象到 hypothesis → code → result 循环',
  },
  templateResearchLabel: {
    content: 'finance-research',
    summary: '模板 3 名称',
    rationale: '深度研究工作区',
  },
  templateResearchBody: {
    content:
      'Structured financial research with satellite sub-tasks. Memos, models, and citations.',
    summary: '模板 3 说明',
    rationale: '强调它产出的是可引用、可复盘的研究材料',
  },
  insideTag: {
    content: 'Inside a workspace',
    summary: '右栏标签',
    rationale: '把"workspace 里面长什么样"作为副论点',
  },
  inside1: {
    content: 'Persistent PTY session running a native agent CLI (Claude Code, Codex, shell).',
    summary: '内部细节 1',
    rationale: 'PTY + 原生 CLI 是 workspace 的工程基础',
  },
  inside2: {
    content: 'Per-task directory with its own git repo for full history.',
    summary: '内部细节 2',
    rationale: '每个任务独立版本控制，呼应 Trading-as-Git 的可审计哲学',
  },
  inside3: {
    content: 'Per-workspace MCP tools exposed to the agent.',
    summary: '内部细节 3',
    rationale: 'MCP 让 workspace 能调到外部工具，扩展能力面',
  },
  closer: {
    content:
      'New capability = new template. The core trading model never has to grow to keep up with the strategy you tried last weekend.',
    summary: '收束句：能力扩展的成本曲线',
    rationale: '强调扩展成本可控——这是给投资者看的"可持续工程"信号',
  },
} satisfies Record<string, Annotated>;

function Template({
  name,
  body,
}: {
  name: string;
  body: string;
}) {
  return (
    <div className="flex flex-col gap-3 border border-rule rounded-md px-7 py-5 bg-slate-50">
      <p className="font-mono text-accent text-[30px] leading-none">{name}</p>
      <div className="h-[2px] bg-rule" />
      <p className="font-display text-ink text-[24px] leading-[1.4]">{body}</p>
    </div>
  );
}

function InsideRow({ body }: { body: string }) {
  return (
    <div className="flex gap-6">
      <span className="font-mono text-accent text-[28px] pt-2">→</span>
      <p className="font-display text-ink text-[28px] leading-[1.4]">{body}</p>
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

      <p className="font-display italic text-ink text-[52px] leading-[1.2] mt-12 max-w-[1700px]">
        {text.lede.content}
      </p>

      <div className="grid grid-cols-[1.3fr_1fr] gap-20 mt-12">
        <div className="flex flex-col gap-5">
          <p className="font-mono text-mute text-[24px] uppercase tracking-[0.25em]">
            {text.templateAllLabel.content}
          </p>
          <div className="grid grid-cols-1 gap-4">
            <Template
              name={text.templateChatLabel.content}
              body={text.templateChatBody.content}
            />
            <Template
              name={text.templateQuantLabel.content}
              body={text.templateQuantBody.content}
            />
            <Template
              name={text.templateResearchLabel.content}
              body={text.templateResearchBody.content}
            />
          </div>
        </div>

        <div className="flex flex-col gap-6 border-l-[6px] border-accent pl-10">
          <p className="font-mono text-accent text-[24px] uppercase tracking-[0.25em]">
            {text.insideTag.content}
          </p>
          <InsideRow body={text.inside1.content} />
          <InsideRow body={text.inside2.content} />
          <InsideRow body={text.inside3.content} />
        </div>
      </div>

      <p className="mt-auto font-display text-ink text-[32px] leading-[1.4] max-w-[1700px]">
        {text.closer.content}
      </p>
    </SlideFrame>
  );
}
