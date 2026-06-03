import type { Annotated } from '@/lib/ppt';
import { Asset, SlideFrame } from '@/lib/slide-kit';

export const text = {
  number: {
    content: '04',
    summary: '页码角标',
    rationale: '位置编号',
  },
  title: {
    content: 'One slide, one file',
    summary: '本页主题',
    rationale: '把第三页文件树展开到具体一个文件——agent 编辑 PPT 实际是在编辑这种东西',
  },
  lede: {
    content:
      'A slide file is a tiny React module: a text export, then a component.',
    summary: '导语：解释 .tsx 结构',
    rationale: '在展示代码之前先一句话点明结构',
  },
  code: {
    content: `export const text = {
  title: {
    content: 'Auto-PPT',
    summary: '主标题：项目名',
    rationale: '封面直接打项目名，让观众第一眼...',
  },
} satisfies Record<string, Annotated>;

export default function Slide() {
  return (
    <SlideFrame>
      <Title>{text.title.content}</Title>
    </SlideFrame>
  );
}`,
    summary: '展示一段精简的真实 slide 代码',
    rationale:
      '观众应该看到真代码而不是伪代码——这段是从封面 slide 精简来的，类型签名和结构都是真的，可以直接对照仓库',
  },
  codeCaption: {
    content: 'slides/cover.tsx — abridged',
    summary: '代码块文件名标签',
    rationale: '让观众知道这段代码出自哪个文件，并标注是节选',
  },
  rightCaption: {
    content: 'The rendered output of that file',
    summary: '右侧渲染预览的说明文字',
    rationale: '配合右侧 Asset 占位说明——这里将来会放真实渲染的缩略图',
  },
  closer: {
    content:
      'No XML. No binary. Just a file you can read, diff, and grep like any other.',
    summary: '收束句',
    rationale: '把"普通文件"这件事说透：可读、可 diff、可 grep——传统 ppt 工具失败的三件事',
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

      <p className="font-display italic text-ink text-[40px] leading-[1.3] mt-10 max-w-[1500px]">
        {text.lede.content}
      </p>

      <div className="grid grid-cols-[1fr_auto] gap-20 mt-12 items-start">
        <div className="flex flex-col gap-4">
          <p className="font-mono text-mute text-[22px]">
            {text.codeCaption.content}
          </p>
          <pre className="bg-slate-50 border border-rule rounded-md p-8 font-mono text-[22px] leading-[1.5] text-ink overflow-hidden whitespace-pre">
            {text.code.content}
          </pre>
        </div>

        <div className="flex flex-col gap-4">
          <p className="font-mono text-mute text-[22px]">
            {text.rightCaption.content}
          </p>
          <Asset
            src="/assets/cover-thumbnail.png"
            width={640}
            height={360}
            description="A thumbnail-sized screenshot of the deck's cover slide rendered at 1920x1080 then scaled down. It should clearly show the eyebrow 'A TUTORIAL', the huge serif word 'Auto-PPT', and the italic thesis line 'A deck is a folder of code.' on a white background."
          />
        </div>
      </div>

      <p className="mt-auto font-display text-ink text-[34px] leading-[1.4] max-w-[1700px]">
        {text.closer.content}
      </p>
    </SlideFrame>
  );
}
