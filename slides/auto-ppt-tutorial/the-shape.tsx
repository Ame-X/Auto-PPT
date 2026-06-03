import type { Annotated } from '@/lib/ppt';
import { SlideFrame } from '@/lib/slide-kit';

export const text = {
  number: {
    content: '03',
    summary: '页码角标',
    rationale: '位置编号',
  },
  title: {
    content: 'The shape',
    summary: '本页主题：项目长什么样',
    rationale: '在讲约定之前，先让观众看到仓库结构——眼见为实',
  },
  lede: {
    content: 'A deck is just files. Reading the tree, you already know how it works.',
    summary: '导语：强调结构即文档',
    rationale: '把"文件结构本身就是文档"这件事说出来，引出右侧的文件树展示',
  },
  treeRoot: {
    content: 'auto-ppt/',
    summary: '文件树根目录',
    rationale: '展示项目最外层结构',
  },
  treeSlidesDir: {
    content: 'slides/',
    summary: '文件树：slides 目录',
    rationale: '所有 slide .tsx 文件的家',
  },
  treeSlide1: {
    content: 'cover.tsx',
    summary: '文件树：示例 slide 1',
    rationale: '具体到一个文件名，让观众理解"一页一文件"的字面含义',
  },
  treeSlide2: {
    content: 'the-question.tsx',
    summary: '文件树：示例 slide 2',
    rationale: '继续示意，slug 即 kebab-case 文件名',
  },
  treeSlide3: {
    content: '...',
    summary: '文件树：省略号',
    rationale: '示意还有更多 slide，避免列全显得拥挤',
  },
  treeConfig: {
    content: 'slides.config.ts',
    summary: '文件树：deck 配置',
    rationale: '把顺序和显隐从文件名里解耦出来',
  },
  treeSkill: {
    content: 'SKILL.md',
    summary: '文件树：给 agent 的说明书',
    rationale: '强调 agent 也是一等公民——它的入口是 SKILL.md，跟人的入口是 README 平行',
  },
  annoSlides: {
    content: 'One file per page. Semantic kebab-case names, no numbers.',
    summary: 'slides/ 目录的注解',
    rationale: '解释为什么不用 page1.tsx 这种命名',
  },
  annoConfig: {
    content: 'Deck order and visibility. Comment a line to hide a page.',
    summary: 'slides.config.ts 的注解',
    rationale: '强调顺序与文件名分离、隐藏不是删除',
  },
  annoSkill: {
    content: 'The instructions an AI agent reads before touching anything.',
    summary: 'SKILL.md 的注解',
    rationale: '让观众意识到 agent 视角的存在',
  },
} satisfies Record<string, Annotated>;

function TreeRow({
  indent,
  label,
  faded = false,
  highlight = false,
}: {
  indent: number;
  label: string;
  faded?: boolean;
  highlight?: boolean;
}) {
  return (
    <div
      className={`font-mono text-[34px] leading-[1.7] ${
        highlight ? 'text-accent' : faded ? 'text-mute' : 'text-ink'
      }`}
      style={{ paddingLeft: indent * 32 }}
    >
      {label}
    </div>
  );
}

function Annotation({ label, body }: { label: string; body: string }) {
  return (
    <div className="flex gap-6">
      <span className="font-mono text-accent text-[24px] pt-2 whitespace-nowrap">
        {label}
      </span>
      <p className="font-display text-ink text-[30px] leading-[1.35]">{body}</p>
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

      <p className="font-display italic text-ink text-[44px] leading-[1.3] mt-12 max-w-[1500px]">
        {text.lede.content}
      </p>

      <div className="grid grid-cols-[auto_1fr] gap-20 mt-16 items-start">
        <div className="bg-slate-50 border border-rule rounded-md p-10 min-w-[640px]">
          <TreeRow indent={0} label={text.treeRoot.content} />
          <TreeRow indent={1} label={`├── ${text.treeSlidesDir.content}`} highlight />
          <TreeRow indent={2} label={`│   ├── ${text.treeSlide1.content}`} />
          <TreeRow indent={2} label={`│   ├── ${text.treeSlide2.content}`} />
          <TreeRow indent={2} label={`│   └── ${text.treeSlide3.content}`} faded />
          <TreeRow indent={1} label={`├── ${text.treeConfig.content}`} highlight />
          <TreeRow indent={1} label={`└── ${text.treeSkill.content}`} highlight />
        </div>

        <div className="flex flex-col gap-10 pt-4">
          <Annotation
            label={text.treeSlidesDir.content}
            body={text.annoSlides.content}
          />
          <Annotation
            label={text.treeConfig.content}
            body={text.annoConfig.content}
          />
          <Annotation
            label={text.treeSkill.content}
            body={text.annoSkill.content}
          />
        </div>
      </div>
    </SlideFrame>
  );
}
