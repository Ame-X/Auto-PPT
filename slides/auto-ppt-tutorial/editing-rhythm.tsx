import type { Annotated } from '@/lib/ppt';
import { SlideFrame } from '@/lib/slide-kit';

export const text = {
  number: {
    content: '07',
    summary: '页码角标',
    rationale: '位置编号',
  },
  title: {
    content: 'The rhythm',
    summary: '本页主题：标准工作流',
    rationale: '把 SKILL.md 里的 5 步 loop 视觉化，让节奏可以被记住',
  },
  lede: {
    content: 'Every request to the agent walks the same five beats.',
    summary: '导语：5 步是固定节奏',
    rationale: '强调这是一个稳定的、可预期的工作模式，不是每次都重新发明',
  },
  step1Name: { content: 'Read', summary: '步骤 1 名称', rationale: '动词' },
  step1Body: {
    content: 'pnpm ppt text — pull the current deck as plain text.',
    summary: '步骤 1 内容',
    rationale: '从 ground truth 开始，永远先读后写',
  },
  step2Name: { content: 'Plan', summary: '步骤 2 名称', rationale: '动词' },
  step2Body: {
    content: 'Identify the minimum set of files to touch.',
    summary: '步骤 2 内容',
    rationale: '抑制 agent 顺手"清理"无关代码的冲动',
  },
  step3Name: { content: 'Edit', summary: '步骤 3 名称', rationale: '动词' },
  step3Body: {
    content: 'Write to slides/*.tsx and slides.config.ts.',
    summary: '步骤 3 内容',
    rationale: '明确写入目标，不动 scaffold',
  },
  step4Name: { content: 'Verify', summary: '步骤 4 名称', rationale: '动词' },
  step4Body: {
    content: 'Re-read with pnpm ppt text. For layout, open /?slide= in a browser.',
    summary: '步骤 4 内容',
    rationale: '回扣到上一页的 two loops，让节奏和工具呼应',
  },
  step5Name: { content: 'Report', summary: '步骤 5 名称', rationale: '动词' },
  step5Body: {
    content: 'One sentence on what changed. Then stop.',
    summary: '步骤 5 内容',
    rationale: '强调"停"——agent 容易过度阐述、过度延伸',
  },
  closer: {
    content: 'Read · Plan · Edit · Verify · Report.',
    summary: '把 5 步连起来念一遍',
    rationale: '让节奏在观众脑里收束成一句话',
  },
} satisfies Record<string, Annotated>;

function Beat({
  index,
  name,
  body,
}: {
  index: string;
  name: string;
  body: string;
}) {
  return (
    <div className="flex flex-col gap-4 flex-1">
      <span className="font-mono text-accent text-[26px]">{index}</span>
      <h3 className="font-display text-ink text-[56px] leading-none tracking-tight">
        {name}
      </h3>
      <p className="font-display text-mute text-[28px] leading-[1.35] mt-2">
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

      <p className="font-display italic text-ink text-[44px] leading-[1.3] mt-12 max-w-[1600px]">
        {text.lede.content}
      </p>

      <div className="flex items-start gap-8 mt-24">
        <Beat index="01" name={text.step1Name.content} body={text.step1Body.content} />
        <div className="font-display text-rule text-[80px] leading-none pt-12">·</div>
        <Beat index="02" name={text.step2Name.content} body={text.step2Body.content} />
        <div className="font-display text-rule text-[80px] leading-none pt-12">·</div>
        <Beat index="03" name={text.step3Name.content} body={text.step3Body.content} />
        <div className="font-display text-rule text-[80px] leading-none pt-12">·</div>
        <Beat index="04" name={text.step4Name.content} body={text.step4Body.content} />
        <div className="font-display text-rule text-[80px] leading-none pt-12">·</div>
        <Beat index="05" name={text.step5Name.content} body={text.step5Body.content} />
      </div>

      <p className="mt-auto font-mono text-accent text-[36px] tracking-tight">
        {text.closer.content}
      </p>
    </SlideFrame>
  );
}
