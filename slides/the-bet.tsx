import type { Annotated } from '@/lib/ppt';
import { SlideFrame } from '@/lib/slide-kit';

export const text = {
  number: {
    content: '09',
    summary: '页码角标',
    rationale: '位置编号',
  },
  eyebrow: {
    content: 'The bet',
    summary: '尾页眉标',
    rationale: '不再用大号 title + 数字的常规结构，最后一页应该有不一样的节奏；眉标小字承接结构',
  },
  thesis: {
    content: 'Tools should look like\nwhat an agent can use.',
    summary: '收尾论点',
    rationale:
      '把整份 deck 的论点用一句陈述凝练；分两行打断节奏；用大号衬线字承担情绪重量',
  },
  body: {
    content:
      'A PPT does not have to be a binary file you click through. It can be code you read, diff, and hand off. Auto-PPT is one shape of that bet — small, specific, self-hosted in its own format. The rest is up to whoever picks it up.',
    summary: '尾页正文，承上启下',
    rationale:
      '把论点延展开：不是"我们做了个工具"，而是"工具该长成什么样"；最后一句把决定权交还给观众，避免说教',
  },
  signoff: {
    content: 'github.com/yourorg/auto-ppt',
    summary: '尾页 URL 占位',
    rationale:
      '尾页通常该给一个去处；URL 写成占位形式，使用时改成真实地址。TODO: ask user — 仓库最终的公开 URL 是什么',
  },
  selfNote: {
    content: 'This deck was made with Auto-PPT.',
    summary: '自指署名',
    rationale: '与封面呼应，给整份 deck 闭环——你刚看的就是它能做的事',
  },
} satisfies Record<string, Annotated>;

export default function Slide() {
  return (
    <SlideFrame className="relative flex flex-col justify-center px-40">
      <p className="text-[28px] text-accent tracking-[0.3em] uppercase font-mono mb-12">
        {text.number.content} · {text.eyebrow.content}
      </p>

      <h1 className="font-display text-ink text-[140px] leading-[1.05] tracking-tight whitespace-pre-line">
        {text.thesis.content}
      </h1>

      <p className="mt-16 font-display text-ink text-[40px] leading-[1.4] max-w-[1500px]">
        {text.body.content}
      </p>

      <div className="absolute bottom-20 left-40 right-40 flex justify-between items-baseline">
        <p className="font-mono text-[24px] text-mute">
          {text.signoff.content}
        </p>
        <p className="font-mono text-[24px] text-mute italic">
          {text.selfNote.content}
        </p>
      </div>
    </SlideFrame>
  );
}
