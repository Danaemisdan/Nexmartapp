'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Orb } from '@/components/ui/orb';

const FadeInSection = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, delay }}
        className="w-full max-w-5xl mx-auto py-24 px-6 md:px-12 glass-panel rounded-3xl my-12 relative overflow-hidden"
    >
        <div className="relative z-10">
            {children}
        </div>
    </motion.div>
);

export default function PitchDeck() {
    return (
        <div className="min-h-screen w-full bg-black text-white selection:bg-blue-500/30 overflow-x-hidden">
            {/* Background Orb */}
            <div className="fixed inset-0 z-0 opacity-40 pointer-events-none mix-blend-screen flex items-center justify-center">
                <div className="w-[100vw] h-[100vh]">
                    <Orb 
                        colors={["#2563EB", "#9333EA"]} 
                        volumeMode="manual" 
                        manualInput={0.3} 
                        manualOutput={0.5} 
                    />
                </div>
            </div>

            <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black pointer-events-none" />

            {/* Navigation / Header */}
            <header className="fixed top-0 left-0 w-full z-50 p-6 glass-panel border-b-0 border-white/5">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <img src="/logo.svg" alt="Nexsupermart" className="h-8 w-auto invert brightness-0" onError={(e) => (e.currentTarget.style.display = 'none')} />
                        <span className="font-bold text-xl tracking-wider uppercase bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">Nexsupermart</span>
                    </div>
                    <div className="text-sm tracking-widest text-white/50 uppercase font-medium">Strategic Partnership Proposal</div>
                </div>
            </header>

            <main className="relative z-10 pt-32 pb-24 flex flex-col items-center">
                
                {/* 1. Title Slide */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                    className="min-h-[80vh] flex flex-col justify-center items-center text-center px-4 max-w-5xl mx-auto"
                >
                    <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-sm font-medium tracking-widest text-blue-300 uppercase">
                        Partnership Proposal
                    </div>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 leading-tight">
                        <span className="block text-white/90">AI-Powered</span>
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-indigo-400 to-purple-500">
                            Retail Supply Chain
                        </span>
                        <span className="block text-white/70 text-4xl md:text-6xl mt-2">& Commerce Infrastructure</span>
                    </h1>
                    <div className="mt-12 text-xl text-white/60 font-light tracking-wide flex flex-col md:flex-row gap-8 items-center justify-center">
                        <div className="flex flex-col items-center">
                            <span className="text-xs uppercase tracking-widest text-white/40 mb-1">Presented By</span>
                            <span className="font-semibold text-white/90">NEXSUPERMART LIMITED</span>
                        </div>
                        <div className="h-px w-12 md:h-12 md:w-px bg-white/20" />
                        <div className="flex flex-col items-center">
                            <span className="text-xs uppercase tracking-widest text-white/40 mb-1">Presented To</span>
                            <span className="font-bold text-blue-400 text-2xl">OMNI RETAIL</span>
                        </div>
                    </div>
                </motion.div>

                {/* 2. Executive Summary */}
                <FadeInSection>
                    <h2 className="text-3xl font-bold mb-8 text-blue-400">Executive Summary</h2>
                    <p className="text-xl text-white/80 leading-relaxed mb-6 font-light">
                        Nexsupermart Limited is developing a next-generation retail infrastructure platform integrating physical retail expansion, AI-powered commerce systems, supply chain intelligence, automated procurement infrastructure, and agentic commerce technologies.
                    </p>
                    <div className="grid md:grid-cols-2 gap-8 mt-12">
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                            <h3 className="text-sm uppercase tracking-widest text-purple-400 mb-4 font-semibold">Our Objective</h3>
                            <ul className="space-y-3 text-white/70">
                                <li className="flex gap-3"><span className="text-blue-500">✦</span> Establish ~300 retail franchise stores across Lagos State.</li>
                                <li className="flex gap-3"><span className="text-blue-500">✦</span> Scale progressively toward ~8,000 retail franchise locations nationwide.</li>
                            </ul>
                        </div>
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                            <h3 className="text-sm uppercase tracking-widest text-purple-400 mb-4 font-semibold">Omni Retail as Partner</h3>
                            <ul className="space-y-3 text-white/70">
                                <li className="flex gap-3"><span className="text-blue-500">✦</span> Primary procurement & inventory partner.</li>
                                <li className="flex gap-3"><span className="text-blue-500">✦</span> Nationwide supply chain & logistics partner.</li>
                                <li className="flex gap-3"><span className="text-blue-500">✦</span> Integrated commerce supply ecosystem partner.</li>
                            </ul>
                        </div>
                    </div>
                </FadeInSection>

                {/* 3. Industry Overview */}
                <FadeInSection>
                    <div className="grid md:grid-cols-12 gap-12 items-center">
                        <div className="md:col-span-5">
                            <h2 className="text-4xl font-bold mb-6 text-white leading-tight">
                                Industry <br/> <span className="text-indigo-400">Overview</span>
                            </h2>
                            <p className="text-white/60 mb-6 leading-relaxed">
                                Nigeria possesses one of Africa’s largest and fastest-growing consumer markets, supported by a population exceeding 200M, increasing urbanization, and rapid digital adoption.
                            </p>
                        </div>
                        <div className="md:col-span-7 space-y-4">
                            <div className="p-5 rounded-xl bg-gradient-to-r from-red-500/10 to-transparent border-l-4 border-red-500/50">
                                <h4 className="font-semibold text-white/90 mb-2">The Problem</h4>
                                <p className="text-sm text-white/60">Fragmented procurement, inconsistent inventory management, supply chain inefficiencies, weak pricing leverage, and limited tech adoption.</p>
                            </div>
                            <div className="p-5 rounded-xl bg-gradient-to-r from-emerald-500/10 to-transparent border-l-4 border-emerald-500/50">
                                <h4 className="font-semibold text-white/90 mb-2">The Opportunity</h4>
                                <p className="text-sm text-white/60">Modernize retail infrastructure through technology-enabled commerce systems capable of improving procurement efficiency, inventory intelligence, and consumer access at scale.</p>
                            </div>
                        </div>
                    </div>
                </FadeInSection>

                {/* 4. The Nexsupermart Vision */}
                <FadeInSection>
                    <div className="text-center max-w-4xl mx-auto">
                        <h2 className="text-sm uppercase tracking-widest text-blue-400 mb-4 font-bold">The Nexsupermart Vision</h2>
                        <h3 className="text-3xl md:text-5xl font-light leading-tight mb-8">
                            Nexsupermart is not designed as a traditional supermarket chain.
                        </h3>
                        <blockquote className="text-2xl md:text-3xl font-serif italic text-white/90 border-l-4 border-indigo-500 pl-6 py-2 my-8 text-left">
                            "An AI-powered commerce and retail infrastructure platform for Africa."
                        </blockquote>
                        <p className="text-lg text-white/60 leading-relaxed mb-12">
                            Our ecosystem integrates physical franchise stores, AI-powered inventory intelligence, agentic commerce systems, automated procurement, and embedded financial services.
                        </p>
                        <div className="p-8 rounded-3xl bg-gradient-to-b from-indigo-500/20 to-purple-500/5 border border-indigo-500/30">
                            <p className="text-xl text-white font-medium">
                                The long-term objective: <br/>
                                <span className="text-indigo-300 font-bold mt-2 block">"The operating infrastructure connecting African consumers, merchants, suppliers, and AI-driven commerce systems."</span>
                            </p>
                        </div>
                    </div>
                </FadeInSection>

                {/* 5. Why Omni Retail */}
                <FadeInSection>
                    <h2 className="text-4xl font-bold mb-12 text-center">Why <span className="text-blue-400">Omni Retail?</span></h2>
                    <div className="grid md:grid-cols-2 gap-12">
                        <div>
                            <p className="text-lg text-white/70 mb-8">
                                Nexsupermart believes Omni Retail is strategically positioned to serve as a foundational infrastructure partner due to established procurement capabilities, inventory management expertise, and supply chain infrastructure.
                            </p>
                            <div className="space-y-4">
                                {['Procurement Capabilities', 'Fulfillment & Logistics', 'Retail Technology Expertise', 'Operational Experience'].map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-white/5">
                                        <div className="h-2 w-2 rounded-full bg-blue-500" />
                                        <span className="font-medium text-white/90">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative rounded-3xl overflow-hidden glass-panel p-8 flex flex-col justify-center border-blue-500/30">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-white mb-2">The Collaboration</div>
                                <div className="flex items-center justify-center gap-4 my-6">
                                    <div className="text-blue-400 font-bold">OMNI RETAIL</div>
                                    <div className="text-white/30 text-3xl">+</div>
                                    <div className="text-purple-400 font-bold">NEXSUPERMART</div>
                                </div>
                                <p className="text-sm text-white/60">
                                    Combines procurement and supply chain capabilities with AI-powered commerce infrastructure to create a scalable national retail ecosystem.
                                </p>
                            </div>
                        </div>
                    </div>
                </FadeInSection>

                {/* 6. Proposed Partnership Framework */}
                <FadeInSection>
                    <h2 className="text-3xl font-bold mb-10 text-center text-white">Proposed Partnership Framework</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-900/40 to-transparent border border-blue-500/20 hover:border-blue-500/50 transition-colors">
                            <h3 className="text-xl font-bold text-blue-400 mb-6 flex items-center gap-3">
                                <span className="p-2 bg-blue-500/20 rounded-lg">📦</span> Omni Retail Responsibilities
                            </h3>
                            <ul className="space-y-4 text-white/70">
                                <li>• Manage centralized procurement for franchise stores</li>
                                <li>• Supply inventory to retail stores nationwide</li>
                                <li>• Coordinate inventory fulfillment & warehousing</li>
                                <li>• Integrate systems into Nexsupermart commerce infrastructure</li>
                                <li>• Support AI-generated replenishment systems</li>
                            </ul>
                        </div>
                        <div className="p-8 rounded-3xl bg-gradient-to-br from-purple-900/40 to-transparent border border-purple-500/20 hover:border-purple-500/50 transition-colors">
                            <h3 className="text-xl font-bold text-purple-400 mb-6 flex items-center gap-3">
                                <span className="p-2 bg-purple-500/20 rounded-lg">🤖</span> Nexsupermart Responsibilities
                            </h3>
                            <ul className="space-y-4 text-white/70">
                                <li>• Acquire and onboard franchise stores nationwide</li>
                                <li>• Manage retail branding and standardization</li>
                                <li>• Deploy agentic commerce systems</li>
                                <li>• Operate AI-powered commerce infrastructure</li>
                                <li>• Coordinate retail demand generation & marketing</li>
                            </ul>
                        </div>
                    </div>
                </FadeInSection>

                {/* 7 & 8. Agentic Commerce & Workflow */}
                <FadeInSection>
                    <div className="text-center mb-16">
                        <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 text-sm font-bold tracking-widest mb-4">CORE TECHNOLOGY</div>
                        <h2 className="text-4xl font-bold text-white mb-6">Agentic Commerce Infrastructure</h2>
                        <p className="max-w-3xl mx-auto text-lg text-white/70">
                            Nexsupermart is embedding AI systems capable of autonomously monitoring inventory, predicting demand, generating procurement requests, optimizing pricing, and coordinating replenishment workflows.
                        </p>
                    </div>

                    <h3 className="text-2xl font-bold text-center text-white/90 mb-10">Proposed Operational Workflow</h3>
                    <div className="relative">
                        {/* Connecting line */}
                        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/50 via-purple-500/50 to-transparent hidden md:block" />
                        
                        <div className="space-y-12">
                            {[
                                { step: "1", title: "Retail Activity", desc: "Nexsupermart stores process sales through integrated POS and inventory systems." },
                                { step: "2", title: "AI Monitoring", desc: "Continuous monitoring of inventory depletion, sales velocity, and consumer behavior." },
                                { step: "3", title: "Automated Procurement", desc: "AI autonomously generates replenishment requests routed directly to Omni Retail systems." },
                                { step: "4", title: "Inventory Fulfillment", desc: "Omni Retail processes, fulfills, and dispatches inventory to stores nationwide." },
                                { step: "5", title: "Continuous Optimization", desc: "AI optimizes inventory levels, procurement timing, pricing, and logistics." }
                            ].map((item, i) => (
                                <div key={i} className={`flex flex-col md:flex-row items-center gap-8 ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                                    <div className={`flex-1 text-center ${i % 2 !== 0 ? 'md:text-left' : 'md:text-right'}`}>
                                        <h4 className="text-xl font-bold text-white mb-2">{item.title}</h4>
                                        <p className="text-white/60">{item.desc}</p>
                                    </div>
                                    <div className="relative z-10 w-12 h-12 rounded-full bg-black border-2 border-indigo-500 flex items-center justify-center font-bold text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.4)]">
                                        {item.step}
                                    </div>
                                    <div className="flex-1 hidden md:block" />
                                </div>
                            ))}
                        </div>
                    </div>
                </FadeInSection>

                {/* 9. Architecture */}
                <FadeInSection>
                    <h2 className="text-3xl font-bold mb-10 text-center">Supply Chain & Procurement Architecture</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { title: "Central Procurement Layer", items: ["Supplier negotiations", "Bulk procurement", "Inventory planning"] },
                            { title: "Warehousing Layer", items: ["Centralized warehousing", "Regional hubs", "Inventory staging"] },
                            { title: "Distribution Layer", items: ["National fulfillment", "Store replenishment", "Last-mile logistics"] },
                            { title: "AI Intelligence Layer", items: ["Predictive management", "Autonomous replenishment", "Demand forecasting"] }
                        ].map((layer, i) => (
                            <div key={i} className="p-6 rounded-2xl glass-panel bg-white/[0.02] border-white/10 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <h3 className="text-lg font-bold text-blue-300 mb-4 h-14">{layer.title}</h3>
                                <ul className="space-y-2">
                                    {layer.items.map((item, j) => (
                                        <li key={j} className="text-sm text-white/60 flex items-start gap-2">
                                            <span className="text-purple-500 mt-0.5">▹</span> {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </FadeInSection>

                {/* 10. Expansion Strategy */}
                <FadeInSection>
                    <div className="flex flex-col md:flex-row gap-12 items-center">
                        <div className="flex-1">
                            <h2 className="text-4xl font-bold mb-6">National Retail <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">Expansion</span> Strategy</h2>
                            <p className="text-white/60 mb-8">A phased approach to deploying infrastructure across Nigeria, culminating in a massive nationwide presence.</p>
                        </div>
                        <div className="flex-1 w-full space-y-6">
                            <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-transparent border border-emerald-500/20 relative overflow-hidden">
                                <div className="text-emerald-400 text-sm font-bold uppercase tracking-widest mb-2">Phase 1 — Lagos State</div>
                                <div className="text-3xl font-black text-white mb-2">300 Stores</div>
                                <p className="text-sm text-white/60">Lekki, Ikeja, Yaba, Surulere, Festac, Mainland.</p>
                            </div>
                            <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-500/10 to-transparent border border-blue-500/20 relative overflow-hidden">
                                <div className="text-blue-400 text-sm font-bold uppercase tracking-widest mb-2">Phase 2 — National Expansion</div>
                                <div className="text-3xl font-black text-white mb-2">8,000 Stores</div>
                                <p className="text-sm text-white/60">Abuja, Port Harcourt, Kano, Ibadan, Onitsha, Aba, and secondary urban centers.</p>
                            </div>
                        </div>
                    </div>
                </FadeInSection>

                {/* 11 & 12. Strategic Benefits */}
                <FadeInSection>
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold">Strategic Benefits</h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="glass-panel p-8 rounded-3xl border-l-4 border-blue-500">
                            <h3 className="text-2xl font-bold text-blue-400 mb-6">To Omni Retail</h3>
                            <ul className="space-y-6">
                                <li>
                                    <strong className="block text-white mb-1">1. Recurring Procurement Volume</strong>
                                    <span className="text-sm text-white/60">Continuous inventory demand from a rapidly expanding network.</span>
                                </li>
                                <li>
                                    <strong className="block text-white mb-1">2. Nationwide Distribution Reach</strong>
                                    <span className="text-sm text-white/60">Access to Nigeria’s largest emerging retail distribution ecosystem.</span>
                                </li>
                                <li>
                                    <strong className="block text-white mb-1">3. AI-Driven Retail Intelligence</strong>
                                    <span className="text-sm text-white/60">Consumer trends, regional analytics, and predictive demand.</span>
                                </li>
                                <li>
                                    <strong className="block text-white mb-1">4. Supply Chain Optimization</strong>
                                    <span className="text-sm text-white/60">Improved inventory planning and working capital optimization.</span>
                                </li>
                            </ul>
                        </div>
                        <div className="glass-panel p-8 rounded-3xl border-l-4 border-purple-500">
                            <h3 className="text-2xl font-bold text-purple-400 mb-6">To Nexsupermart</h3>
                            <ul className="space-y-6">
                                <li>
                                    <strong className="block text-white mb-1">Accelerated Expansion</strong>
                                    <span className="text-sm text-white/60">Rapidly scale national presence with reliable backing.</span>
                                </li>
                                <li>
                                    <strong className="block text-white mb-1">Inventory Reliability</strong>
                                    <span className="text-sm text-white/60">Ensure consistent stock levels across all franchise locations.</span>
                                </li>
                                <li>
                                    <strong className="block text-white mb-1">Procurement Efficiency</strong>
                                    <span className="text-sm text-white/60">Leverage established networks for better pricing competitiveness.</span>
                                </li>
                                <li>
                                    <strong className="block text-white mb-1">Optimized Execution</strong>
                                    <span className="text-sm text-white/60">Enhance AI-powered automation with real-world logistical excellence.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </FadeInSection>

                {/* 13 & 14. Tech Integration & Financial Opportunity */}
                <FadeInSection>
                    <div className="grid md:grid-cols-2 gap-12">
                        <div>
                            <h3 className="text-2xl font-bold mb-6 text-indigo-300">Technology Integration Framework</h3>
                            <div className="flex flex-wrap gap-3">
                                {['Inventory Management APIs', 'Real-time Visibility', 'Automated Replenishment', 'AI Forecasting', 'Unified Dashboards', 'POS Sync', 'Operational Analytics'].map((tag, i) => (
                                    <span key={i} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white/80">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold mb-6 text-green-400">Financial & Commercial Opportunity</h3>
                            <p className="text-white/70 mb-4 leading-relaxed">
                                At scale, the ecosystem generates recurring procurement flows, massive inventory turnover, and high-frequency retail transactions.
                            </p>
                            <p className="text-white/70 leading-relaxed">
                                <strong>Long-term:</strong> Embedded finance, merchant credit systems, predictive commerce intelligence, and pan-African expansion.
                            </p>
                        </div>
                    </div>
                </FadeInSection>

                {/* 15. Rollout Plan */}
                <FadeInSection>
                    <h2 className="text-3xl font-bold mb-10 text-center">Operational Rollout Plan</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { phase: "1", title: "Strategic Alignment", items: ["Executive engagement", "Commercial framework", "Operational scoping"] },
                            { phase: "2", title: "Integration Design", items: ["Systems workshops", "Supply coordination", "AI deployment planning"] },
                            { phase: "3", title: "Pilot Deployment", items: ["Initial Lagos rollout", "Inventory sync", "Procurement testing"] },
                            { phase: "4", title: "National Scale", items: ["Phased expansion", "Regional logistics", "Full AI activation"] }
                        ].map((p, i) => (
                            <div key={i} className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                <div className="text-xs font-bold text-blue-400 mb-2 uppercase">Phase {p.phase}</div>
                                <h4 className="font-bold text-white mb-4 h-10">{p.title}</h4>
                                <ul className="space-y-2">
                                    {p.items.map((item, j) => (
                                        <li key={j} className="text-xs text-white/50 border-t border-white/5 pt-2">{item}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </FadeInSection>

                {/* 16 & 17. Next Steps & Closing */}
                <FadeInSection>
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl font-bold mb-6">Long-Term Strategic Opportunity</h2>
                        <p className="text-xl text-white/80 mb-12 font-light">
                            Evolving into one of Africa’s largest AI-powered retail ecosystems, a national commerce infrastructure platform, and a pan-African supply chain network.
                        </p>

                        <div className="bg-gradient-to-b from-blue-900/30 to-transparent p-8 rounded-3xl border border-blue-500/30 mb-12 text-left">
                            <h3 className="text-xl font-bold text-blue-300 mb-6 uppercase tracking-widest text-center">Proposed Next Steps</h3>
                            <ol className="space-y-4 max-w-lg mx-auto">
                                <li className="flex gap-4 items-center">
                                    <span className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm shrink-0">1</span>
                                    <span className="text-white/80 font-medium">Executive-level strategic discussions</span>
                                </li>
                                <li className="flex gap-4 items-center">
                                    <span className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm shrink-0">2</span>
                                    <span className="text-white/80 font-medium">Joint operational workshops</span>
                                </li>
                                <li className="flex gap-4 items-center">
                                    <span className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm shrink-0">3</span>
                                    <span className="text-white/80 font-medium">Technology integration assessments</span>
                                </li>
                                <li className="flex gap-4 items-center">
                                    <span className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm shrink-0">4</span>
                                    <span className="text-white/80 font-medium">Commercial framework negotiations</span>
                                </li>
                                <li className="flex gap-4 items-center">
                                    <span className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm shrink-0">5</span>
                                    <span className="text-white/80 font-medium">Pilot deployment planning</span>
                                </li>
                            </ol>
                        </div>

                        <div className="mt-16 pt-12 border-t border-white/10">
                            <img src="/logo.svg" alt="Nexsupermart" className="h-12 w-auto mx-auto mb-6 invert opacity-80" onError={(e) => (e.currentTarget.style.display = 'none')} />
                            <h4 className="text-2xl font-bold text-white mb-4 tracking-wider">NEXSUPERMART LIMITED</h4>
                            <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-medium tracking-widest uppercase text-sm">
                                Building Africa’s AI-Powered Commerce Infrastructure
                            </p>
                        </div>
                    </div>
                </FadeInSection>

            </main>
        </div>
    );
}
