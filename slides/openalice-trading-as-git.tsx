import type { Annotated } from '@/lib/ppt';
import { SlideFrame } from '@/lib/slide-kit';

export const text = {
  number: {
    content: '06',
    summary: '页码角标',
    rationale: '可信任性设计——支撑前两个卖点能放心使用，编号 06',
  },
  title: {
    content: 'Trading-as-Git',
    summary: '本页主题：标志性卖点',
    rationale:
      '这是项目最有辨识度的工程设计，把"AI 自动操作真钱"的信任问题用一个开发者都熟悉的隐喻解决',
  },
  lede: {
    content: 'The AI proposes. You commit. Then it executes.',
    summary: '导语：三步工作流',
    rationale: '一句话压缩 propose/commit/push，给后面三栏做种子',
  },
  step1Label: {
    content: 'stage',
    summary: '步骤 1 关键词',
    rationale: '借用 git 命令名，让懂代码的听众秒懂',
  },
  step1Body: {
    content:
      'The AI drafts an order against your account. Nothing has left the machine yet.',
    summary: '步骤 1 解释',
    rationale: '强调 stage 阶段订单仍在本地，未触达 broker',
  },
  step2Label: {
    content: 'commit',
    summary: '步骤 2 关键词',
    rationale: '用户审核并签字',
  },
  step2Body: {
    content:
      'You review the diff with a commit message. Pre-execution guards run: max position, cooldown, symbol whitelist.',
    summary: '步骤 2 解释',
    rationale:
      '把 guard pipeline 具体到三个真实存在的规则，让审计能力变得可触摸',
  },
  step3Label: {
    content: 'push',
    summary: '步骤 3 关键词',
    rationale: '执行到 broker',
  },
  step3Body: {
    content:
      'The order goes to the broker with a commit hash. Every trade in your account has a reviewable history, forever.',
    summary: '步骤 3 解释',
    rationale: '"commit hash 永久可查"是 Trading-as-Git 最强的合规/复盘卖点',
  },
  safetyTag: {
    content: 'Local-first',
    summary: '右下角附加卖点标签',
    rationale: '把"本地优先 / 凭证隔离"作为这一页的副论点带出来',
  },
  safetyBody: {
    content:
      'Runs on your machine. Broker credentials live in an isolated UTA service — hardware-wallet-style, never reachable by the agent process.',
    summary: '本地优先 + UTA 隔离说明',
    rationale:
      '点出 UTA 服务隔离凭证这件事，呼应 README 里"私钥和真钱不该外包给云"的设计哲学',
  },
} satisfies Record<string, Annotated>;

function Step({
  index,
  label,
  body,
}: {
  index: string;
  label: string;
  body: string;
}) {
  return (
    <div className="flex flex-col gap-6">
      <p className="font-mono text-accent text-[26px]">{index}</p>
      <p className="font-mono text-ink text-[72px] leading-none">{label}</p>
      <div className="h-[2px] bg-rule" />
      <p className="font-display text-mute text-[30px] leading-[1.35]">{body}</p>
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

      <p className="font-display italic text-ink text-[56px] leading-[1.2] mt-12 max-w-[1700px]">
        {text.lede.content}
      </p>

      <div className="grid grid-cols-3 gap-16 mt-20">
        <Step
          index="$ stage"
          label={text.step1Label.content}
          body={text.step1Body.content}
        />
        <Step
          index="$ commit -m"
          label={text.step2Label.content}
          body={text.step2Body.content}
        />
        <Step
          index="$ push"
          label={text.step3Label.content}
          body={text.step3Body.content}
        />
      </div>

      <div className="mt-auto flex items-start gap-10 border-t border-rule pt-8">
        <p className="font-mono text-accent text-[26px] uppercase tracking-[0.25em] whitespace-nowrap pt-1">
          {text.safetyTag.content}
        </p>
        <p className="font-display text-ink text-[30px] leading-[1.35] max-w-[1500px]">
          {text.safetyBody.content}
        </p>
      </div>
    </SlideFrame>
  );
}
