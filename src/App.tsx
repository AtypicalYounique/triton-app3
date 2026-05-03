import { useMemo, useState } from "react";
import "./styles.css";
import { BRAND } from "./brand";

// Question schema: { id, topic, level, q, options[], answer (idx), explain }
// Topics: triton-rpc, yellowstone, apis, pricing-model, rpc-2-0, ops
// Length parity 0.90–1.10 STRICT across options.

const BANK = [
  // ── BEGINNER (12) ──
  { id:"b1", topic:"triton-rpc", level:"beginner",
    q:"What is Triton One primarily known for in the Solana ecosystem?",
    options:[
      "Bare-metal RPC infrastructure for Solana, Sui, Monad and Pythnet",
      "A self-custody mobile wallet aimed at retail Solana traders",
      "An NFT marketplace built on top of the Metaplex Token Standard",
      "A decentralized launchpad for new Solana token offerings",
    ],
    answer:0,
    explain:"Triton One operates one of the longest-running RPC fleets on Solana, plus Sui, Monad, and Pythnet, on bare metal nodes co-located near validators." },
  { id:"b2", topic:"yellowstone", level:"beginner",
    q:"What is Yellowstone Dragon's Mouth?",
    options:[
      "A gRPC streaming interface for Solana, built on the Geyser plugin",
      "A new Solana validator client written in Go for low-latency consensus",
      "A wallet-as-a-service product launched by the Solana Foundation",
      "A retail product that streams NFT mints to discord channels live",
    ],
    answer:0,
    explain:"Dragon's Mouth (rpcpool/yellowstone-grpc) is Triton's open-source gRPC interface for Solana, built around the Geyser plugin model and used by trading and indexing teams." },
  { id:"b3", topic:"apis", level:"beginner",
    q:"What does the Photon API on Triton One specialize in?",
    options:[
      "An indexed RPC API for compressed NFTs and Light Protocol state",
      "Real-time push notifications for any Solana wallet address holders",
      "Generating new Solana keypairs and managing custodial signatures",
      "Streaming Twitter mentions of a token into a Solana program log",
    ],
    answer:0,
    explain:"Photon is Triton's indexed RPC API for compressed NFTs and Light Protocol state, replacing dozens of raw RPC calls per cNFT lookup." },
  { id:"b4", topic:"pricing-model", level:"beginner",
    q:"What is the headline difference between Triton's pricing and CU-based providers?",
    options:[
      "Triton charges by bandwidth and per-million calls, not Compute Units",
      "Triton refunds unused capacity at the end of every billing month",
      "Triton bundles every API into a single fixed-fee subscription tier",
      "Triton charges only when validator vote messages exceed a threshold",
    ],
    answer:0,
    explain:"Triton's pricing model is bandwidth-based at $0.08 per GB plus per-million tiers by API, with no Compute Units, rigid tiers, or overage tables." },
  { id:"b5", topic:"rpc-2-0", level:"beginner",
    q:"What is RPC 2.0 in the Triton One context?",
    options:[
      "A read-layer rebuild for Solana, in partnership with the Solana Foundation",
      "A migration from the Solana Web3.js v1 SDK to the v2 client tooling",
      "A second iteration of the original JSON-RPC HTTP transport for Web2",
      "A staking program that rewards validators for serving extra read load",
    ],
    answer:0,
    explain:"Triton announced RPC 2.0 as a partnership with the Solana Foundation to rebuild Solana's read layer for faster, cheaper, more expressive data access." },
  { id:"b6", topic:"ops", level:"beginner",
    q:"Why does Triton emphasize validator proximity in its node deployments?",
    options:[
      "Latency between RPC and validator clusters drives Solana app responsiveness",
      "Validators give Triton free hardware in return for nearby data centres",
      "It lets Triton skip running its own non-vote consensus implementation",
      "Solana protocol penalizes RPC nodes that are far from any validator",
    ],
    answer:0,
    explain:"Solana performance depends on the client-to-RPC and RPC-to-validator hops. Triton runs in 20+ data centres in 15+ cities near major validator clusters." },
  { id:"b7", topic:"triton-rpc", level:"beginner",
    q:"Which non-Solana chains does Triton One serve as RPC infrastructure?",
    options:[
      "Sui, Monad and Pythnet alongside Solana mainnet RPC services",
      "Ethereum mainnet, Arbitrum, Optimism and the Base L2 for OP Stack",
      "Bitcoin mainnet, Litecoin and Stacks for ordinal-based applications",
      "Cosmos Hub, Osmosis and Celestia for IBC-routed chain interoperability",
    ],
    answer:0,
    explain:"Triton's chain footprint is Solana, Sui, Monad, and Pythnet, the company is Solana-centric and has expanded into adjacent high-performance L1s." },
  { id:"b8", topic:"apis", level:"beginner",
    q:"What does the Metis API on Triton One do?",
    options:[
      "Provides Jupiter-style DEX routing and swap aggregation for Solana",
      "Indexes every domain name registered on Solana name service systems",
      "Submits sandwich-resistant transaction bundles to Solana validators",
      "Aggregates fiat on-ramp quotes across providers for retail wallets",
    ],
    answer:0,
    explain:"Metis is Triton's DEX routing and swap aggregation API, comparable to Jupiter, priced at $0.08/GB plus $80 per million calls." },
  { id:"b9", topic:"yellowstone", level:"beginner",
    q:"What is the Geyser plugin model in the Solana validator architecture?",
    options:[
      "A way for the validator to stream account, slot and transaction data out",
      "A consensus extension that lets validators vote on extra data availability",
      "A method for forwarding submitted transactions to other validator nodes",
      "A monitoring sidecar that exports Prometheus metrics from a validator",
    ],
    answer:0,
    explain:"Geyser is Solana's plugin model for streaming account, slot, and transaction data out of the validator process, and it's the foundation Yellowstone Dragon's Mouth is built on." },
  { id:"b10", topic:"pricing-model", level:"beginner",
    q:"What deposit does Triton's Simple PAYG plan require to get started?",
    options:[
      "A $125 USD prepaid deposit, valid for 12 months from purchase date",
      "A $1,000 monthly recurring subscription fee billed via standard ACH",
      "A staked SOL position locked in a Triton-controlled custody address",
      "A 30-day free trial with credit card on file but no upfront deposit",
    ],
    answer:0,
    explain:"Simple PAYG requires a $125 prepaid deposit, valid 12 months. Overage is billed at the same base rate as the prepaid usage." },
  { id:"b11", topic:"ops", level:"beginner",
    q:"Which Triton feature handles routing requests to the closest healthy node?",
    options:[
      "GeoDNS routing with automatic failover across global data centres",
      "A custom Anycast IP network advertised from each individual node",
      "Client-side load balancing using a Triton-published validator list",
      "Round-robin DNS that shuffles every minute across regional pools",
    ],
    answer:0,
    explain:"Triton uses GeoDNS routing with automatic failover, included in Simple PAYG, across its 20+ bare-metal data centres." },
  { id:"b12", topic:"rpc-2-0", level:"beginner",
    q:"What problem does the RPC 2.0 effort aim to address on Solana today?",
    options:[
      "Solana's read layer is hard to query expressively at large data scale",
      "Solana validators reject RPC traffic that exceeds protocol cost limits",
      "Solana wallet apps cannot read on-chain data without paying SOL fees",
      "Solana's Rust clients have been deprecated in favour of TypeScript code",
    ],
    answer:0,
    explain:"RPC 2.0's stated goal is faster, cheaper, more expressive data access for every app on Solana, a rethink of how the read layer is architected." },

  // ── INTERMEDIATE (12) ──
  { id:"i1", topic:"yellowstone", level:"intermediate",
    q:"Which of these is the canonical Yellowstone Dragon's Mouth GitHub repository name?",
    options:[
      "rpcpool/yellowstone-grpc on Github, maintained by the Triton One team",
      "anza-xyz/yellowstone-stream on Github, the canonical Anza-led mirror",
      "solana-labs/yellowstone-rpc on Github, maintained by Solana Labs",
      "jito-foundation/dragons-mouth on Github, a Jito Labs distribution fork",
    ],
    answer:0,
    explain:"The canonical Dragon's Mouth repo is rpcpool/yellowstone-grpc, maintained by Triton One (rpcpool was Triton's original GitHub org)." },
  { id:"i2", topic:"apis", level:"intermediate",
    q:"How does Triton price the Metis API per million calls?",
    options:[
      "$0.08 per GB bandwidth plus $80 per million Metis calls flat rate",
      "$0.40 per million Compute Units, weighted by Metis method gas cost",
      "$50 flat per Metis user per month with unlimited routing requests",
      "Free with any Simple PAYG plan, with no per-call charge applied",
    ],
    answer:0,
    explain:"Metis is priced at $0.08 / GB bandwidth plus $80 per million calls, the highest per-million tier among Triton's published APIs." },
  { id:"i3", topic:"triton-rpc", level:"intermediate",
    q:"How many data centres and cities does Triton's footprint cover today?",
    options:[
      "Over 20 top-tier data centres across more than 15 different cities",
      "Three primary regions in North America, Europe, and East Asia only",
      "A single hyperscale point of presence in Northern Virginia, USA",
      "Around 5 community-run colocations donated by Solana validators",
    ],
    answer:0,
    explain:"Triton's published footprint is 20+ top-tier data centres across 15+ cities, deliberately placed near validator clusters." },
  { id:"i4", topic:"pricing-model", level:"intermediate",
    q:"What does Triton charge for Standard RPC, indexed accounts and ledger queries?",
    options:[
      "$0.08 per GB bandwidth plus $10 per million calls flat across these",
      "$0.40 per million Compute Units, weighted by the underlying RPC method",
      "$5 per gigabyte of egress with no separate per-million-call charge",
      "$50 per million calls, identical to the Metaplex and Photon pricing",
    ],
    answer:0,
    explain:"Standard RPC, indexed accounts, and ledger queries: $0.08 per GB plus $10 per million calls, the lowest published per-million tier." },
  { id:"i5", topic:"yellowstone", level:"intermediate",
    q:"On Triton, what does running a custom Geyser plugin typically require?",
    options:[
      "A dedicated node, since Geyser plugins compile into the validator process",
      "A Simple PAYG account, since Geyser is enabled by default for everyone",
      "A staked validator identity, since Geyser sees the consensus stream",
      "An Anza service contract, since plugins must be Anza-approved code",
    ],
    answer:0,
    explain:"Geyser plugins compile into the validator process, so custom plugins require a dedicated node, Triton offers this under Custom PAYG / Dedicated Nodes." },
  { id:"i6", topic:"ops", level:"intermediate",
    q:"Which transports are included in Triton's Simple PAYG for streaming workloads?",
    options:[
      "gRPC streaming and WebSockets, plus full access to Yellowstone tools",
      "WebSockets only, with gRPC reserved for the Custom PAYG enterprise tier",
      "QUIC streaming only, with no WebSocket compatibility for any client app",
      "MQTT streaming only, used by Triton's IoT-style data subscription system",
    ],
    answer:0,
    explain:"Simple PAYG includes gRPC and WebSockets streaming plus full access to the Yellowstone suite of tools." },
  { id:"i7", topic:"rpc-2-0", level:"intermediate",
    q:"Which entity is Triton partnering with to deliver RPC 2.0?",
    options:[
      "The Solana Foundation, to rebuild Solana's read layer from the ground up",
      "The Anza engineering team, on a fork of the Solana validator client itself",
      "The Helius Labs team, on a shared Helius-Triton bundled co-marketing brand",
      "The Jito Labs team, on a tip-routing protocol for read-side traffic data",
    ],
    answer:0,
    explain:"Triton announced RPC 2.0 as a partnership with the Solana Foundation, rethinking Solana's read layer from the ground up." },
  { id:"i8", topic:"apis", level:"intermediate",
    q:"What is the Titan Prime API positioned as inside Triton's product surface?",
    options:[
      "A premium streaming API included in Simple PAYG with bandwidth pricing",
      "A staking yield product for SOL holders looking for delegated returns",
      "A standalone NFT minting service competing with the Metaplex Candy stack",
      "A free public RPC tier with no deposit and no per-million charge applied",
    ],
    answer:0,
    explain:"Titan Prime is a premium streaming API on Triton, included in Simple PAYG and priced through bandwidth ($0.08/GB)." },
  { id:"i9", topic:"triton-rpc", level:"intermediate",
    q:"Roughly when was Triton One founded and active in the Solana ecosystem?",
    options:[
      "Around 2021, making it one of Solana's longest-running RPC providers",
      "Around 2024, launched as a spinout from the Anza engineering organization",
      "Around 2018, predating the Solana mainnet beta launch by three full years",
      "Around 2023, founded by a former Helius engineering team senior member",
    ],
    answer:0,
    explain:"Triton has been powering the Solana ecosystem since 2021, making it one of the earliest dedicated RPC providers on the network." },
  { id:"i10", topic:"pricing-model", level:"intermediate",
    q:"How is overage billed once a Simple PAYG account passes its prepaid amount?",
    options:[
      "At the same base rate as the prepaid usage, with no surge multiplier",
      "At a 4x penalty rate applied uniformly across every published API tier",
      "At a per-validator rate that depends on which node served each request",
      "Cut off automatically with a hard rate-limit applied at the GeoDNS layer",
    ],
    answer:0,
    explain:"Triton bills overage at the same base rate as prepaid usage, no surge multiplier, no hidden overage table." },
  { id:"i11", topic:"ops", level:"intermediate",
    q:"What kind of customer support comes with the Simple PAYG plan?",
    options:[
      "One-on-one support directly from senior Triton engineering team members",
      "Community-only Discord with a 72-hour first-response time on tickets",
      "Self-serve email forms with no guaranteed first-response SLA at all",
      "Phone-only paid support priced separately at $200 per hour billed live",
    ],
    answer:0,
    explain:"Triton lists 1-1 support from senior engineers as included in Simple PAYG, a key differentiator vs commodity RPC providers." },
  { id:"i12", topic:"yellowstone", level:"intermediate",
    q:"Which of these data types is Yellowstone Dragon's Mouth designed to stream?",
    options:[
      "Account writes, slot updates and transaction events from the validator",
      "Bandwidth metering events sent from the customer's billing dashboard",
      "Solana program source code edits committed to a git repository directly",
      "Validator vote signatures, sent through a separate consensus channel",
    ],
    answer:0,
    explain:"Dragon's Mouth streams account writes, slot updates, and transaction events out of the validator, the core Geyser data shape, over gRPC." },

  // ── EXPERT (12) ──
  { id:"e1", topic:"yellowstone", level:"expert",
    q:"How does Yellowstone Dragon's Mouth typically interact with the Geyser plugin?",
    options:[
      "It runs as a Geyser plugin that exposes the validator stream over gRPC",
      "It replaces the validator entirely, removing the Geyser plugin slot used",
      "It sits in front of the RPC HTTP server, scraping and re-emitting events",
      "It runs as a separate validator and forwards its own slot range only",
    ],
    answer:0,
    explain:"Dragon's Mouth is implemented as a Geyser plugin (rpcpool/yellowstone-grpc), the validator's Geyser slot loads it, and it exposes the stream over gRPC." },
  { id:"e2", topic:"pricing-model", level:"expert",
    q:"Why might a 1B-call team end up cheaper on Triton than on a CU-based provider?",
    options:[
      "Because $10 per million dominates over CU weights when payloads are small",
      "Because Triton refunds half of monthly bandwidth as Solana token rebates",
      "Because the $125 deposit caps the entire monthly bill at that one number",
      "Because Triton offers a flat-fee enterprise SKU with unlimited everything",
    ],
    answer:0,
    explain:"On small-payload, high-call workloads, $0.08/GB plus $10/M dominates over CU-weighted billing where eth-style methods can cost 26-309 CUs each at $0.40/M CUs." },
  { id:"e3", topic:"apis", level:"expert",
    q:"Which of these correctly differentiates Triton's Photon API from Metaplex API?",
    options:[
      "Photon targets compressed NFTs and Light Protocol state specifically",
      "Photon is for Sui NFTs, while Metaplex covers only the Solana cNFT path",
      "Photon is a free tier of the same product, with rate-limited responses",
      "Photon and Metaplex are identical APIs sold under two separate brands",
    ],
    answer:0,
    explain:"Photon is specifically for compressed NFTs and Light Protocol state. Metaplex API covers the Metaplex Token Standard surface for full-account NFTs." },
  { id:"e4", topic:"triton-rpc", level:"expert",
    q:"Why does Triton run on bare metal instead of typical hyperscale cloud VMs?",
    options:[
      "Bare metal removes hypervisor overhead and noisy-neighbor latency tail",
      "Bare metal is the only place legally allowed to operate Solana validators",
      "Bare metal lets Triton avoid US data-export rules on every cloud region",
      "Bare metal is mandated by Solana protocol for all RPC nodes that operate",
    ],
    answer:0,
    explain:"Bare metal eliminates hypervisor jitter and noisy-neighbor effects from shared cloud hardware, a real differentiator for Solana's slot-time-sensitive RPC reads." },
  { id:"e5", topic:"rpc-2-0", level:"expert",
    q:"What is one likely architectural shift the RPC 2.0 effort is exploring?",
    options:[
      "Decoupling the read index from the validator process for richer queries",
      "Replacing JSON-RPC entirely with a fully on-chain query language program",
      "Moving every read query to be paid for in SOL gas at the protocol layer",
      "Forcing every dApp to run its own validator before issuing any RPC call",
    ],
    answer:0,
    explain:"Triton's framing of RPC 2.0 emphasizes more expressive data access, likely involves decoupling read indexing from the validator process to support richer queries." },
  { id:"e6", topic:"yellowstone", level:"expert",
    q:"What is a common reason teams choose Dragon's Mouth gRPC over WebSockets?",
    options:[
      "Stronger backpressure handling and stable long-lived streams under load",
      "WebSockets cannot deliver any binary payloads on the Solana RPC stack",
      "Dragon's Mouth costs less per gigabyte than the WebSocket transport tier",
      "Dragon's Mouth is the only way to subscribe to the Solana slot updates",
    ],
    answer:0,
    explain:"gRPC offers stronger backpressure semantics and more stable long-lived streams than typical Solana WebSocket implementations, material for trading and indexing." },
  { id:"e7", topic:"ops", level:"expert",
    q:"Why is global distribution alone insufficient without validator proximity?",
    options:[
      "Because RPC-to-validator latency dominates after the client-RPC hop ends",
      "Because GeoDNS records cannot resolve across more than three regions",
      "Because validators reject RPC nodes located outside their home country",
      "Because Solana protocol enforces a 50ms ceiling on the client-RPC hop",
    ],
    answer:0,
    explain:"Solana RPC reads depend on two paths: client-to-RPC and RPC-to-validator. A globally distributed RPC fleet still loses if it sits far from the validator clusters." },
  { id:"e8", topic:"apis", level:"expert",
    q:"What's a key reason a swap-routing app would pay $80 per million for Metis?",
    options:[
      "Metis returns optimized routes that beat hand-rolled aggregation cost",
      "Metis subsidizes the actual on-chain swap fees back to the dApp wallet",
      "Metis lets the dApp avoid running any signing or relayer infrastructure",
      "Metis is the only API legally allowed to quote prices on Solana DEXs",
    ],
    answer:0,
    explain:"Metis provides Jupiter-grade routing, for a swap-heavy dApp, paying $80/M beats the engineering cost of hosting and maintaining a competitive aggregator in-house." },
  { id:"e9", topic:"pricing-model", level:"expert",
    q:"Which workload shape favours Custom PAYG over Simple PAYG on Triton?",
    options:[
      "Sustained high bandwidth and predictable per-million volume each month",
      "Spiky weekend-only traffic that hits peak only a few hours per month",
      "Ultra-low-volume hobby projects with under 1M calls a month total only",
      "Read-only single-chain workloads with no streaming or routing usage",
    ],
    answer:0,
    explain:"Custom PAYG is positioned for teams with sustained, predictable high-volume bandwidth and per-million workloads, Triton can offer tighter unit economics in exchange." },
  { id:"e10", topic:"ops", level:"expert",
    q:"What's the trade-off of dedicated Geyser plugins on a Triton Dedicated Node?",
    options:[
      "You isolate latency and capacity at the cost of higher fixed monthly spend",
      "You give up multi-region failover, since plugins run in one location only",
      "You lose access to the standard JSON-RPC HTTP endpoint on that same node",
      "You must run the plugin code under Anza's centralized hosting environment",
    ],
    answer:0,
    explain:"Dedicated Geyser plugins on a Dedicated Node give you isolation and predictable performance, but at the cost of a higher fixed monthly bill vs shared PAYG." },
  { id:"e11", topic:"triton-rpc", level:"expert",
    q:"Which of these is a real Triton differentiator vs CU-based providers?",
    options:[
      "Bandwidth-based pricing with no overage tables and validator-proximate nodes",
      "An exclusive Solana validator slot reserved on every mainnet epoch boundary",
      "A Solana protocol-level discount that reduces base SOL fees on every send",
      "An on-chain governance token that votes on Solana protocol upgrade choices",
    ],
    answer:0,
    explain:"Triton's real differentiators are bandwidth-based pricing (no overage tables), 1-1 senior support, and validator-proximate bare-metal infrastructure." },
  { id:"e12", topic:"rpc-2-0", level:"expert",
    q:"What's a plausible reason the Solana Foundation is co-leading RPC 2.0 with Triton?",
    options:[
      "Read-layer scalability is now the Solana ecosystem's top developer pain point",
      "The Foundation wants every Solana app to pay protocol-level read fees soon",
      "The Foundation is acquiring Triton One and consolidating all RPC stacks",
      "The Foundation needs Triton to produce the validator binary distribution",
    ],
    answer:0,
    explain:"Solana's biggest scaling friction has shifted toward the read layer (indexing, expressive queries, cost), making it a strategic Foundation investment area." },
];

const TOPIC_LABEL: Record<string, string> = {
  "triton-rpc": "Triton One RPC architecture",
  yellowstone: "Yellowstone gRPC and Geyser",
  apis: "Metaplex, Photon and Metis APIs",
  "pricing-model": "Bandwidth-based pricing",
  "rpc-2-0": "RPC 2.0 and Solana Foundation",
  ops: "Ops, support and infrastructure",
};

function shuffle<T>(a: T[]): T[] { const x = [...a]; for (let i = x.length-1; i>0; i--) { const j = Math.floor(Math.random()*(i+1)); [x[i],x[j]]=[x[j],x[i]]; } return x; }
function sample<T>(a: T[], n: number): T[] { return shuffle(a).slice(0, n); }

function shuffleQuestions(questions: any[]) {
  const positionCounts = [0, 0, 0, 0];
  const recentPositions: number[] = [];
  return questions.map((q) => {
    const correctText = q.options[q.answer];
    const wrongTexts = q.options
      .filter((_: any, i: number) => i !== q.answer)
      .sort(() => Math.random() - 0.5);
    const blocked = recentPositions.slice(-2);
    const candidates = [0, 1, 2, 3]
      .filter((p) => !blocked.includes(p))
      .sort((a, b) => positionCounts[a] - positionCounts[b] || Math.random() - 0.5);
    const targetPos = candidates.length > 0
      ? candidates[0]
      : [0, 1, 2, 3].sort((a, b) => positionCounts[a] - positionCounts[b] || Math.random() - 0.5)[0];
    positionCounts[targetPos]++;
    recentPositions.push(targetPos);
    const newOptions = [...wrongTexts];
    newOptions.splice(targetPos, 0, correctText);
    return { ...q, options: newOptions, answer: targetPos };
  });
}

function pickQuestions(level: string, n: number) {
  if (level === "mixed") {
    const b = BANK.filter(q => q.level === "beginner");
    const i = BANK.filter(q => q.level === "intermediate");
    const e = BANK.filter(q => q.level === "expert");
    const each = Math.ceil(n / 3);
    return shuffleQuestions(shuffle([...sample(b, each), ...sample(i, each), ...sample(e, n - 2*each)]).slice(0, n));
  }
  const pool = BANK.filter(q => q.level === level);
  return shuffleQuestions(sample(pool, Math.min(n, pool.length)));
}

function App() {
  const [length, setLength] = useState<number>(10);
  const [level, setLevel] = useState<string>("beginner");
  const [stage, setStage] = useState<"setup"|"run"|"done">("setup");
  const [qs, setQs] = useState<any[]>([]);
  const [idx, setIdx] = useState(0);
  const [picks, setPicks] = useState<Record<string, number>>({});
  const [revealed, setRevealed] = useState<Record<string, number>>({});
  const [toast, setToast] = useState(false);

  const start = () => {
    const lvl = length === 30 ? (level === "expert" ? "expert" : "mixed") : level;
    const set = pickQuestions(lvl, length);
    setQs(set); setIdx(0); setPicks({}); setRevealed({}); setStage("run");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const choose = (qid: string, ci: number) => {
    if (revealed[qid] !== undefined) return;
    setPicks(p => ({ ...p, [qid]: ci }));
    setRevealed(r => ({ ...r, [qid]: ci }));
  };
  const next = () => {
    if (idx + 1 < qs.length) setIdx(idx + 1); else setStage("done");
  };

  const correctCount = useMemo(() => qs.reduce((acc,q)=> acc + (picks[q.id] === q.answer ? 1 : 0), 0), [qs, picks]);

  const topicBreakdown = useMemo(() => {
    const m: Record<string, { correct: number; total: number }> = {};
    for (const q of qs) {
      const t = q.topic;
      if (!m[t]) m[t] = { correct: 0, total: 0 };
      m[t].total++;
      if (picks[q.id] === q.answer) m[t].correct++;
    }
    return m;
  }, [qs, picks]);

  const summary = useMemo(() => {
    const lines: string[] = [];
    lines.push("Triton One Platform & Solana Infra Quiz");
    lines.push(`Length: ${qs.length}, Level: ${length === 30 && level !== "expert" ? "mixed" : level}`);
    lines.push(`Score: ${correctCount} / ${qs.length}`);
    lines.push("");
    lines.push("Topic breakdown:");
    Object.entries(topicBreakdown).forEach(([t, v]) => {
      lines.push(`  • ${TOPIC_LABEL[t] || t}: ${v.correct}/${v.total}`);
    });
    return lines.join("\n");
  }, [qs.length, correctCount, topicBreakdown, level, length]);

  const onCopy = async () => {
    try { await navigator.clipboard.writeText(summary); setToast(true); setTimeout(()=>setToast(false), 1600); }
    catch { const ta=document.createElement("textarea"); ta.value=summary; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); document.body.removeChild(ta); setToast(true); setTimeout(()=>setToast(false),1600); }
  };

  const restart = () => { setStage("setup"); setQs([]); setIdx(0); setPicks({}); setRevealed({}); window.scrollTo({top:0, behavior:"smooth"}); };

  const Pills = ({ value, set, options }: { value: any; set: (v: any) => void; options: { value: any; label: string }[] }) => (
    <div className="pillgroup">
      {options.map(o => (
        <button key={String(o.value)} className={"pill " + (value === o.value ? "active" : "")} onClick={() => set(o.value)} type="button">{o.label}</button>
      ))}
    </div>
  );

  if (stage === "setup") {
    return (
      <div className="wrap">
        <header className="brand-bar">
          <a
            href={BRAND.homepage}
            target="_blank"
            rel="noopener noreferrer"
            className="brand-logo"
            aria-label={BRAND.company}
          >
            <span dangerouslySetInnerHTML={{ __html: BRAND.logoSvg }} />
          </a>
          <span className="brand-chip">Independent quiz</span>
        </header>
        <div className="eyebrow">A quiz · DevRel, sales enablement, partner education</div>
        <h1>Triton One Platform & Solana Infra Quiz</h1>
        <p className="lede">A short, polite test of how well you know Triton One's product surface (Standard RPC across Solana, Sui, Monad, Pythnet; Yellowstone Dragon's Mouth gRPC; Geyser plugins; Metaplex, Photon, Metis APIs; bandwidth-based pricing; RPC 2.0) and the Solana infra concepts they sit on. Drawn from Triton's public docs and pricing page.</p>

        <div className="card">
          <label>Length</label>
          <Pills value={length} set={setLength} options={[{value:10,label:"10 questions"},{value:20,label:"20 questions"},{value:30,label:"30 questions"}]} />
          <div style={{ height: 14 }} />
          <label>Difficulty</label>
          <Pills value={level} set={setLevel} options={[{value:"beginner",label:"Beginner"},{value:"intermediate",label:"Intermediate"},{value:"expert",label:"Expert"}]} />
          <div style={{ marginTop: 14 }}>
            <button className="btn" onClick={start}>Start quiz</button>
          </div>
        </div>

        <div className="footer-note">
          Triton-specific detail comes directly from Triton's public documentation, blog, and pricing page (Standard RPC, Yellowstone Dragon's Mouth gRPC, Geyser, Metaplex, Photon, Metis, Titan Prime, RPC 2.0, bandwidth-based pricing, $125 prepaid deposit). Broader questions cover Solana RPC, Geyser plugins, and DEX routing concepts. No data is collected.
        </div>
        <footer className="attribution">{BRAND.attribution}</footer>
      </div>
    );
  }

  if (stage === "run") {
    const q = qs[idx];
    const chosen = picks[q.id];
    const reveal = revealed[q.id] !== undefined;
    return (
      <div className="wrap">
        <header className="brand-bar">
          <a
            href={BRAND.homepage}
            target="_blank"
            rel="noopener noreferrer"
            className="brand-logo"
            aria-label={BRAND.company}
          >
            <span dangerouslySetInnerHTML={{ __html: BRAND.logoSvg }} />
          </a>
          <span className="brand-chip">Independent quiz</span>
        </header>
        <div className="progress"><div style={{ width: `${((idx)/qs.length)*100}%` }} /></div>
        <div className="eyebrow">Question {idx+1} of {qs.length} · {TOPIC_LABEL[q.topic] || q.topic} · {q.level}</div>
        <div className="card qcard">
          <h2 style={{ fontSize: 18, lineHeight: 1.4, marginBottom: 14 }}>{q.q}</h2>
          {q.options.map((opt: string, i: number) => {
            let cls = "opt";
            if (reveal) {
              if (i === q.answer) cls += " correct";
              else if (i === chosen) cls += " wrong";
            } else if (i === chosen) cls += " picked";
            return <button key={i} className={cls} onClick={() => choose(q.id, i)}>{String.fromCharCode(65+i)}. {opt}</button>;
          })}
          {reveal && <div className="explain"><strong>{chosen === q.answer ? "Correct." : "Not quite."}</strong> {q.explain}</div>}
          {reveal && <div style={{ marginTop: 14 }}><button className="btn" onClick={next}>{idx + 1 < qs.length ? "Next question" : "See results"}</button></div>}
        </div>
        <div style={{ display:"flex", gap: 10 }}>
          <button className="btn secondary" onClick={restart}>Restart</button>
        </div>
        <footer className="attribution">{BRAND.attribution}</footer>
      </div>
    );
  }

  // done
  const pct = Math.round((correctCount / qs.length) * 100);
  const headline =
    pct >= 90 ? "Genuinely sharp on Triton One and Solana RPC infrastructure." :
    pct >= 70 ? "Solid working understanding of Triton's product surface." :
    pct >= 50 ? "Reasonable grasp. Some good rabbit holes ahead." :
    "Plenty of room to learn. Triton's docs and blog are a good next stop.";

  const topicsSorted = Object.entries(topicBreakdown).map(([t, v]) => ({ t, ...v, pct: v.correct / v.total }));
  topicsSorted.sort((a,b) => b.pct - a.pct);
  const strong = topicsSorted.slice(0, 2).filter(x => x.pct >= 0.5).map(x => TOPIC_LABEL[x.t] || x.t);
  const weak = topicsSorted.slice(-2).filter(x => x.pct < 0.7).map(x => TOPIC_LABEL[x.t] || x.t);

  return (
    <div className="wrap">
      <header className="brand-bar">
        <a
          href={BRAND.homepage}
          target="_blank"
          rel="noopener noreferrer"
          className="brand-logo"
          aria-label={BRAND.company}
        >
          <span dangerouslySetInnerHTML={{ __html: BRAND.logoSvg }} />
        </a>
        <span className="brand-chip">Independent quiz</span>
      </header>
      <div className="eyebrow">Results</div>
      <h1>{correctCount} / {qs.length} correct · {pct}%</h1>
      <p className="lede">{headline}</p>

      <div className="card">
        <h2>Topic breakdown</h2>
        {Object.entries(topicBreakdown).map(([t, v]) => (
          <div className="topic-row" key={t}>
            <span style={{ color: "var(--muted)" }}>{TOPIC_LABEL[t] || t}</span>
            <span style={{ color: "var(--text)", fontVariantNumeric: "tabular-nums" }}>{v.correct}/{v.total}</span>
          </div>
        ))}
      </div>

      <div className="card">
        <h2>What you understand well</h2>
        <div style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.55 }}>
          {strong.length ? strong.join(" · ") : "Nothing dominant yet. Try a longer quiz at a higher level."}
        </div>
      </div>

      <div className="card">
        <h2>What's worth learning next</h2>
        <div style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.55 }}>
          {weak.length ? weak.join(" · ") : "All topics roughly even. The expert tier will pressure-test the edges."}
        </div>
      </div>

      <div className="card">
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button className="btn" onClick={onCopy}>Copy results</button>
          <button className="btn secondary" onClick={restart}>Take another quiz</button>
        </div>
      </div>

      <div className="footer-note">Triton-specific detail is sourced from Triton's public documentation, blog, and pricing page. Broader Solana infra questions cover Geyser, gRPC streaming, and DEX routing concepts. Independent tool, not affiliated with Triton One.</div>

      <div className={"toast " + (toast ? "show" : "")}>Results copied to clipboard</div>
      <footer className="attribution">{BRAND.attribution}</footer>
    </div>
  );
}

export default App;
