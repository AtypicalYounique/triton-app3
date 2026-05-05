import { useMemo, useState } from "react";
import "./styles.css";
import { BRAND } from "./brand";

// Question schema: { id, topic, level, q, options[], answer (idx), explain }
// Topics: triton-rpc, yellowstone, apis, pricing-model, rpc-2-0, ops
// Length parity 0.90–1.10 STRICT across options.

const BANK = [
  // ── BEGINNER (12) ── 5 fun + 5 product + 2 industry
  // FUN FACTS (b1-b5)
  { id:"b1", topic:"company-fun-facts", level:"beginner",
    q:"In what year does Triton One say it has been powering the Solana ecosystem?",
    options:[
      "Since 2021, before many other dedicated RPC providers entered Solana",
      "Since 2017, predating the original Solana mainnet beta launch by years",
      "Since 2024, launched as a recent spinout from the Anza engineering team",
      "Since 2019, founded inside Solana Labs as an internal RPC node project",
    ],
    answer:0,
    explain:"Triton's homepage tagline is 'Powering the ecosystem since 2021', and the rpcpool GitHub org was created in April 2021." },
  { id:"b2", topic:"company-fun-facts", level:"beginner",
    q:"Who is Triton One's public-facing co-founder and frequent Solana podcast guest?",
    options:[
      "Brian Long, original Solana validator who also runs Validators.app today",
      "Mert Mumtaz, founding engineer who later left to start a rival RPC firm",
      "Anatoly Yakovenko, Solana co-founder who also leads Triton's RPC unit",
      "Austin Federa, Solana Foundation lead who directs all Triton RPC efforts",
    ],
    answer:0,
    explain:"Per Triton's Who We Are page, co-founder Brian Long is an original Solana validator based in Boulder, Colorado, and also runs Validators.app." },
  { id:"b3", topic:"company-fun-facts", level:"beginner",
    q:"What is the official GitHub organization name where Triton One hosts its OSS?",
    options:[
      "rpcpool, an organization name carried over from Triton's earlier brand",
      "triton-labs, a 2024 rebrand of the original Solana RPC GitHub organization",
      "solana-rpc, a shared org used by every major Solana RPC provider together",
      "triton-one, the only org Triton has ever published any code under so far",
    ],
    answer:0,
    explain:"Triton's GitHub organization is github.com/rpcpool (created April 14, 2021), with the org display name 'Triton One RPC' and 100+ public repositories." },
  { id:"b4", topic:"company-fun-facts", level:"beginner",
    q:"In what country is Triton One Limited's primary corporate location listed?",
    options:[
      "Isle of Man, listed as the primary company location on its LinkedIn page",
      "United States, with headquarters in Boulder, Colorado near Brian Long",
      "Netherlands, the home country of co-founder Marco Broeken's data centre",
      "United Kingdom, with a registered office in Cardiff for tax simplicity",
    ],
    answer:0,
    explain:"Triton One Limited's LinkedIn lists its primary location as Isle of Man (IM), reflecting an offshore holding pattern common in crypto infra." },
  { id:"b5", topic:"company-fun-facts", level:"beginner",
    q:"Which Solana figure is publicly listed among Triton One's customers and friends?",
    options:[
      "Toly, the Solana co-founder, appears on Triton's homepage customer list",
      "Vitalik Buterin, the Ethereum co-founder, is a Triton enterprise customer",
      "Changpeng Zhao, the former Binance CEO, is listed as a paying customer",
      "Brian Armstrong, Coinbase CEO, is listed as a long-running Triton client",
    ],
    answer:0,
    explain:"Triton's homepage names 'toly' (Anatoly Yakovenko, Solana co-founder) among the customer / community list, alongside BONKbot, Metaplex, and others." },

  // PRODUCTS (b6-b10)
  { id:"b6", topic:"company-products", level:"beginner",
    q:"What is Yellowstone Dragon's Mouth, Triton One's flagship streaming product?",
    options:[
      "A gRPC streaming interface for Solana, built on the Geyser plugin model",
      "A new Solana validator client written in Go for low-latency consensus work",
      "A wallet-as-a-service product launched by the Solana Foundation team only",
      "A retail product that streams NFT mint events to public Discord channels",
    ],
    answer:0,
    explain:"Dragon's Mouth (rpcpool/yellowstone-grpc) is Triton's open-source gRPC interface for Solana, built around the Geyser plugin model." },
  { id:"b7", topic:"company-products", level:"beginner",
    q:"How much per gigabyte does Triton One charge for its streaming products today?",
    options:[
      "$0.08 per GB of bandwidth, listed on the Triton public pricing page today",
      "$0.50 per GB of bandwidth, the standard price across most Solana RPC vendors",
      "$2.00 per GB of bandwidth, reflecting Triton's premium-tier positioning here",
      "$0.001 per GB of bandwidth, a flat low rate offered only to early customers",
    ],
    answer:0,
    explain:"Per Triton's pricing blog, all streaming services (Dragon's Mouth, Whirligig, Fumarole) cost $0.08 per GB of bandwidth." },
  { id:"b8", topic:"company-products", level:"beginner",
    q:"What prepaid balance does Triton's pay-as-you-go plan ask new customers to put up?",
    options:[
      "A $125 prepaid balance, used to test, benchmark, and quantify infra needs",
      "A $5,000 monthly recurring subscription billed by ACH from day one onward",
      "A staked SOL position locked inside a Triton-controlled custody address",
      "A zero-deposit free trial, with no upfront balance or payment card required",
    ],
    answer:0,
    explain:"Triton's pricing blog says PAYG starts with a $125 prepaid balance, used to benchmark traffic and quantify infrastructure needs." },
  { id:"b9", topic:"company-products", level:"beginner",
    q:"Beyond Solana, which networks does Triton One operate as an RPC provider today?",
    options:[
      "Sui, Pythnet and Monad alongside Solana mainnet RPC services for clients",
      "Ethereum mainnet, Arbitrum, Optimism and the Base L2 in the OP Stack tier",
      "Bitcoin mainnet, Litecoin and Stacks for ordinal-based application support",
      "Cosmos Hub, Osmosis and Celestia for IBC-routed chain interoperability use",
    ],
    answer:0,
    explain:"Triton's homepage product list covers Solana, Sui, Pythnet, and Monad, the company is Solana-centric and has expanded to high-throughput chains." },
  { id:"b10", topic:"company-products", level:"beginner",
    q:"What does the Photon API in Triton One's product line specialize in serving?",
    options:[
      "Indexed reads for Solana compressed NFTs and Light Protocol state queries",
      "Real-time push notifications sent to mobile wallets for any Solana account",
      "Generation of new Solana keypairs and management of custodial signature flows",
      "Streaming Twitter mentions of any token directly into a Solana program log",
    ],
    answer:0,
    explain:"Photon is Triton's indexed RPC API for Solana compressed NFTs and Light Protocol state, priced at $0.08/GB plus $50 per million calls." },

  // INDUSTRY (b11-b12)
  { id:"b11", topic:"industry", level:"beginner",
    q:"What is the Geyser plugin model in the Solana validator software architecture?",
    options:[
      "A way for the validator to stream account, slot and transaction data out",
      "A consensus extension that lets validators vote on extra data availability",
      "A method for forwarding submitted transactions to other validator nodes",
      "A monitoring sidecar that exports Prometheus metrics from a validator",
    ],
    answer:0,
    explain:"Geyser is Solana's plugin model for streaming account, slot, and transaction data out of the validator, the foundation Yellowstone is built on." },
  { id:"b12", topic:"industry", level:"beginner",
    q:"What does an RPC endpoint do for a typical Solana decentralized application?",
    options:[
      "It lets the app submit transactions and read on-chain data via JSON-RPC",
      "It signs every user transaction on the user's behalf, removing all wallets",
      "It stores user passwords for the app inside an encrypted Solana account",
      "It mints new SOL into existence to subsidize a dApp's user transaction fees",
    ],
    answer:0,
    explain:"An RPC endpoint is the read/write gateway between an app and a blockchain, it submits signed transactions and serves account and ledger reads." },

  // ── INTERMEDIATE (12) ── 5 fun + 5 product + 2 industry
  // FUN FACTS (i1-i5)
  { id:"i1", topic:"company-fun-facts", level:"intermediate",
    q:"How many co-founders does Triton One publicly credit on its team page today?",
    options:[
      "Three: Brian Long, Linus Kendall and Marco Broeken, on the Who We Are page",
      "Two: Brian Long and Anatoly Yakovenko, listed jointly as Triton co-founders",
      "Four: a quartet of validators who all left Solana Labs to start Triton One",
      "One: Brian Long alone, with no other co-founders listed on the public site",
    ],
    answer:0,
    explain:"Triton's Who We Are page credits three co-founders: Brian Long, Linus Kendall, and Marco Broeken, each running their own validators historically." },
  { id:"i2", topic:"company-fun-facts", level:"intermediate",
    q:"Which co-founder of Triton One also runs the Stakeconomy Solana validator?",
    options:[
      "Marco Broeken, a Netherlands-based infra architect on the Marinade team",
      "Brian Long, the Boulder-based original Solana validator behind Block Logic",
      "Linus Kendall, the UK-and-India-based co-founder and sysadmin engineer",
      "Mert Mumtaz, the original founding RPC engineer at the Triton organization",
    ],
    answer:0,
    explain:"Triton's Who We Are page says co-founder Marco Broeken runs the Stakeconomy validator and is part of the Marinade staking team." },
  { id:"i3", topic:"company-fun-facts", level:"intermediate",
    q:"Which open-source license does Triton apply to its Yellowstone gRPC repository?",
    options:[
      "AGPL-3.0, the GNU Affero General Public License version three, listed today",
      "Apache-2.0, the same permissive license used by the Solana Labs validator",
      "MIT, the most common short permissive license across crypto Rust libraries",
      "BSD-3-Clause, used by various Solana ecosystem cryptography libraries",
    ],
    answer:0,
    explain:"GitHub lists rpcpool/yellowstone-grpc under license 'GNU Affero General Public License v3.0' (AGPL-3.0), a strong copyleft choice." },
  { id:"i4", topic:"company-fun-facts", level:"intermediate",
    q:"Which Solana DEX-aggregator team is publicly named among Triton One's customers?",
    options:[
      "Jupiter, via team member Geninsus listed on Triton's homepage customer area",
      "Raydium, listed as Triton's first paying enterprise customer in early 2022",
      "Orca, named as Triton's exclusive launch partner for the Photon DAS API",
      "Drift Protocol, listed on Triton as the only on-chain perp DEX customer",
    ],
    answer:0,
    explain:"Triton's homepage names Geninsus, marked as part of Jupiter, among its customer / community list, alongside BONKbot, Metaplex, and toly." },
  { id:"i5", topic:"company-fun-facts", level:"intermediate",
    q:"Which Greek mythological figure does the Triton brand name draw its identity from?",
    options:[
      "Triton, the sea-god son of Poseidon, often shown holding a three-pronged trident",
      "Atlas, the Titan condemned to hold up the celestial sky on his strong shoulders",
      "Hermes, the Olympian messenger god famously depicted with winged sandals",
      "Hephaestus, the Olympian smith god of fire, forges, and crafted metalwork",
    ],
    answer:0,
    explain:"In Greek mythology, Triton is a sea-god, son of Poseidon, typically pictured with a three-pronged trident, fitting Triton One's infrastructure brand." },

  // PRODUCTS (i6-i10)
  { id:"i6", topic:"company-products", level:"intermediate",
    q:"How does Triton price its standard RPC, ledger, gTLA and Steamboat (gPA) calls?",
    options:[
      "$0.08 per GB of bandwidth plus $10 per million calls, per the pricing blog",
      "$0.40 per million Compute Units, weighted by the underlying RPC method costs",
      "$5 per gigabyte of egress with no separate per-million-call charge applied",
      "$50 per million calls flat, identical to the Metaplex DAS and Photon pricing",
    ],
    answer:0,
    explain:"Per Triton's pricing blog, Standard RPC, ledger, gTLA, and Steamboat (gPA) are priced at $0.08/GB plus $10 per million calls." },
  { id:"i7", topic:"company-products", level:"intermediate",
    q:"How does Triton price Metaplex DAS and Photon API calls in its current model?",
    options:[
      "$0.08 per GB of bandwidth plus $50 per million calls for these two APIs",
      "$0.08 per GB of bandwidth plus $10 per million calls, the same as Standard",
      "Free with any prepaid PAYG balance, with no per-million surcharge applied",
      "$200 flat per Metaplex user per month with unlimited Photon API requests",
    ],
    answer:0,
    explain:"Per Triton's pricing blog, Metaplex DAS and Photon API are at $0.08/GB plus $50 per million calls, the higher of the two published per-million tiers." },
  { id:"i8", topic:"company-products", level:"intermediate",
    q:"How many top-tier data centres does Triton say its network footprint covers today?",
    options:[
      "Over 20 top-tier data centres spread across three different continents now",
      "Exactly 5 colocations donated by Solana validators, all in North America",
      "Around 3 hyperscale points of presence, all sitting in Northern Virginia",
      "Over 100 community-run home servers, most located in residential Europe",
    ],
    answer:0,
    explain:"Triton's homepage says shared infrastructure runs across 20+ top-tier data centres on three continents, with health checks, load balancing, GeoDNS." },
  { id:"i9", topic:"company-products", level:"intermediate",
    q:"What is the canonical GitHub repository name for Yellowstone Dragon's Mouth?",
    options:[
      "rpcpool/yellowstone-grpc, the canonical Triton-maintained Yellowstone repo",
      "anza-xyz/yellowstone-stream, the canonical Anza-led upstream mirror today",
      "solana-labs/yellowstone-rpc, the original Solana Labs streaming repo location",
      "jito-foundation/dragons-mouth, a Jito Labs distribution fork of Dragon's Mouth",
    ],
    answer:0,
    explain:"The canonical Dragon's Mouth repo is github.com/rpcpool/yellowstone-grpc, maintained by Triton One under its older rpcpool GitHub organization." },
  { id:"i10", topic:"company-products", level:"intermediate",
    q:"Which routing technology does Triton publicly use to direct customers to nodes?",
    options:[
      "GeoDNS routing with continuous health checks and automatic regional failover",
      "A custom Anycast IP network advertised separately from each individual node",
      "Client-side load balancing using a Triton-published validator-only node list",
      "Round-robin DNS that shuffles every minute across regional pools by hand",
    ],
    answer:0,
    explain:"Triton's homepage describes its shared infra with 'continuous health checks, load balancing, automatic failover, GeoDNS routing' across 20+ data centres." },

  // INDUSTRY (i11-i12)
  { id:"i11", topic:"industry", level:"intermediate",
    q:"Why do high-throughput Solana teams typically prefer gRPC streams to WebSockets?",
    options:[
      "Stronger backpressure handling and stable long-lived streams under high load",
      "WebSockets cannot deliver any binary payloads on the modern Solana RPC stack",
      "gRPC streams are the only transport that any Solana validator can produce",
      "gRPC is the only transport that JavaScript clients are able to subscribe over",
    ],
    answer:0,
    explain:"gRPC offers stronger backpressure semantics and more stable long-lived streams than typical Solana WebSockets, which is why trading and indexing teams prefer it." },
  { id:"i12", topic:"industry", level:"intermediate",
    q:"What kind of data does a Solana Geyser plugin generally surface to subscribers?",
    options:[
      "Account writes, slot updates and transaction events from the validator core",
      "Validator vote signatures, sent through a separate consensus voting channel",
      "Bandwidth metering events sent from a customer's billing dashboard backend",
      "Solana program source code edits committed straight to a git repository tree",
    ],
    answer:0,
    explain:"Geyser plugins surface account writes, slot updates, and transaction events from inside the validator process, that's the data shape Yellowstone exposes." },

  // ── EXPERT (12) ── 4 fun + 4 product + 4 industry
  // FUN FACTS (e1-e4)
  { id:"e1", topic:"company-fun-facts", level:"expert",
    q:"Which entity is Triton One publicly partnering with to deliver the RPC 2.0 effort?",
    options:[
      "The Solana Foundation, on a ground-up rebuild of Solana's read layer system",
      "The Anza engineering team, on a fork of the Solana validator client itself",
      "The Helius Labs team, on a shared Helius-Triton bundled co-marketing brand",
      "The Jito Labs team, on a tip-routing protocol for read-side traffic flow data",
    ],
    answer:0,
    explain:"Cryptorank and Triton's LinkedIn confirm the partnership: Triton One and the Solana Foundation are rebuilding Solana's read layer end-to-end." },
  { id:"e2", topic:"company-fun-facts", level:"expert",
    q:"How does the RPC 2.0 architecture split Solana reads into two modular components?",
    options:[
      "Accounts as adaptive indexes and Ledger as columnar storage, both open-source",
      "Frontends in TypeScript and Backends in Rust, with a single shared cache layer",
      "A fork of Agave validator and a fork of the Firedancer client, run as two binaries",
      "An on-chain query VM and an off-chain Layer 2 with shared zk-proven attestations",
    ],
    answer:0,
    explain:"Per the cryptorank coverage, RPC 2.0 splits reads into Accounts (adaptive indexes) and Ledger (columnar storage), both open-sourced under AGPL." },
  { id:"e3", topic:"company-fun-facts", level:"expert",
    q:"Which open-source method has Triton publicly released for full Solana history access?",
    options:[
      "getTransactionsForAddress, served from a columnar ClickHouse history backend",
      "scanHistoricalAccounts, an Anza-blessed RPC method for any Solana RPC vendor",
      "fetchValidatorVotes, a Triton-only paid method for vote-signature retrieval",
      "compressNFTHistory, an extension of the Photon API for legacy cNFT indexing",
    ],
    answer:0,
    explain:"Triton's homepage highlights the open-source 'getTransactionsForAddress' method, served from a columnar ClickHouse store covering full Solana history." },
  { id:"e4", topic:"company-fun-facts", level:"expert",
    q:"Roughly how many open-source projects has Triton One said it has published so far?",
    options:[
      "Over 100 open-source projects across the rpcpool GitHub organization today",
      "Around 5 open-source projects, almost all forks of upstream Solana repos only",
      "Around 1,000 open-source projects, a number larger than the entire Solana org",
      "Exactly 12 open-source projects, with one new flagship project per fiscal month",
    ],
    answer:0,
    explain:"Triton's LinkedIn announcement cites '100+ open-source projects' and the rpcpool GitHub org currently shows 103 public repositories." },

  // PRODUCTS (e5-e8)
  { id:"e5", topic:"company-products", level:"expert",
    q:"On Triton's bandwidth-priced model, why might a small-payload high-call team save?",
    options:[
      "Because $10 per million dominates over CU weights when call payloads are small",
      "Because Triton refunds half of monthly bandwidth as a Solana token rebate",
      "Because the $125 prepaid balance caps the entire monthly bill at that level",
      "Because Triton charges only when a customer's traffic exceeds 100 GB monthly",
    ],
    answer:0,
    explain:"On small-payload, high-call workloads, $0.08/GB plus $10/M dominates the bill versus CU-weighted billing where some methods carry heavy CU weights." },
  { id:"e6", topic:"company-products", level:"expert",
    q:"Which streaming products did Triton list under bandwidth-only pricing in its blog?",
    options:[
      "Dragon's Mouth, Whirligig and Fumarole, all priced at the $0.08 per GB tier",
      "Photon, Metaplex DAS and gTLA, all priced at the same flat $0.08 per GB tier",
      "getTransactionsForAddress, priced under streaming bandwidth and not per call",
      "All Sui, Monad and Pythnet endpoints together as one combined streaming SKU",
    ],
    answer:0,
    explain:"Per Triton's pricing blog, the streaming products Dragon's Mouth, Whirligig, and Fumarole are priced at $0.08/GB with no per-million-call charge added." },
  { id:"e7", topic:"company-products", level:"expert",
    q:"Why does Triton co-locate its bare-metal RPC nodes near Solana validator clusters?",
    options:[
      "Because RPC-to-validator latency dominates the read path after the client hop",
      "Because Solana validators only accept RPC traffic from very nearby IP ranges",
      "Because validators give Triton free hardware in return for nearby data centres",
      "Because Solana protocol penalizes RPC nodes that sit far from any validator",
    ],
    answer:0,
    explain:"Solana RPC reads depend on the client-to-RPC and RPC-to-validator paths, validator proximity reduces tail latency, key for trading-grade workloads." },
  { id:"e8", topic:"company-products", level:"expert",
    q:"What is one realistic trade-off of choosing dedicated nodes over shared Triton infra?",
    options:[
      "You isolate latency and capacity at the cost of higher fixed monthly spend now",
      "You give up multi-region failover, since plugins run in one location only ever",
      "You lose access to the standard JSON-RPC HTTP endpoint on that same node forever",
      "You must run the plugin code under Anza's centralized hosting environment now",
    ],
    answer:0,
    explain:"Dedicated nodes give isolation, predictable performance, and custom Geyser plugins, but at higher fixed monthly spend than shared PAYG infrastructure." },

  // INDUSTRY (e9-e12)
  { id:"e9", topic:"industry", level:"expert",
    q:"Why is global RPC distribution alone insufficient to deliver low Solana latency?",
    options:[
      "Because RPC-to-validator latency dominates after the client to RPC hop ends",
      "Because GeoDNS records cannot resolve traffic across more than three regions",
      "Because validators reject RPC nodes located outside their own home country",
      "Because the Solana protocol enforces a 50ms ceiling on the client to RPC hop",
    ],
    answer:0,
    explain:"Solana RPC reads depend on two paths: client-to-RPC and RPC-to-validator. A globally distributed RPC fleet still loses if it sits far from validator clusters." },
  { id:"e10", topic:"industry", level:"expert",
    q:"Why does running a custom Geyser plugin typically require a dedicated Solana node?",
    options:[
      "Because Geyser plugins compile into the validator process at startup time",
      "Because Geyser plugins run as standalone Anza-approved containerized binaries",
      "Because Geyser plugins are signed on-chain and must match a validator stake",
      "Because Geyser plugins require their own separate consensus voting channel",
    ],
    answer:0,
    explain:"Geyser plugins compile into the validator process and load at startup, so any custom plugin requires a dedicated node where you control the validator." },
  { id:"e11", topic:"industry", level:"expert",
    q:"What is one likely architectural move when decoupling Solana's read layer from Agave?",
    options:[
      "Move account indexing into an external service in sync with the network tip",
      "Replace JSON-RPC entirely with a fully on-chain query language program ASAP",
      "Move every read query to be paid for in SOL gas at the protocol layer itself",
      "Force every Solana dApp to run its own validator before issuing any RPC call",
    ],
    answer:0,
    explain:"Triton's framing of RPC 2.0 emphasizes modular, independently scalable read services kept in sync with the network tip, separate from the validator." },
  { id:"e12", topic:"industry", level:"expert",
    q:"Which data shape best characterizes a typical Geyser-fed gRPC subscription stream?",
    options:[
      "Account writes, slot updates and transaction notifications served over gRPC",
      "Validator vote signatures alone, separated out for on-chain audit purposes only",
      "A nightly snapshot of the entire Solana state, mailed once per day per customer",
      "Aggregated billing events covering each customer's monthly bandwidth usage",
    ],
    answer:0,
    explain:"Geyser surfaces account writes, slot updates, and transaction events. Yellowstone Dragon's Mouth wraps that data shape and serves it over gRPC." },
];

const TOPIC_LABEL: Record<string, string> = {
  "company-fun-facts": "Triton One company facts",
  "company-products": "Triton One product line",
  industry: "Solana RPC and infra concepts",
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
