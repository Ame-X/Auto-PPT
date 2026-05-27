import type { Annotated } from '@/lib/ppt';
import { SlideFrame } from '@/lib/slide-kit';

export const text = {
  number: {
    content: '05',
    summary: '页码角标',
    rationale:
      '大号衬线数字作为视觉锚点，让 deck 在翻页时有节奏感；数字硬编码在内容里是有意的——重排序时需要手动更新，这是把"位置变了"作为显式 diff 而不是隐式漂移',
  },
  title: {
    content: 'The Annotated triple',
    summary: '本页主标题',
    rationale: '直接说今天要拆的概念：Annotated 三元组',
  },
  lede: {
    content:
      'Every renderable string on a slide carries three fields. The audience only ever sees one of them.',
    summary: '导语：建立悬念',
    rationale:
      '先说"三个字段但只有一个被看见"，让观众好奇另外两个是给谁的——答案下面三栏会给',
  },
  contentLabel: {
    content: 'content',
    summary: '第一栏标题：content',
    rationale: '直接用代码里的字段名，避免翻译，让读者建立到 .tsx 文件的映射',
  },
  contentBody: {
    content: 'What the audience sees on the slide. The only field that renders.',
    summary: 'content 字段的解释',
    rationale: '强调它是唯一会显示的字段，给后两栏 "那它们是干嘛的" 留扣子',
  },
  summaryLabel: {
    content: 'summary',
    summary: '第二栏标题：summary',
    rationale: '同样用字段名',
  },
  summaryBody: {
    content:
      'One short line of what this element is for. Reads like a comment for the next agent.',
    summary: 'summary 字段的解释',
    rationale: '让观众理解这是给 agent / 后续协作者看的元信息',
  },
  rationaleLabel: {
    content: 'rationale',
    summary: '第三栏标题：rationale',
    rationale: '同样用字段名',
  },
  rationaleBody: {
    content:
      'Why this content exists, in this shape. The honest one. The field that decays first if you let it.',
    summary: 'rationale 字段的解释',
    rationale:
      '把 SKILL.md 里 "rationale 最容易腐烂" 的观点带到 deck 里——这是整套约定里最有性格的部分，值得点出来',
  },
  closer: {
    content:
      'The first field is for the room. The other two are for the agent who edits this slide six months from now.',
    summary: '收束句，把三栏的关系收回到一句话',
    rationale:
      '一页的结构是"问题 - 三栏拆解 - 一句收束"，最后这句把意图明确说出来：rationale 是给未来的协作者写的',
  },
} satisfies Record<string, Annotated>;

function Column({
  label,
  body,
  highlight = false,
}: {
  label: string;
  body: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex flex-col gap-6">
      <p
        className={`font-mono text-[32px] ${
          highlight ? 'text-accent' : 'text-ink'
        }`}
      >
        {label}
      </p>
      <div className="h-[2px] bg-rule" />
      <p
        className={`font-display text-[36px] leading-[1.35] ${
          highlight ? 'text-ink' : 'text-mute'
        }`}
      >
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

      <p className="font-display italic text-ink text-[48px] leading-[1.3] mt-16 max-w-[1400px]">
        {text.lede.content}
      </p>

      <div className="grid grid-cols-3 gap-16 mt-24">
        <Column label={text.contentLabel.content} body={text.contentBody.content} />
        <Column label={text.summaryLabel.content} body={text.summaryBody.content} />
        <Column
          label={text.rationaleLabel.content}
          body={text.rationaleBody.content}
          highlight
        />
      </div>

      <p className="mt-auto font-display text-ink text-[36px] leading-[1.4] max-w-[1500px]">
        {text.closer.content}
      </p>
    </SlideFrame>
  );
}
