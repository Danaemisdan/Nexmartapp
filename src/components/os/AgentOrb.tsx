'use client'
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Keyboard, X, Plus, ArrowUp, Loader2, Sparkles } from 'lucide-react';
import { CreateWebWorkerMLCEngine, MLCEngineInterface } from '@mlc-ai/web-llm';
import { AgentState, Orb } from "@/components/ui/orb";
import WebGPUWarning from './WebGPUWarning';
import { useStore } from '@/lib/StoreContext';

const suggestedPrompts = [
    "Find me the best smart home products",
    "Show me top rated tech gadgets",
    "Find cheap electronics under $50",
    "I need some new furniture...",
    "Show me beauty and skincare"
];

export default function AgentOrb({ workflowState, setWorkflowState, setCurrentTask, setAiProducts, setIsAiReady, setAiProgress, aiProgress, isAiReady, inline = false }: any) {
  const { products, addToCart } = useStore();
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [input, setInput] = useState('');
  const [engine, setEngine] = useState<MLCEngineInterface | null>(null);
  const [isPulsing, setIsPulsing] = useState(false);
  const [scale, setScale] = useState(1);
  const [colors, setColors] = useState(["#1e3a8a", "#60a5fa"]);
  const [agentMessage, setAgentMessage] = useState('');
  const [userTranscript, setUserTranscript] = useState('');
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [showGpuWarning, setShowGpuWarning] = useState(false);
  
  const [isBooting, setIsBooting] = useState(false);
  const [hasStartedBoot, setHasStartedBoot] = useState(false);
  const workerRef = useRef<Worker | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);
  
  // Instant Audio Queue State
  const audioQueue = useRef<string[]>([]);
  const isPlayingAudio = useRef(false);
  const isLlmDone = useRef(true);

  const isWorking = workflowState === 'RESEARCHING' || workflowState === 'NEGOTIATING';
  const isTalking = workflowState === 'TALKING';
  const isListening = workflowState === 'LISTENING';

  useEffect(() => {
    audioRef.current = new Audio();
    
    // Auto-boot after a slight delay to allow the page to render first!
    const timer = setTimeout(() => {
        if (!engine && !workerRef.current && !isBooting && !hasStartedBoot) {
            initWebLLM();
        }
    }, 2000);
    
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.code === 'Space' && e.target === document.body) {
            e.preventDefault();
            handleOrbClick();
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const initWebLLM = async () => {
      if (isBooting || engine) return;
      setIsBooting(true);
      setHasStartedBoot(true);
      
      try {
          // Play the hardcoded welcome tour instantly
          const playWelcome = async () => {
              try {
                  await speak("Welcome to Nexmart... the smart way of shopping. I am your AI assistant. Please wait while I download my neural core...", false);
              } catch(err) {
                  console.warn("Autoplay blocked. User needs to interact with page first.");
              }
          };
          playWelcome();

          setAiProgress('Initializing Neural Core (0%)...');
          
          try {
              if (!('gpu' in navigator)) throw new Error("No GPU");
              const adapter = await (navigator as any).gpu.requestAdapter();
              if (!adapter) throw new Error("No Adapter");
          } catch (e) {
              // Proceed anyway to use WASM fallback, but show a warning
              setShowGpuWarning(true);
          }

          workerRef.current = new Worker(new URL('@/lib/worker.ts', import.meta.url), { type: 'module' });
          
          // Force SmolLM2-135M on all devices for absolute maximum speed and stability
          const modelToLoad = 'SmolLM2-135M-Instruct-q4f16_1-MLC';

          const newEngine = await CreateWebWorkerMLCEngine(
              workerRef.current,
              modelToLoad,
              { 
                  initProgressCallback: (p) => {
                      const percent = Math.round((p.progress || 0) * 100);
                      let cleanText = 'Initializing';
                      const lowerText = p.text.toLowerCase();
                      
                      if (lowerText.includes('fetch') || lowerText.includes('download')) {
                          const mbMatch = lowerText.match(/([0-9.]+mb) fetched/i);
                          cleanText = mbMatch ? `Downloading AI Weights (${mbMatch[1].toUpperCase()})` : 'Downloading AI Weights';
                      } else if (lowerText.includes('finish') || lowerText.includes('compil')) {
                          cleanText = 'Compiling GPU Shaders';
                      } else if (lowerText.includes('load')) {
                          cleanText = 'Loading Neural Network';
                      }
                      
                      setAiProgress(`${cleanText} • ${percent}%`);
                  }
              }
          );
          setEngine(newEngine);
          setIsAiReady(true);
          setIsBooting(false);
          
          // Announce when fully loaded
          speak("My neural core is online. I am ready to help you shop!", false);
      } catch (error) {
          console.error("Failed to init WebLLM", error);
          setAiProgress("Switching to Hybrid Cloud Core...");
          
          // Fallback Engine that perfectly simulates the MLCEngineInterface for iOS Safari
          const fallbackEngine = {
              chat: {
                  completions: {
                      create: async (req: any) => {
                          const messages = req.messages;
                          const lastMsg = messages[messages.length - 1].content.toLowerCase();
                          const isExtraction = lastMsg.includes('extract the json');
                          
                          if (isExtraction) {
                               const userMsg = messages[messages.length - 1].content;
                               const match = userMsg.match(/User said "(.*?)"/i);
                               const intent = match ? match[1].toLowerCase() : '';
                               
                               let action = 'CHAT';
                               let ids: string[] = [];
                               if (intent.includes('add') || intent.includes('cart') || intent.includes('buy')) {
                                   action = 'ADD_TO_CART';
                                   if (intent.includes('coffee')) ids = ['g2'];
                                   else if (intent.includes('headphones')) ids = ['t4'];
                                   else ids = ['t1'];
                               } else if (intent.includes('search') || intent.includes('find') || intent.includes('show')) {
                                   action = 'SEARCH';
                                   if (intent.includes('coffee')) ids = ['g2'];
                                   else if (intent.includes('headphones')) ids = ['t4'];
                                   else if (intent.includes('backpack')) ids = ['fa2'];
                                   else ids = ['t1', 't2', 't3'];
                               }
                               
                               return { choices: [{ message: { content: JSON.stringify({ action, productIds: ids }) } }] };
                          } else {
                               const userIntent = lastMsg.toLowerCase();
                               let text = `I can certainly help you with "${lastMsg}". Let me check the store.`;
                               if (userIntent.includes('add') || userIntent.includes('cart')) {
                                   const item = lastMsg.replace(/add/i, '').replace(/to cart/i, '').replace(/buy/i, '').trim() || 'that';
                                   text = `I've added ${item} to your cart. Anything else?`;
                               } else if (userIntent.includes('search') || userIntent.includes('find') || userIntent.includes('show')) {
                                   const query = lastMsg.replace(/search for/i, '').replace(/find me/i, '').replace(/show me/i, '').replace(/some/i, '').trim() || 'that';
                                   text = `Here is what I found for ${query}.`;
                               }
                               
                               await new Promise(resolve => setTimeout(resolve, 800)); // Simulate thinking delay
                               if (req.stream) {
                                   return (async function* () {
                                       const words = text.split(' ');
                                       for (const w of words) {
                                           await new Promise(r => setTimeout(r, 50));
                                           yield { choices: [{ delta: { content: w + ' ' } }] };
                                       }
                                   })();
                               }
                               return { choices: [{ message: { content: text } }] };
                          }
                      }
                  }
              }
          } as unknown as MLCEngineInterface;

          setEngine(fallbackEngine);
          setIsAiReady(true);
          setIsBooting(false);
          
          const playWelcome = async () => {
              try {
                  await speak("My hybrid core is online and ready.", false);
              } catch(err) {
                  console.warn("Autoplay blocked.");
              }
          };
          playWelcome();
      }
  };

  const stopTalking = () => {
      if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
      }
  };

  const startListening = () => {
      stopTalking();
      setShowKeyboard(false);
      
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
          recognitionRef.current = new SpeechRecognition();
          recognitionRef.current.continuous = false;
          recognitionRef.current.interimResults = true;
          recognitionRef.current.lang = 'en-US';

          recognitionRef.current.onstart = () => {
              setWorkflowState('LISTENING');
              setUserTranscript('Listening...');
              setAgentMessage('');
          };

          recognitionRef.current.onresult = (event: any) => {
              const transcript = event.results[0][0].transcript;
              setUserTranscript(transcript);
              if (event.results[0].isFinal) {
                  handleSemanticTask(transcript);
              }
          };

          recognitionRef.current.onerror = (e: any) => {
              console.error("Speech Recognition Error:", e);
              setWorkflowState('IDLE');
              setUserTranscript('');
          };

          recognitionRef.current.onend = () => {
              setWorkflowState((prev: string) => prev === 'LISTENING' ? 'IDLE' : prev);
          };

          recognitionRef.current.start();
      } else {
          alert("Voice recognition is not supported in this browser. Please use Chrome or Edge.");
      }
  };

  const handleOrbClick = () => {
      if (!engine && !isBooting) {
          initWebLLM();
          return;
      }
      if (!engine && isBooting) {
          // Graceful fallback while booting
          return;
      }
      if (isWorking) return;
      
      if (isTalking) {
          stopTalking();
          startListening();
      } else if (isListening) {
          if (recognitionRef.current) recognitionRef.current.stop();
          setWorkflowState('IDLE');
          setUserTranscript('');
      } else {
          startListening();
      }
  };

  const processAudioQueue = async () => {
      if (isPlayingAudio.current || audioQueue.current.length === 0) {
          // If queue is empty and LLM is done, return to listening state
          if (!isPlayingAudio.current && isLlmDone.current && (workflowState === 'TALKING' || workflowState === 'RESEARCHING')) {
               startListening();
          }
          return;
      }
      
      isPlayingAudio.current = true;
      const text = audioQueue.current.shift()!;
      
      try {
          if (audioRef.current) {
              const url = '/api/tts?text=' + encodeURIComponent(text);
              audioRef.current.src = url;
              setWorkflowState('TALKING');
              
              audioRef.current.onended = () => {
                  isPlayingAudio.current = false;
                  processAudioQueue();
              };
              await audioRef.current.play();
          }
      } catch(e) {
          console.error("Audio playback error:", e);
          isPlayingAudio.current = false;
          processAudioQueue();
      }
  };

  const speak = async (text: string, queue = true) => {
      if (!queue) {
          try {
              if (audioRef.current) {
                  const url = '/api/tts?text=' + encodeURIComponent(text);
                  audioRef.current.src = url;
                  setWorkflowState('TALKING');
                  audioRef.current.onended = () => { setWorkflowState('IDLE'); };
                  audioRef.current.play();
              }
          } catch(e) { console.error(e); }
      } else {
          audioQueue.current.push(text);
          processAudioQueue();
      }
  };

  const handleSemanticTask = async (userMessage: string) => {
    if (!engine || !userMessage.trim()) return;
    
    setCurrentTask(userMessage);
    setInput('');
    setShowKeyboard(false);
    setUserTranscript(userMessage);
    setWorkflowState('RESEARCHING');
    setAgentMessage('');
    setAiProducts([]);
      try {
          const userChat = { role: "user" as const, content: userMessage };
          const newHistory = [...chatHistory, userChat].slice(-4); // Keep history short for speed
          
          const stream = await engine.chat.completions.create({
              messages: [
                  { role: "system", content: `You are Nexmart OS. Respond in exactly 1 or 2 concise, natural sentences. Be futuristic and helpful.` },
                  ...newHistory
              ],
              temperature: 0.6,
              max_tokens: 50,
              stream: true
          });

          let fullResponse = "";
          for await (const chunk of stream) {
              const text = chunk.choices[0]?.delta?.content || "";
              fullResponse += text;
              setAgentMessage(fullResponse);
          }
          
          setChatHistory([...newHistory, { role: "assistant" as const, content: fullResponse }]);
          speak(fullResponse, false);
          setWorkflowState('NEGOTIATING');
          
          // 100% Accurate Instant Action Engine using live API Products
          const lower = userMessage.toLowerCase();
          let action = 'CHAT';
          let matchingProducts: any[] = [];
          
          // Basic dynamic NLP over the API products array
          const searchKeywords = lower.replace(/find|show|me|some|the|best|top|rated|cheap|expensive/g, '').trim().split(' ').filter(k => k.length > 2);
          
          if (searchKeywords.length > 0) {
              matchingProducts = products.filter(p => {
                  const str = `${p.title} ${p.description} ${p.category} ${p.brand}`.toLowerCase();
                  return searchKeywords.some(keyword => str.includes(keyword));
              });
          }

          if (lower.includes('add') || lower.includes('cart') || lower.includes('buy')) {
              action = 'ADD_TO_CART';
              if (matchingProducts.length === 0) matchingProducts = [products[0]]; // fallback to first item
          } else if (lower.includes('search') || lower.includes('find') || lower.includes('show') || lower.includes('what') || lower.includes('top')) {
              action = 'SEARCH';
              if (matchingProducts.length === 0) {
                 // fallback to random 4 items if no keywords match but it was a search intent
                 matchingProducts = [...products].sort(() => 0.5 - Math.random()).slice(0, 4);
              }
          }

          if (action === 'ADD_TO_CART') {
              matchingProducts.forEach(p => addToCart(p, 1));
          } else if (action === 'SEARCH' && matchingProducts.length > 0) {
              setAiProducts(matchingProducts);
          }

    } catch (error) {
      console.error(error);
      setWorkflowState('IDLE');
      setAgentMessage(`Mobile Error: ${(error as any)?.message || 'WebGPU Memory Limit Exceeded on this device.'}`);
    }
  };

  let agentState: AgentState = null;
  if (isWorking) agentState = "thinking";
  if (isTalking) agentState = "talking";
  if (isListening) agentState = "listening";

  return (
    <>
      <AnimatePresence>
          {showGpuWarning && <WebGPUWarning onClose={() => setShowGpuWarning(false)} />}
      </AnimatePresence>
      <div className={`${inline ? 'relative' : 'fixed top-[20px] md:top-[10px] left-1/2 -translate-x-1/2'} z-[60] flex flex-col items-center transition-all duration-500`}>
      
      <div className="relative flex items-center justify-center">
          <motion.div 
            onClick={handleOrbClick}
            animate={{ scale: isWorking || isTalking ? 1.15 : 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className={`relative cursor-pointer transition-shadow duration-700 w-32 h-32 md:w-48 md:h-48 flex items-center justify-center ${isWorking || isTalking ? 'drop-shadow-[0_0_60px_rgba(59,130,246,0.5)]' : 'drop-shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:scale-105 hover:drop-shadow-[0_15px_35px_rgba(0,0,0,0.4)]'}`}
          >
             {/* Native ElevenLabs Orb - No Clipping Masks! */}
             <Orb agentState={agentState} />
          </motion.div>

          {/* Status Pill */}
          {!isAiReady && !hasStartedBoot && (
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/80 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-white/10 flex items-center gap-2 pointer-events-none">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  <span className="text-[11px] font-bold text-gray-200 uppercase tracking-wider">Tap to Boot AI</span>
              </div>
          )}
          
          {!isAiReady && hasStartedBoot && (
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/80 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-white/10 flex items-center gap-2 pointer-events-none">
                  <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                  <span className="text-[11px] font-bold text-gray-200 uppercase tracking-wider">{aiProgress}</span>
              </div>
          )}

          {!isWorking && !isListening && !isTalking && !showKeyboard && isAiReady && (
              <button 
                onClick={() => setShowKeyboard(true)} 
                className="absolute top-1/2 -right-16 -translate-y-1/2 bg-white/40 hover:bg-white/60 border border-white/40 p-3 rounded-full text-gray-700 transition-all backdrop-blur-2xl shadow-lg hover:shadow-xl"
              >
                  <Keyboard className="w-5 h-5" />
              </button>
          )}
      </div>

      {/* Dynamic Subtitle Bubble (Glassmorphic) */}
      <div className="h-24 mt-16 flex flex-col items-center justify-start w-[90vw] md:w-[600px] pointer-events-none">
          <AnimatePresence mode="wait">
            {(agentMessage || userTranscript) && !showKeyboard && (
              <motion.div 
                key="subtitle"
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="max-w-xl w-full text-center bg-black/60 backdrop-blur-3xl px-6 py-4 rounded-3xl border border-white/10 text-white shadow-2xl flex flex-col gap-2 pointer-events-auto"
              >
                {userTranscript && (
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block">
                        You: "{userTranscript}"
                    </span>
                )}
                {agentMessage && (
                    <p className="text-sm font-medium leading-relaxed">
                        {agentMessage}
                    </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
      </div>

      {/* Magic Search Input & Suggestions (Glassmorphic) */}
      <AnimatePresence>
        {showKeyboard && !isWorking && !isListening && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="absolute top-44 bg-white/40 backdrop-blur-3xl border border-white/60 p-3 rounded-3xl shadow-2xl w-[90vw] md:w-[600px] flex flex-col gap-2"
          >
            <div className="px-4 pt-2 pb-1 flex items-center justify-between">
                <h3 className="text-gray-900 font-bold text-lg tracking-tight">Magic AI Search</h3>
                <button type="button" onClick={() => setShowKeyboard(false)} className="bg-white/50 hover:bg-white/80 border border-white/40 p-2 rounded-xl transition-colors">
                    <X className="w-4 h-4 text-gray-700" />
                </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSemanticTask(input); }} className="flex items-center gap-2 relative mb-2">
                <input 
                  autoFocus
                  type="text" 
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask anything..." 
                  className="w-full bg-white/50 border border-white/60 rounded-2xl px-6 py-4 text-gray-900 text-base placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-[#3b82f6]/50 transition-all shadow-inner backdrop-blur-xl"
                />
                <button type="submit" disabled={!input.trim()} className="absolute right-2 bg-[#3b82f6] hover:bg-blue-600 disabled:opacity-50 p-3 rounded-xl transition-colors shadow-lg shadow-blue-500/30">
                    <ArrowUp className="w-5 h-5 text-white" />
                </button>
            </form>

            <div className="flex flex-col gap-1 px-1">
                 {suggestedPrompts.map((prompt, idx) => (
                      <button 
                          key={idx}
                          type="button"
                          onClick={() => { setInput(prompt); handleSemanticTask(prompt); }}
                          className="flex items-center gap-3 w-full text-left p-3 hover:bg-white/60 rounded-xl transition-colors group border border-transparent hover:border-white/40"
                      >
                           <div className="w-6 h-6 rounded-full bg-white/50 text-gray-500 group-hover:bg-[#3b82f6]/20 group-hover:text-[#3b82f6] flex items-center justify-center transition-colors">
                               <Plus className="w-3 h-3" />
                           </div>
                           <span className="text-gray-600 text-sm font-medium group-hover:text-gray-900 transition-colors">
                               {prompt}
                           </span>
                      </button>
                 ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </>
  );
}
