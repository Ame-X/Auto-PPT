import type { Annotated } from '@/lib/ppt';
import { SlideFrame } from '@/lib/slide-kit';

export const text = {
  number: {
    content: '02',
    summary: '页码角标',
    rationale: '与封面之后第二页位置对应，保持节奏',
  },
  title: {
    content: 'The question',
    summary: '本页主题',
    rationale: '不直接给答案，先把问题立起来；后面整份 deck 都是这个问题的拆解',
  },
  question: {
    content:
      'What does a presentation tool look like\nif the operator is a language model?',
    summary: '本页的核心提问',
    rationale:
      '把"agent 来做 PPT"重新表述成工具学问题，而不是 feature 罗列；用大号衬线斜体强调这是个值得停留的提问',
  },
  obs1Label: {
    content: '01',
    summary: '观察项 1 的编号',
    rationale: '小号 mono 数字做编号，与大号衬线数字形成对比',
  },
  obs1: {
    content: 'Binary files. No diff, no grep, no review.',
    summary: '传统工具问题 1：格式不可读',
    rationale: 'pptx 是 zip + xml，agent 编辑代价高、版本控制看不出意图',
  },
  obs2Label: {
    content: '02',
    summary: '观察项 2 的编号',
    rationale: '同上',
  },
  obs2: {
    content: 'WYSIWYG canvas. The operator cannot see what they made.',
    summary: '传统工具问题 2：视觉反馈不可靠',
    rationale:
      'LLM 看截图判断布局会自我欺骗；以 WYSIWYG 为中心的工具天然把视觉反馈作为唯一回路',
  },
  obs3Label: {
    content: '03',
    summary: '观察项 3 的编号',
    rationale: '同上',
  },
  obs3: {
    content: 'Text trapped in shapes. No semantics, no intent.',
    summary: '传统工具问题 3：缺乏语义结构',
    rationale:
      '"这是标题"还是"这是大字"在 pptx 里是同一种东西；agent 无从知道作者意图，也就无从合理修改',
  },
  closer: {
    content: 'Auto-PPT inverts all three.',
    summary: '过渡句，指向后面的答案',
    rationale: '收束本页，把观众的注意力引向后面"答案是什么"',
  },
} satisfies Record<string, Annotated>;

function Observation({ n, body }: { n: string; body: string }) {
  return (
    <div className="flex gap-8">
      <span className="font-mono text-accent text-[28px] leading-[1.4] pt-3 w-[60px]">
        {n}
      </span>
      <p className="font-display text-ink text-[40px] leading-[1.35] flex-1">
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

      <p className="font-display italic text-ink text-[68px] leading-[1.15] mt-20 whitespace-pre-line">
        {text.question.content}
      </p>

      <div className="mt-20 flex flex-col gap-8 max-w-[1500px]">
        <Observation n={text.obs1Label.content} body={text.obs1.content} />
        <Observation n={text.obs2Label.content} body={text.obs2.content} />
        <Observation n={text.obs3Label.content} body={text.obs3.content} />
      </div>

      <p className="mt-auto font-mono text-mute text-[28px]">
        {text.closer.content}
      </p>
    </SlideFrame>
  );
}
