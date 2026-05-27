import type { Annotated } from '@/lib/ppt';
import { SlideFrame, Title, Bullet } from '@/lib/slide-kit';

export const text = {
  title: {
    content: 'How this works',
    summary: '解释 Harness 的核心约定',
    rationale:
      '让 AI 在 pnpm ppt text 时直接看到约定被写成 slide 内容，强化 "slide 就是 self-documentation" 的体感',
  },
  point1: {
    content: 'One slide = one .tsx file in /slides',
    summary: '约定 1：文件结构',
    rationale: '最基础的约定，必须先讲',
  },
  point2: {
    content:
      'Each file exports `text` (content + summary + rationale) and a default React component',
    summary: '约定 2：模块契约',
    rationale: '解释为什么 slide 文件长这样，AI 看完应该能照着写',
  },
  point3: {
    content:
      'Order and visibility live in slides.config.ts — comment a line to hide a page',
    summary: '约定 3：deck 控制',
    rationale: '让用户知道隐藏不是删文件而是改 config，文件本体保留作备份',
  },
  point4: {
    content: 'Run `pnpm ppt text` to read the current deck as plain text',
    summary: '约定 4：headless 入口',
    rationale: '告诉 AI 主要通过这个命令读状态，不要去解析浏览器渲染结果',
  },
} satisfies Record<string, Annotated>;

export default function Slide() {
  return (
    <SlideFrame className="flex flex-col gap-16 p-32">
      <Title>{text.title.content}</Title>
      <ul className="flex flex-col gap-8 pl-8">
        <Bullet>{text.point1.content}</Bullet>
        <Bullet>{text.point2.content}</Bullet>
        <Bullet>{text.point3.content}</Bullet>
        <Bullet>{text.point4.content}</Bullet>
      </ul>
    </SlideFrame>
  );
}
