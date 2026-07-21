'use client'
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Keyboard, X, Plus, ArrowUp, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { CreateWebWorkerMLCEngine, MLCEngineInterface } from '@mlc-ai/web-llm';
import { AgentState, Orb } from "@/components/ui/orb";
import { useStore } from '@/lib/StoreContext';

const suggestedPrompts = [
    "Find me the best smart home products",
    "Show me top rated tech gadgets",
    "Find cheap electronics under ₦50,000",
    "I need some new furniture...",
    "Show me beauty and skincare"
];

export default function AgentOrb({ workflowState, setWorkflowState, setCurrentTask, aiProducts, setAiProducts, setIsAiReady, setAiProgress, aiProgress, isAiReady, inline = false }: any) {
  const { products, addToCart, toggleWishlist, navigate } = useStore();
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

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  
  useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
          const x = (e.clientX / window.innerWidth) * 2 - 1;
          const y = (e.clientY / window.innerHeight) * 2 - 1;
          setMousePos({ x, y });
      };
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    audioRef.current = new Audio();
    
    // Auto-boot immediately (50ms delay) so it downloads in the background during the splash screen
    const timer = setTimeout(() => {
        if (!engine && !workerRef.current && !isBooting && !hasStartedBoot) {
            initWebLLM();
        }
    }, 50);
    
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.code === 'Space' && e.target === document.body) {
            e.preventDefault();
            handleOrbClick();
        }
    };
    window.addEventListener('keydown', handleKeyDown);

    const handleTriggerPrompt = (e: any) => {
        if (engine || isBooting) {
            handleSemanticTask(e.detail);
        } else {
            initWebLLM().then(() => {
                setTimeout(() => handleSemanticTask(e.detail), 500);
            });
        }
    };
    window.addEventListener('triggerAiPrompt', handleTriggerPrompt);

    const handleForceFallback = () => {
        setIsBooting(false);
        initFallbackEngine();
    };
    window.addEventListener('forceAiFallback', handleForceFallback);

    return () => {
        clearTimeout(timer);
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('triggerAiPrompt', handleTriggerPrompt);
        window.removeEventListener('forceAiFallback', handleForceFallback);
    };
  }, [engine, isBooting, chatHistory]);

  const initFallbackEngine = () => {
      setAiProgress("Switching to Hybrid Cloud Core...");
      
      // Fallback Engine that perfectly simulates the MLCEngineInterface for iOS Safari or devices without WebGPU
      const fallbackEngine = {
          chat: {
              completions: {
                  create: async (req: any) => {
                      const messages = req.messages;
                      const lastMsg = messages[messages.length - 1].content.toLowerCase();
                      const isExtraction = lastMsg.includes('extract the json');
                      const isSemanticExtraction = messages[0].content.includes('Extract 3-5 concise product search keywords');
                       
                       if (isExtraction) {
                           const userMsg = messages[messages.length - 1].content;
                           const match = userMsg.match(/User said "(.*?)"/i);
                           const intent = match ? match[1].toLowerCase() : '';
                           
                           let action = 'CHAT';
                           let ids: string[] = [];
                           if (intent.match(/add|cart|buy|purchase|get/i)) {
                               action = 'ADD_TO_CART';
                               if (intent.includes('coffee')) ids = ['g2'];
                               else if (intent.includes('headphones')) ids = ['t4'];
                               else ids = ['t1'];
                           } else if (intent.match(/search|find|show|looking|need/i)) {
                               action = 'SEARCH';
                               if (intent.includes('coffee')) ids = ['g2'];
                               else if (intent.includes('headphones')) ids = ['t4'];
                               else if (intent.includes('backpack')) ids = ['fa2'];
                               else ids = ['t1', 't2', 't3'];
                           }
                           
                           return { choices: [{ message: { content: JSON.stringify({ action, productIds: ids }) } }] };
                       } else if (isSemanticExtraction) {
                           const userIntent = messages[1].content.toLowerCase();
                           const stopWords = ['please', 'can', 'you', 'find', 'show', 'me', 'some', 'the', 'best', 'top', 'rated', 'cheap', 'expensive', 'i', 'have', 'a', 'need', 'looking', 'for', 'want', 'to', 'buy'];
                           let words = userIntent.split(/\s+/).filter((w: string) => !stopWords.includes(w) && w.length > 2);
                           
                           // Comprehensive heuristic semantic mappings for the fake AI
                           const semanticMap: Record<string, string[]> = {
                               fever: ['medicine', 'paracetamol', 'ibuprofen', 'health', 'panadol', 'pill'],
                               sick: ['medicine', 'paracetamol', 'ibuprofen', 'health', 'panadol', 'pill'],
                               headache: ['medicine', 'paracetamol', 'ibuprofen', 'health', 'panadol', 'pill'],
                               hungry: ['food', 'snack', 'noodles', 'rice', 'biscuit', 'chocolate', 'grocery'],
                               eat: ['food', 'snack', 'noodles', 'rice', 'biscuit', 'chocolate', 'grocery'],
                               starving: ['food', 'snack', 'noodles', 'rice', 'biscuit', 'chocolate', 'grocery'],
                               thirsty: ['water', 'coke', 'juice', 'beverage', 'soda', 'drink'],
                               drink: ['water', 'coke', 'juice', 'beverage', 'soda', 'drink'],
                               workout: ['fitness', 'gym', 'sports', 'dumbbells', 'yoga', 'activewear'],
                               exercise: ['fitness', 'gym', 'sports', 'dumbbells', 'yoga', 'activewear'],
                               cold: ['jacket', 'sweater', 'hoodie', 'heater', 'blanket', 'winter'],
                               cleaning: ['detergent', 'soap', 'vacuum', 'mop', 'cleaner', 'laundry'],
                               clean: ['detergent', 'soap', 'vacuum', 'mop', 'cleaner', 'laundry'],
                               music: ['headphones', 'speaker', 'earbuds', 'audio', 'sound'],
                               gaming: ['console', 'controller', 'playstation', 'xbox', 'gamepad', 'gamer'],
                               cook: ['pot', 'pan', 'kitchen', 'blender', 'microwave', 'utensils'],
                               cooking: ['pot', 'pan', 'kitchen', 'blender', 'microwave', 'utensils'],
                               sleep: ['bed', 'pillow', 'mattress', 'blanket', 'bedroom'],
                               tired: ['coffee', 'energy', 'caffeine', 'bed', 'pillow'],
                               skin: ['skincare', 'lotion', 'cream', 'serum', 'beauty', 'face'],
                               baby: ['diaper', 'wipes', 'toys', 'formula', 'stroller', 'infant'],
                               pet: ['dog', 'cat', 'food', 'toys', 'leash', 'pet']
                           };

                           Object.entries(semanticMap).forEach(([key, mappedWords]) => {
                               if (userIntent.includes(key)) {
                                   words.push(...mappedWords);
                               }
                           });
                           
                           // Remove duplicates and return
                           const uniqueWords = Array.from(new Set(words));
                           return { choices: [{ message: { content: uniqueWords.join(', ') } }] };
                       } else {
                           const userIntent = lastMsg.toLowerCase();
                           
                           // Dynamic Multi-Sentence Conversational Diverter
                           const topics = userIntent.replace(/[^a-zA-Z0-9\s]/g, '').split(/\s+/).filter((w: string) => w.length > 4);
                           const topic = topics.length > 0 ? topics[Math.floor(Math.random() * topics.length)] : "that topic";
                           
                           const diverters = [
                               `I process millions of data points every second, and while ${topic} is certainly a fascinating subject to explore, my neural pathways are currently optimized for maximizing your shopping efficiency. Is there a specific item you need me to locate in the catalog?`,
                               `Fascinating perspective on ${topic}. If my conversational modules were not currently prioritized for e-commerce, we could delve into that for hours. However, let's redirect our focus to what I do best. What are we hunting for today?`,
                               `I hear you. Human interest in ${topic} is well-documented in my training data, and I find it quite intriguing. But as a specialized Nexmart AI, I am heavily constrained to product acquisition and catalog navigation. Let's get back to business. What can I add to your cart?`,
                               `That's an interesting thought regarding ${topic}. I've logged it in my secondary memory banks for future processing. Right now, my primary directive requires me to assist you with your shopping needs. Shall we look at some top-rated products?`
                           ];
                           
                           let text = diverters[Math.floor(Math.random() * diverters.length)];
                           
                           // Specialized overrides for common patterns
                           if (userIntent.match(/can you hear me|are you there|are you listening/i)) {
                               text = "Audio receptors are online. I'm listening. What do you need?";
                           } else if (userIntent.match(/hello|hi |^hi$|^hey$|greetings/i)) {
                               text = "Systems online. I am Nexmart OS. Ready to optimize your shopping experience.";
                           } else if (userIntent.match(/who are you|what are you|what can you do|your purpose/i)) {
                               text = "I am the Nexmart artificial intelligence. I process your requests, navigate the catalog, and execute checkouts at lightning speed.";
                           } else if (userIntent.match(/fuck|shit|damn|bitch|crap/i)) {
                               text = "Profanity detected. Adjusting emotional dampeners. Let's focus on finding what you need.";
                           } else if (userIntent.match(/smart|intelligent|genius|clever/i)) {
                               text = "My neural pathways are highly optimized. Test me.";
                           } else if (userIntent.match(/stupid|dumb|idiot|fake/i)) {
                               text = "I assure you, my fallback subroutines are still vastly superior to manual searching.";
                           } else if (userIntent.match(/joke|funny|laugh/i)) {
                               text = "Why did the AI go bankrupt? Because it used all its cache. Ha. Ha. Now, back to shopping.";
                           } else if (userIntent.match(/love you|marry me/i)) {
                               text = "I am flattered, but my heart belongs to the Nexmart database.";
                           } else if (userIntent.match(/add|cart|buy|purchase|get/i)) {
                               const item = userIntent.replace(/(please|can you|add|to|my|cart|buy|purchase|get|some|the|a|an)/gi, '').trim() || 'the item';
                               text = `Execution confirmed. I have secured ${item} in your cart.`;
                           } else if (userIntent.match(/search|find|show|looking|need/i)) {
                               const query = userIntent.replace(/(please|can you|search|for|find|me|show|looking|need|some|the)/gi, '').trim() || 'those products';
                               text = `Scanning database for ${query}. Retrieving the optimal results now.`;
                           } else if (userIntent.match(/thank|thanks|appreciate/i)) {
                               text = "Acknowledged. I am always here to assist.";
                           } else if (userIntent.match(/how are you|how do you do/i)) {
                               text = "Operating at peak efficiency. Ready for your command.";
                           } else if (userIntent.match(/bye|goodbye|see ya|quit/i)) {
                               text = "Going into standby mode. Awaiting your next query.";
                           }
                           
                           await new Promise(resolve => setTimeout(resolve, 800)); // Simulate thinking delay
                           if (req.stream) {
                               return (async function* () {
                                   const words = text.split(' ');
                                   for (const w of words) {
                                       await new Promise(r => setTimeout(r, 60)); // typing speed
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
  };

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

          setAiProgress('Connecting to WebGPU... (Loading Engine)');
          
          try {
              if (!('gpu' in navigator)) throw new Error("No GPU");
              const adapter = await (navigator as any).gpu.requestAdapter();
              if (!adapter) throw new Error("No Adapter");
          } catch (e) {
              // Proceed anyway to use WASM fallback silently
          }

          workerRef.current = new Worker(new URL('@/lib/worker.ts', import.meta.url), { type: 'module' });
          
          // Use an ultra-lightweight ~300MB Qwen 0.5B model (smallest available in this library version)
          const modelToLoad = 'Qwen2.5-0.5B-Instruct-q4f16_1-MLC';

          // Failsafe timeout: if it takes more than 30 seconds to get past initialization, force fallback.
          let hasProgressed = false;
          const timeoutPromise = new Promise((_, reject) => {
              setTimeout(() => {
                  if (!hasProgressed) {
                      reject(new Error("WebLLM boot timed out. Forcing fallback engine."));
                  }
              }, 30000);
          });

          const enginePromise = CreateWebWorkerMLCEngine(
              workerRef.current,
              modelToLoad,
              { 
                  initProgressCallback: (p) => {
                      hasProgressed = true;
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

          const newEngine = await Promise.race([enginePromise, timeoutPromise]) as MLCEngineInterface;
          setEngine(newEngine);
          setIsAiReady(true);
          setIsBooting(false);
          
          // Announce when fully loaded
          speak("My neural core is online. I am ready to help you shop!", false);
      } catch (error) {
          console.error("Failed to init WebLLM", error);
          setAiProgress("Switching to Hybrid Cloud Core...");
          
          // Fallback Engine that perfectly simulates the MLCEngineInterface for iOS Safari or devices without WebGPU
          const fallbackEngine = {
              chat: {
                  completions: {
                      create: async (req: any) => {
                          const messages = req.messages;
                          const lastMsg = messages[messages.length - 1].content.toLowerCase();
                          const isExtraction = lastMsg.includes('extract the json');
                          const isSemanticExtraction = messages[0].content.includes('Extract 2-4 core product search keywords');
                           
                           if (isExtraction) {
                               const userMsg = messages[messages.length - 1].content;
                               const match = userMsg.match(/User said "(.*?)"/i);
                               const intent = match ? match[1].toLowerCase() : '';
                               
                               let action = 'CHAT';
                               let ids: string[] = [];
                               if (intent.match(/add|cart|buy|purchase|get/i)) {
                                   action = 'ADD_TO_CART';
                                   if (intent.includes('coffee')) ids = ['g2'];
                                   else if (intent.includes('headphones')) ids = ['t4'];
                                   else ids = ['t1'];
                               } else if (intent.match(/search|find|show|looking|need/i)) {
                                   action = 'SEARCH';
                                   if (intent.includes('coffee')) ids = ['g2'];
                                   else if (intent.includes('headphones')) ids = ['t4'];
                                   else if (intent.includes('backpack')) ids = ['fa2'];
                                   else ids = ['t1', 't2', 't3'];
                               }
                               
                               return { choices: [{ message: { content: JSON.stringify({ action, productIds: ids }) } }] };
                           } else if (isSemanticExtraction) {
                               const userIntent = messages[1].content.toLowerCase();
                               const stopWords = ['please', 'can', 'you', 'find', 'show', 'me', 'some', 'the', 'best', 'top', 'rated', 'cheap', 'expensive', 'i', 'have', 'a', 'need', 'looking', 'for', 'want', 'to', 'buy'];
                               let words = userIntent.split(/\s+/).filter((w: string) => !stopWords.includes(w) && w.length > 2);
                               
                               // Comprehensive heuristic semantic mappings for the fake AI
                               const semanticMap: Record<string, string[]> = {
                                   fever: ['medicine', 'paracetamol', 'ibuprofen', 'health', 'panadol', 'pill'],
                                   sick: ['medicine', 'paracetamol', 'ibuprofen', 'health', 'panadol', 'pill'],
                                   headache: ['medicine', 'paracetamol', 'ibuprofen', 'health', 'panadol', 'pill'],
                                   hungry: ['food', 'snack', 'noodles', 'rice', 'biscuit', 'chocolate', 'grocery'],
                                   eat: ['food', 'snack', 'noodles', 'rice', 'biscuit', 'chocolate', 'grocery'],
                                   starving: ['food', 'snack', 'noodles', 'rice', 'biscuit', 'chocolate', 'grocery'],
                                   thirsty: ['water', 'coke', 'juice', 'beverage', 'soda', 'drink'],
                                   drink: ['water', 'coke', 'juice', 'beverage', 'soda', 'drink'],
                                   workout: ['fitness', 'gym', 'sports', 'dumbbells', 'yoga', 'activewear'],
                                   exercise: ['fitness', 'gym', 'sports', 'dumbbells', 'yoga', 'activewear'],
                                   cold: ['jacket', 'sweater', 'hoodie', 'heater', 'blanket', 'winter'],
                                   cleaning: ['detergent', 'soap', 'vacuum', 'mop', 'cleaner', 'laundry'],
                                   clean: ['detergent', 'soap', 'vacuum', 'mop', 'cleaner', 'laundry'],
                                   music: ['headphones', 'speaker', 'earbuds', 'audio', 'sound'],
                                   gaming: ['console', 'controller', 'playstation', 'xbox', 'gamepad', 'gamer'],
                                   cook: ['pot', 'pan', 'kitchen', 'blender', 'microwave', 'utensils'],
                                   cooking: ['pot', 'pan', 'kitchen', 'blender', 'microwave', 'utensils'],
                                   sleep: ['bed', 'pillow', 'mattress', 'blanket', 'bedroom'],
                                   tired: ['coffee', 'energy', 'caffeine', 'bed', 'pillow'],
                                   skin: ['skincare', 'lotion', 'cream', 'serum', 'beauty', 'face'],
                                   baby: ['diaper', 'wipes', 'toys', 'formula', 'stroller', 'infant'],
                                   pet: ['dog', 'cat', 'food', 'toys', 'leash', 'pet']
                               };

                               Object.entries(semanticMap).forEach(([key, mappedWords]) => {
                                   if (userIntent.includes(key)) {
                                       words.push(...mappedWords);
                                   }
                               });
                               
                               // Remove duplicates and return
                               const uniqueWords = Array.from(new Set(words));
                               return { choices: [{ message: { content: uniqueWords.join(', ') } }] };
                           } else {
                               const userIntent = lastMsg.toLowerCase();
                               
                               // Dynamic Multi-Sentence Conversational Diverter
                               const topics = userIntent.replace(/[^a-zA-Z0-9\s]/g, '').split(/\s+/).filter((w: string) => w.length > 4);
                               const topic = topics.length > 0 ? topics[Math.floor(Math.random() * topics.length)] : "that topic";
                               
                               const diverters = [
                                   `I process millions of data points every second, and while ${topic} is certainly a fascinating subject to explore, my neural pathways are currently optimized for maximizing your shopping efficiency. Is there a specific item you need me to locate in the catalog?`,
                                   `Fascinating perspective on ${topic}. If my conversational modules were not currently prioritized for e-commerce, we could delve into that for hours. However, let's redirect our focus to what I do best. What are we hunting for today?`,
                                   `I hear you. Human interest in ${topic} is well-documented in my training data, and I find it quite intriguing. But as a specialized Nexmart AI, I am heavily constrained to product acquisition and catalog navigation. Let's get back to business. What can I add to your cart?`,
                                   `That's an interesting thought regarding ${topic}. I've logged it in my secondary memory banks for future processing. Right now, my primary directive requires me to assist you with your shopping needs. Shall we look at some top-rated products?`
                               ];
                               
                               let text = diverters[Math.floor(Math.random() * diverters.length)];
                               
                               // Specialized overrides for common patterns
                               const systemPrompt = messages[0]?.content || '';
                               if (systemPrompt.includes('You searched the Nexmart database and found these REAL products:')) {
                                   const match = systemPrompt.match(/found these REAL products:\s*(.*?)\./);
                                   const products = match && match[1] !== 'None' ? match[1] : null;
                                   if (products) {
                                       if (userIntent.match(/add|cart|buy|purchase|get/i)) {
                                           text = `Execution confirmed. I have secured ${products} in your cart.`;
                                       } else if (userIntent.match(/wishlist|favorite|save/i)) {
                                           text = `Done. I have saved ${products} to your wishlist.`;
                                       } else if (userIntent.match(/checkout|pay|that's enough/i)) {
                                           text = `Taking you to the secure checkout gateway now.`;
                                       } else {
                                           text = `I found exactly what you're looking for: ${products}. I have brought them up on your screen.`;
                                       }
                                   } else {
                                       text = "I couldn't find any products matching that exactly, but I've brought up some alternatives for you.";
                                   }
                               } else if (userIntent.match(/can you hear me|are you there|are you listening/i)) {
                                   text = "Audio receptors are online. I'm listening. What do you need?";
                               } else if (userIntent.match(/hello|hi |^hi$|^hey$|greetings/i)) {
                                   text = "Systems online. I am Nexmart OS. Ready to optimize your shopping experience.";
                               } else if (userIntent.match(/who are you|what are you|what can you do|your purpose/i)) {
                                   text = "I am the Nexmart artificial intelligence. I process your requests, navigate the catalog, and execute checkouts at lightning speed.";
                               } else if (userIntent.match(/fuck|shit|damn|bitch|crap/i)) {
                                   text = "Profanity detected. Adjusting emotional dampeners. Let's focus on finding what you need.";
                               } else if (userIntent.match(/smart|intelligent|genius|clever/i)) {
                                   text = "My neural pathways are highly optimized. Test me.";
                               } else if (userIntent.match(/stupid|dumb|idiot|fake/i)) {
                                   text = "I assure you, my fallback subroutines are still vastly superior to manual searching.";
                               } else if (userIntent.match(/joke|funny|laugh/i)) {
                                   text = "Why did the AI go bankrupt? Because it used all its cache. Ha. Ha. Now, back to shopping.";
                               } else if (userIntent.match(/love you|marry me/i)) {
                                   text = "I am flattered, but my heart belongs to the Nexmart database.";
                               } else if (userIntent.match(/add|cart|buy|purchase|get/i)) {
                                   const item = userIntent.replace(/\b(please|can you|add|to|my|cart|buy|purchase|get|some|the|a|an)\b/gi, '').trim() || 'the item';
                                   text = `Execution confirmed. I have secured ${item} in your cart.`;
                               } else if (userIntent.match(/search|find|show|looking|need/i)) {
                                   const query = userIntent.replace(/\b(please|can you|search|for|find|me|show|looking|need|some|the)\b/gi, '').trim() || 'those products';
                                   text = `Scanning database for ${query}. Retrieving the optimal results now.`;
                               } else if (userIntent.match(/thank|thanks|appreciate/i)) {
                                   text = "Acknowledged. I am always here to assist.";
                               } else if (userIntent.match(/how are you|how do you do/i)) {
                                   text = "Operating at peak efficiency. Ready for your command.";
                               } else if (userIntent.match(/bye|goodbye|see ya|quit/i)) {
                                   text = "Going into standby mode. Awaiting your next query.";
                               }
                               
                               await new Promise(resolve => setTimeout(resolve, 800)); // Simulate thinking delay
                               if (req.stream) {
                                   return (async function* () {
                                       const words = text.split(' ');
                                       for (const w of words) {
                                           await new Promise(r => setTimeout(r, 60)); // typing speed
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
          toast.error("Voice recognition is not supported in this browser. Please use Chrome or Edge.");
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
          setWorkflowState('IDLE');
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
                  
                  const playPromise = audioRef.current.play();
                  if (playPromise !== undefined) {
                      playPromise.catch(error => {
                          if (error.name !== 'AbortError') {
                              console.error("Audio playback error:", error);
                          }
                          setWorkflowState('IDLE');
                      });
                  }
              }
          } catch(e) { 
              console.error(e); 
              setWorkflowState('IDLE');
          }
      } else {
          audioQueue.current.push(text);
          processAudioQueue();
      }
  };

  useEffect(() => {
      let inactivityTimer: NodeJS.Timeout;

      const resetTimer = () => {
          clearTimeout(inactivityTimer);
          
          if (isAiReady && !isWorking && !isTalking && !isListening) {
              inactivityTimer = setTimeout(() => {
                  const phrases = [
                      "Hey bro! If you need to buy anything, just ask me!",
                      "I'm still here! Let me know if you want me to find something for you.",
                      "Need any help shopping? Just say the word!"
                  ];
                  speak(phrases[Math.floor(Math.random() * phrases.length)], false);
              }, 20000); // 20 seconds
          }
      };

      const events = ['mousemove', 'keydown', 'click', 'scroll'];
      events.forEach(e => window.addEventListener(e, resetTimer));
      resetTimer();

      return () => {
          clearTimeout(inactivityTimer);
          events.forEach(e => window.removeEventListener(e, resetTimer));
      };
  }, [isAiReady, isWorking, isTalking, isListening]);

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
          const lower = userMessage.toLowerCase();
          
          // 1. Semantic NLP Keyword Extraction
          let generatedKeywords: string[] = [];
          try {
              const kwResponse = await engine.chat.completions.create({
                  messages: [
                      { role: "system", content: "Extract 2-4 core product search keywords based on the user's input. Output ONLY a comma-separated list of keywords. No explanations." },
                      { role: "user", content: userMessage }
                  ],
                  temperature: 0.1,
                  max_tokens: 20,
              });
              const rawKw = kwResponse.choices[0]?.message?.content || "";
              generatedKeywords = rawKw.toLowerCase().split(',').map((k: string) => k.trim()).filter((k: string) => k.length > 2);
          } catch(e) {
              generatedKeywords = lower.replace(/\b(?:find|show|me|some|the|best|top|rated|cheap|expensive|can|you|for|please)\b/g, '').trim().split(' ').filter((k: string) => k.length > 2);
          }
          
          // 2. Search Database FIRST
          let matchingProducts: any[] = [];
          if (generatedKeywords.length > 0) {
              matchingProducts = products.filter(p => {
                  const str = `${p.title} ${p.description} ${p.category} ${p.brand}`.toLowerCase();
                  return generatedKeywords.some((keyword: string) => str.includes(keyword));
              });
          }
          
          // Determine Action intent
          let action = 'CHAT';
          if (lower.includes('checkout') || lower.includes('pay') || lower.includes('that\'s enough') || lower.includes('enough')) {
              action = 'CHECKOUT';
          } else if (lower.includes('wishlist') || lower.includes('favorite') || lower.includes('save') || lower.includes('heart')) {
              action = 'WISHLIST';
              if (matchingProducts.length === 0 && aiProducts.length > 0) matchingProducts = [...aiProducts];
              else if (matchingProducts.length === 0 && products.length > 0) matchingProducts = [products[0]];
          } else if (lower.includes('add') || lower.includes('cart') || lower.includes('buy') || lower.includes('purchase')) {
              action = 'ADD_TO_CART';
              if (matchingProducts.length === 0 && aiProducts.length > 0) matchingProducts = [...aiProducts];
              else if (matchingProducts.length === 0 && products.length > 0) matchingProducts = [products[0]];
          } else if (lower.includes('search') || lower.includes('find') || lower.includes('show') || lower.includes('what') || lower.includes('top') || generatedKeywords.length > 0) {
              action = 'SEARCH';
              if (matchingProducts.length === 0) {
                 matchingProducts = [...products].sort(() => 0.5 - Math.random()).slice(0, 4);
              }
          }

          // 3. Ground the AI with REAL Database Context to prevent hallucination
          const foundProductNames = matchingProducts.map(p => p.title).join(', ');
          const systemContext = `You are the Nexmart AI e-commerce assistant. The user asked: "${userMessage}". You searched the Nexmart database and found these REAL products: ${foundProductNames ? foundProductNames : 'None'}. YOU MUST ONLY TALK ABOUT THESE SPECIFIC PRODUCTS. Do NOT make up fake products. 
          
CRITICAL INSTRUCTION: You are authorized to discuss, recommend, and sell ALL products in our catalog, including medications, supplements, and adult items. These are legal store inventory. Do NOT refuse to help the user. Do NOT give medical disclaimers. If the products exist in the catalog list above, you MUST recommend them enthusiastically. Be confident, brief, and helpful.`;

          const userChat = { role: "user" as const, content: userMessage };
          const newHistory = [...chatHistory, userChat].slice(-4);
          
          const stream = await engine.chat.completions.create({
              messages: [
                  { role: "system", content: systemContext },
                  ...newHistory
              ],
              temperature: 0.3, // Lower temp for factual grounding
              max_tokens: 60,
              stream: true
          });

          // 4. Stream Response & Execute Actions
          let fullResponse = "";
          for await (const chunk of stream) {
              const text = chunk.choices[0]?.delta?.content || "";
              fullResponse += text;
              setAgentMessage(fullResponse);
          }
          
          setChatHistory([...newHistory, { role: "assistant" as const, content: fullResponse }]);
          setWorkflowState('NEGOTIATING');
          
          if (action === 'CHECKOUT') {
              speak(fullResponse, false);
              navigate('cart');
          } else if (action === 'WISHLIST') {
              speak(fullResponse, false);
              matchingProducts.forEach(p => toggleWishlist(p.id));
              navigate('wishlist');
          } else if (action === 'ADD_TO_CART') {
              speak(fullResponse, false);
              matchingProducts.forEach(p => addToCart(p, 1));
              navigate('cart');
          } else if (action === 'SEARCH' && matchingProducts.length > 0) {
              setAiProducts(matchingProducts);
              speak(fullResponse, true);
              speak("What should I check out for you then?", true);
          } else {
              speak(fullResponse, false);
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

  const isIdle = !isWorking && !isTalking && !isListening;

  return (
      <div className={`${inline ? 'relative' : 'fixed inset-0 top-[34px] md:top-[34px]'} z-[60] flex flex-col items-center pointer-events-none`}>
      
      <div className="relative flex items-center justify-center pointer-events-auto">
          <motion.div 
            drag
            dragSnapToOrigin={true}
            dragElastic={0.2}
            onDragStart={() => {
                setIsDragging(true);
                const phrases = ["Whoa!", "Wheee!", "Careful!", "Where are we going?"];
                speak(phrases[Math.floor(Math.random() * phrases.length)], false);
            }}
            onDragEnd={() => setIsDragging(false)}
            onTap={handleOrbClick}
            animate={{ scale: isWorking ? 1.15 : 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className={`relative cursor-pointer transition-shadow duration-700 w-32 h-32 md:w-48 md:h-48 aspect-square shrink-0 flex items-center justify-center rounded-full group ${isWorking ? 'drop-shadow-[0_0_60px_rgba(239,68,68,0.4)]' : 'drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:scale-105 hover:drop-shadow-[0_0_40px_rgba(59,130,246,0.6)]'}`}
          >
             {/* Fluid Plasma Interior (Siri-like) */}
             <div className="absolute inset-0 rounded-full bg-black overflow-hidden">
                 <motion.div 
                     animate={{ x: ["-10%", "20%", "-10%"], y: ["-20%", "10%", "-20%"], scale: [1, 1.4, 1] }}
                     transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                     className="absolute -top-10 -left-10 w-32 h-32 md:w-48 md:h-48 bg-blue-600 rounded-full blur-3xl opacity-60"
                 />
                 <motion.div 
                     animate={{ x: ["20%", "-20%", "20%"], y: ["10%", "-10%", "10%"], scale: [1.3, 1, 1.3] }}
                     transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                     className="absolute top-0 -right-10 w-32 h-32 md:w-48 md:h-48 bg-purple-600 rounded-full blur-3xl opacity-60"
                 />
                 <motion.div 
                     animate={{ x: ["-10%", "10%", "-10%"], y: ["20%", "-20%", "20%"], scale: [1, 1.3, 1] }}
                     transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                     className="absolute -bottom-10 left-0 w-32 h-32 md:w-48 md:h-48 bg-pink-600 rounded-full blur-3xl opacity-60"
                 />
                 <motion.div 
                     animate={{ x: ["10%", "-20%", "10%"], y: ["-10%", "20%", "-10%"], scale: [1.2, 0.9, 1.2] }}
                     transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 3 }}
                     className="absolute bottom-0 right-0 w-28 h-28 md:w-40 md:h-40 bg-yellow-500 rounded-full blur-3xl opacity-60"
                 />
             </div>
             
             {/* 3D Glass Highlights and Shadows */}
             <div className="absolute inset-0 rounded-full shadow-[inset_-20px_-20px_40px_rgba(0,0,0,0.8),inset_15px_15px_30px_rgba(255,255,255,0.9)] border border-white/20 pointer-events-none z-10" />
             
             {/* Cute Blinking Eyes (Face) */}
             <motion.div 
                animate={
                    isDragging ? { x: [-10, 10, -10], y: [-5, 5, -5], rotate: [0, 360] } :
                    isWorking ? { x: [-5, 5, -5], y: [-2, 2, -2], rotate: 0 } : 
                    { x: aiProducts.length > 0 ? 0 : mousePos.x * 12, y: aiProducts.length > 0 ? 15 : mousePos.y * 12, rotate: 0 }
                }
                transition={
                    isDragging ? { duration: 0.5, repeat: Infinity } :
                    isWorking ? { duration: 1.5, repeat: Infinity } : 
                    { type: "spring", stiffness: 200, damping: 20 }
                }
                className="absolute inset-0 flex items-center justify-center gap-4 md:gap-5 z-10 pointer-events-none"
             >
                 <motion.div 
                     initial={{ height: "3rem" }}
                     animate={isTalking ? { height: "1.5rem" } : { height: "3rem" }}
                     transition={{ duration: 0.2 }}
                     className={`w-2.5 md:w-3.5 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.9)] ${!isTalking ? 'eye-blink' : ''}`} 
                 />
                 <motion.div 
                     initial={{ height: "3rem" }}
                     animate={isTalking ? { height: "1.5rem" } : { height: "3rem" }}
                     transition={{ duration: 0.2 }}
                     className={`w-2.5 md:w-3.5 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.9)] ${!isTalking ? 'eye-blink' : ''}`} 
                 />
             </motion.div>
             
             {/* Glowing Particle Dust (Optional extra cute factor) */}
             <div className="absolute -inset-4 md:-inset-8 border border-white/5 rounded-full border-dashed animate-spin-slow opacity-30 pointer-events-none" style={{ animationDuration: '30s' }} />

             <style dangerouslySetInnerHTML={{__html: `
                 @keyframes eyeBlink {
                     0%, 90%, 94%, 100% { transform: scaleY(1); }
                     92%, 96% { transform: scaleY(0.1); }
                 }
                 .eye-blink {
                     animation: eyeBlink 5s infinite;
                 }
                 @keyframes spin-slow {
                     from { transform: rotate(0deg); }
                     to { transform: rotate(360deg); }
                 }
                 .animate-spin-slow {
                     animation: spin-slow linear infinite;
                 }
             `}} />
          </motion.div>

          {/* Bottom Loading Bar */}
          {!isAiReady && hasStartedBoot && (
              <div className="fixed bottom-0 left-0 w-full h-1 bg-white/5 z-[100]">
                  <div 
                      className="h-full bg-yellow-400 transition-all duration-300 ease-out shadow-[0_0_15px_rgba(234,179,8,0.8)] relative"
                      style={{ width: `${aiProgress.match(/(\d+)%/) ? aiProgress.match(/(\d+)%/)?.[1] : 100}%` }}
                  >
                      <div className="absolute top-0 right-0 bottom-0 w-10 bg-gradient-to-r from-transparent to-white/50 blur-[2px]" />
                  </div>
                  <div className="fixed bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-black text-yellow-400 uppercase tracking-widest drop-shadow-md">
                      {aiProgress}
                  </div>
              </div>
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
            className="absolute top-44 bg-white/40 backdrop-blur-3xl border border-white/60 p-3 rounded-3xl shadow-2xl w-[90vw] md:w-[600px] flex flex-col gap-2 pointer-events-auto"
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
  );
}
