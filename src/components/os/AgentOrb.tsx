'use client'
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Keyboard, X, Plus, ArrowUp, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { CreateWebWorkerMLCEngine, MLCEngineInterface } from '@mlc-ai/web-llm';
import { AgentState, Orb } from "@/components/ui/orb";
import { useStore } from '@/lib/StoreContext';
import { parseQueryIntent, StructuredIntent } from '@/lib/taxonomy';
import { normalizeTaxonomyTerm } from '@/lib/normalizer';
import { SEARCH_SCORES } from '@/lib/searchConstants';
import { SearchService } from '@/lib/SearchService';
import { SearchContextManager } from '@/lib/SearchContextManager';
import { ResultRefinementEngine } from '@/lib/ResultRefinementEngine';
import { IntentRouter, IntentType } from '@/lib/IntentRouter';
import { ResultActionEngine, ActionType } from '@/lib/ResultActionEngine';
import { useClerk } from '@clerk/nextjs';

const suggestedPrompts = [
    "Find me the best smart home products",
    "Show me top rated tech gadgets",
    "Find cheap electronics under ₦50,000",
    "I need some new furniture...",
    "Show me beauty and skincare"
];

export default function AgentOrb({ workflowState, setWorkflowState, setCurrentTask, aiProducts, setAiProducts, setIsAiReady, setAiProgress, aiProgress, isAiReady, inline = false }: any) {
  const { products, cart, addToCart, removeFromCart, clearCart, toggleWishlist, navigate, setComparisonProducts, setAuthModalOpen, setSearchQuery, activeView } = useStore();
  const clerk = useClerk();
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
              await speak("My hybrid core is online and ready.", true);
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
                  await speak("Welcome to Nexmart... the smart way of shopping. I am your AI assistant. Please wait while I download my neural core...", true);
              } catch(err) {
                  console.warn("Autoplay blocked. User needs to interact with page first.");
              }
          };
          playWelcome();

          const isMobileDevice = typeof window !== 'undefined' && (
              /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || 
              (window.matchMedia && window.matchMedia('(max-width: 768px)').matches)
          );

          if (isMobileDevice || !('gpu' in navigator)) {
              console.log("Mobile device or no WebGPU detected. Using lightweight Hybrid Cloud Core fallback to prevent memory crashes.");
              initFallbackEngine();
              return;
          }

          setAiProgress('Connecting to WebGPU... (Loading Engine)');
          
          try {
              const adapter = await (navigator as any).gpu.requestAdapter();
              if (!adapter) {
                  console.log("No GPU Adapter found. Switching to Hybrid Cloud Core fallback.");
                  initFallbackEngine();
                  return;
              }
          } catch (e) {
              console.log("WebGPU check failed. Switching to Hybrid Cloud Core fallback.", e);
              initFallbackEngine();
              return;
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
          speak("My neural core is online. I am ready to help you shop!", true);
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
                                   fever: ['medicine', 'paracetamol', 'ibuprofen', 'health', 'panadol', 'pill', 'medical'],
                                   sick: ['medicine', 'paracetamol', 'ibuprofen', 'health', 'panadol', 'pill', 'medical'],
                                   headache: ['medicine', 'paracetamol', 'ibuprofen', 'health', 'panadol', 'pill', 'medical'],
                                   hungry: ['food', 'snack', 'noodles', 'rice', 'biscuit', 'chocolate', 'grocery', 'groceries'],
                                   eat: ['food', 'snack', 'noodles', 'rice', 'biscuit', 'chocolate', 'grocery', 'groceries'],
                                   starving: ['food', 'snack', 'noodles', 'rice', 'biscuit', 'chocolate', 'grocery', 'groceries'],
                                   thirsty: ['water', 'coke', 'juice', 'beverage', 'soda', 'drink', 'groceries'],
                                   drink: ['water', 'coke', 'juice', 'beverage', 'soda', 'drink', 'groceries'],
                                   workout: ['fitness', 'gym', 'sports', 'dumbbells', 'yoga', 'activewear'],
                                   exercise: ['fitness', 'gym', 'sports', 'dumbbells', 'yoga', 'activewear'],
                                   cold: ['jacket', 'sweater', 'hoodie', 'heater', 'blanket', 'winter', 'fashion'],
                                   cleaning: ['detergent', 'soap', 'vacuum', 'mop', 'cleaner', 'laundry', 'home'],
                                   clean: ['detergent', 'soap', 'vacuum', 'mop', 'cleaner', 'laundry', 'home'],
                                   music: ['headphones', 'speaker', 'earbuds', 'audio', 'sound', 'electronics'],
                                   gaming: ['console', 'controller', 'playstation', 'xbox', 'gamepad', 'gamer', 'electronics'],
                                   cook: ['pot', 'pan', 'kitchen', 'blender', 'microwave', 'utensils', 'home', 'appliances'],
                                   cooking: ['pot', 'pan', 'kitchen', 'blender', 'microwave', 'utensils', 'home', 'appliances'],
                                   sleep: ['bed', 'pillow', 'mattress', 'blanket', 'bedroom', 'home'],
                                   tired: ['coffee', 'energy', 'caffeine', 'bed', 'pillow', 'groceries'],
                                   skin: ['skincare', 'lotion', 'cream', 'serum', 'beauty', 'face', 'makeup'],
                                   makeup: ['lipstick', 'foundation', 'mascara', 'eyeshadow', 'beauty', 'cosmetics'],
                                   baby: ['diaper', 'wipes', 'toys', 'formula', 'stroller', 'infant', 'kids', 'fashion'],
                                   pet: ['dog', 'cat', 'food', 'toys', 'leash', 'pet', 'home']
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
                               if (systemPrompt.includes('You are the Nexmart AI e-commerce assistant. You found these products:')) {
                                   const match = systemPrompt.match(/found these products:\s*(.*?)\./);
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
                               } else if (systemPrompt.includes('We currently have 0 matching products in stock')) {
                                   text = "I'm sorry, but we currently don't have any products matching your request in stock at the moment.";
                               } else if (systemPrompt.includes('The user is asking a follow-up question about these exact products:')) {
                                   text = "Based on the products on your screen, they are all excellent choices. Let me know which one you prefer.";
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
                  await speak("My hybrid core is online and ready.", true);
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
              console.warn("Speech Recognition Error:", e.error || e.message || e);
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

  // Inactivity timer removed to prevent audio queue race conditions

  const handleSemanticTask = async (userMessage: string) => {
    if (!engine || !userMessage.trim()) return;
    
    setCurrentTask(userMessage);
    setInput('');
    setShowKeyboard(false);
    setUserTranscript(userMessage);
    setWorkflowState('RESEARCHING');
    setAgentMessage('');
      try {
          const lower = userMessage.toLowerCase();
          
          // --- INTENT ROUTING ---
          const routingDecision = IntentRouter.route(userMessage);
          
          let action = routingDecision.action || 'CHAT';
          let matchingProducts: any[] = [];

          // Execute Cart Modifications immediately (completely bypasses product catalog search)
          if (action === 'CART_MODIFICATION') {
              let response = "";
              
              if (lower.includes('clear') || lower.includes('empty')) {
                  clearCart();
                  response = "I have completely cleared your cart. What would you like to do next?";
              } else {
                  const isKeeping = lower.includes('keep') || lower.includes('except') || lower.includes('apart from') || lower.includes('leave') || lower.includes('retain');
                  
                  const stopWords = ['remove', 'delete', 'keep', 'except', 'apart', 'from', 'leave', 'retain', 'the', 'other', 'products', 'items', 'my', 'cart', 'only'];
                  const keywords = lower.replace(/[^\w\s]/gi, '').split(/\s+/).filter(w => !stopWords.includes(w) && w.length > 2);
                  
                  if (keywords.length === 0) {
                      response = "I wasn't sure which product you meant. Could you be more specific?";
                  } else {
                      let targetCartItem: any = null;
                      let highestScore = 0;
                      
                      cart.forEach((item: any) => {
                          let score = 0;
                          const title = (item.product.title || '').toLowerCase();
                          keywords.forEach(kw => {
                              const regex = new RegExp(`\\b${kw}\\b`, 'i');
                              if (regex.test(title)) score += 10;
                          });
                          if (score > highestScore) {
                              highestScore = score;
                              targetCartItem = item;
                          }
                      });
                      
                      if (targetCartItem) {
                          if (isKeeping) {
                              cart.forEach((item: any) => {
                                  if (item.product.id !== targetCartItem.product.id) {
                                      removeFromCart(item.product.id);
                                  }
                              });
                              response = `I have kept the ${targetCartItem.product.title} and removed the other items from your cart.`;
                          } else {
                              removeFromCart(targetCartItem.product.id);
                              response = `I have removed the ${targetCartItem.product.title} from your cart.`;
                          }
                      } else {
                          response = "I couldn't find that product in your cart.";
                      }
                  }
              }
              
              setAgentMessage(response);
              speak(response, false);
              
              const userChat = { role: "user" as const, content: userMessage };
              setChatHistory([...chatHistory, userChat, { role: "assistant" as const, content: response }].slice(-4));
              setWorkflowState('NEGOTIATING');
              return;
          }

          let generatedKeywords: string[] = [];
          let foundAlternatives = false;

          let validationError = "";
          let extractedIntent: any = undefined;

          // 1. Intercept Follow-Up Refinements
          if (routingDecision.intent === IntentType.RESULT_REFINEMENT) {
              if (SearchContextManager.hasActive()) {
                  const activeContext = SearchContextManager.get()!;
                  const refinedContext = ResultRefinementEngine.refine(activeContext, lower);
                  
                  if (refinedContext) {
                      SearchContextManager.update(refinedContext);
                      
                      const refinedIds = refinedContext.productSnapshot.map(s => s.id);
                      const hydratedProducts = products.filter(p => refinedIds.includes(p.id.toString()));
                      
                      matchingProducts = refinedContext.productSnapshot
                          .map(s => hydratedProducts.find(p => p.id.toString() === s.id))
                          .filter(Boolean) as any[];
                          
                      action = 'SEARCH';
                      generatedKeywords = refinedContext.structuredQuery.keywords;
                      extractedIntent = refinedContext.structuredQuery.rawIntent;
                  }
              } else {
                  // Fallback Behaviour for Refinements without a Search Context
                  action = 'INVALID_CONTEXT';
                  validationError = "I don't have any products to refine yet. What would you like to search for?";
              }
          }

          // 2. Intercept RESULT_ACTION (Result Action Engine)
          if (routingDecision.intent === IntentType.RESULT_ACTION) {
              if (action === 'CHECKOUT' || action === 'VIEW_CART' || action === 'CONTINUE_SHOPPING' || action === 'VIEW_WISHLIST' || action === 'VIEW_ORDERS' || action === 'VIEW_PROFILE' || action === 'VIEW_LOGIN' || action === 'VIEW_ACCOUNT') {
                  // Bypass ResultActionEngine for global cart actions that don't depend on SearchContext
              } else if (SearchContextManager.hasActive()) {
                  const activeContext = SearchContextManager.get()!;
                  const actionResponse = ResultActionEngine.execute(activeContext, lower);
                  
                  if (actionResponse.fallbackMessage) {
                      action = 'INVALID_CONTEXT';
                      validationError = actionResponse.fallbackMessage;
                  } else {
                      SearchContextManager.update(actionResponse.updatedContext);
                      
                      const hydratedProducts = products.filter(p => actionResponse.resolvedIds.includes(p.id.toString()));
                      
                      if (actionResponse.action === ActionType.VIEW_DETAILS) {
                          action = 'ACTION_HANDLED_BY_ENGINE'; // Placeholder for UI state
                          validationError = `Opening details for ${hydratedProducts[0]?.title || 'the selected product'}.`;
                      } else if (actionResponse.action === ActionType.COMPARE_PRODUCTS) {
                          action = 'ACTION_HANDLED_BY_ENGINE'; // Placeholder
                          setComparisonProducts(hydratedProducts);
                          validationError = `I've prepared a comparison for the ${actionResponse.resolvedIds.length} selected products.`;
                      } else {
                          // Pass through standard actions to legacy checkout/cart UI logic if needed
                          matchingProducts = hydratedProducts;
                      }
                  }
              } else {
                  action = 'INVALID_CONTEXT';
                  validationError = "I don't have any products in context. Please search for a product first.";
              }
          }

          // 3. Execute Full Search Engine for New Searches or unknown intents that default to search
          if (routingDecision.intent === IntentType.NEW_SEARCH || routingDecision.intent === IntentType.UNKNOWN) {
              const searchResult = SearchService.search(userMessage, lower, action, false, products);
              matchingProducts = searchResult.matchingProducts;
              action = searchResult.action;
              generatedKeywords = searchResult.generatedKeywords;
              extractedIntent = searchResult.extractedIntent;
          }
          
          if (action === 'WISHLIST' || action === 'ADD_TO_CART') {
              if (matchingProducts.length === 0 && aiProducts.length > 0) matchingProducts = [...aiProducts];
          }

          // Centralized Action Validation
          const bypassActions = ['VIEW_CART', 'CHECKOUT', 'CONTINUE_SHOPPING', 'VIEW_WISHLIST', 'VIEW_ORDERS', 'VIEW_PROFILE', 'VIEW_CATEGORIES', 'VIEW_DEALS', 'VIEW_LOGIN', 'VIEW_ACCOUNT', 'CHAT_GREETING', 'FAQ_CATALOG', 'FAQ_CAPABILITIES', 'FAQ_SHIPPING', 'FAQ_PAYMENT', 'FAQ_RETURNS', 'FAQ_SUPPORT', 'FAQ_DISCOUNTS'];
          if (routingDecision.intent === IntentType.RESULT_ACTION && action !== 'ACTION_HANDLED_BY_ENGINE' && action !== 'INVALID_CONTEXT' && matchingProducts.length === 0 && !bypassActions.includes(action)) {
              action = 'INVALID_CONTEXT';
              validationError = "I couldn't find any products to perform that action. Please search for a product first.";
          }

          if (action === 'INVALID_CONTEXT' || action === 'ACTION_HANDLED_BY_ENGINE') {
              setAgentMessage(validationError);
              speak(validationError, false);
              
              const userChat = { role: "user" as const, content: userMessage };
              setChatHistory([...chatHistory, userChat, { role: "assistant" as const, content: validationError }].slice(-4));
              setWorkflowState('NEGOTIATING');
              return;
          }
          
          if (action === 'SEARCH') {
              setAiProducts(matchingProducts);
          }

          // 4. Fast Track Actions (Bypass WebLLM entirely for lightning fast speed & personalized responses)
          let fullResponse = "";
          const fastTrackActions = ['SEARCH', 'ADD_TO_CART', 'WISHLIST', 'CHECKOUT', 'VIEW_CART', 'CONTINUE_SHOPPING', 'VIEW_WISHLIST', 'VIEW_ORDERS', 'VIEW_PROFILE', 'VIEW_CATEGORIES', 'VIEW_DEALS', 'VIEW_LOGIN', 'VIEW_ACCOUNT', 'CHAT_GREETING', 'FAQ_CATALOG', 'FAQ_CAPABILITIES', 'FAQ_SHIPPING', 'FAQ_PAYMENT', 'FAQ_RETURNS', 'FAQ_SUPPORT', 'FAQ_DISCOUNTS'];
          if (fastTrackActions.includes(action)) {
              if (action === 'SEARCH') {
                  if (matchingProducts.length > 0) {
                      fullResponse = `I found a few options that match your search. Take a look below. How would you like to continue? I can compare them, add one to your cart, or show more options.`;
                  } else {
                      fullResponse = `Sorry, I couldn't find any matching products on Nexmart. If you'd like, you can try another search or I can help you find something similar.`;
                  }
              } else if (action === 'ADD_TO_CART') {
                  fullResponse = `I've added the selected item(s) to your cart. What would you like to do next? You can continue shopping, view your cart, or proceed to checkout.`;
              } else if (action === 'WISHLIST') {
                  fullResponse = `Got it. I've saved those to your wishlist. What would you like to do next?`;
              } else if (action === 'CHECKOUT') {
                  fullResponse = `Taking you to checkout now.`;
              } else if (action === 'VIEW_CART') {
                  fullResponse = `Taking you to your cart now.`;
              } else if (action === 'VIEW_WISHLIST') {
                  fullResponse = `Taking you to your wishlist now.`;
              } else if (action === 'VIEW_ORDERS') {
                  fullResponse = `Taking you to your orders now.`;
              } else if (action === 'VIEW_PROFILE') {
                  if (lower.includes('how')) {
                      fullResponse = `You can access your profile and account settings by clicking your avatar in the top right corner.`;
                  } else {
                      fullResponse = `Opening your profile settings now.`;
                  }
              } else if (action === 'VIEW_LOGIN') {
                  fullResponse = `Sure! I'm opening the login page for you. You can sign in with your email or mobile number.`;
              } else if (action === 'VIEW_ACCOUNT') {
                  fullResponse = `Taking you to your account now. You can manage your orders, addresses, saved cards, and more from there.`;
              } else if (action === 'CONTINUE_SHOPPING') {
                  fullResponse = `Taking you back to the home page so you can continue shopping.`;
              } else if (action === 'VIEW_CATEGORIES') {
                  fullResponse = `Taking you to our product categories now.`;
              } else if (action === 'VIEW_DEALS') {
                  fullResponse = `Taking you to our special deals and offers now.`;
              } else if (action === 'CHAT_GREETING') {
                  fullResponse = `Hello! I'm your Nexmart AI assistant. How can I help you find the perfect products today?`;
              } else if (action === 'FAQ_CATALOG') {
                  fullResponse = `We have a wide variety of products on Nexmart! You can explore our Fashion, Home essentials, Beauty products, Electronics & Appliances, Groceries, Medicine, and Sports equipment. What are you shopping for today?`;
              } else if (action === 'FAQ_CAPABILITIES') {
                  fullResponse = `I am your personal AI shopping assistant! I can help you search our entire product catalog, compare items side-by-side, filter by price and specs, manage your cart and wishlist, and guide you through checkout. Just let me know what you need!`;
              } else if (action === 'FAQ_SHIPPING') {
                  fullResponse = `We offer fast, reliable shipping across the region! Standard delivery typically takes 2-4 business days, and express shipping is available at checkout. Plus, you can track your orders directly from your orders page.`;
              } else if (action === 'FAQ_PAYMENT') {
                  fullResponse = `We accept secure payments via debit/credit cards, bank transfers, and mobile money options. All transactions are fully encrypted for your security.`;
              } else if (action === 'FAQ_RETURNS') {
                  fullResponse = `We want you to love your purchase! We offer a hassle-free 14-day return policy for eligible items in original condition. If an item arrives damaged or defective, we'll replace or refund it immediately.`;
              } else if (action === 'FAQ_SUPPORT') {
                  fullResponse = `Our customer support team is always here to help! You can reach out to us via support@nexmart.com or use the help center in your account settings.`;
              } else if (action === 'FAQ_DISCOUNTS') {
                  fullResponse = `We regularly feature amazing deals and discounts! Check out our Deals section from the menu to see today's top discounted items and special promotions.`;
              }
              
              setAgentMessage(fullResponse);
              speak(fullResponse, false);
              
              const userChat = { role: "user" as const, content: userMessage };
              setChatHistory([...chatHistory, userChat, { role: "assistant" as const, content: fullResponse }].slice(-4));
              setWorkflowState('NEGOTIATING');
              
              if (action === 'CHECKOUT') navigate('checkout');
              else if (action === 'VIEW_CART') navigate('cart');
              else if (action === 'CONTINUE_SHOPPING') {
                  setAiProducts([]);
                  SearchContextManager.clear();
                  navigate('home');
              }
              else if (action === 'VIEW_WISHLIST') navigate('wishlist');
              else if (action === 'VIEW_ORDERS') navigate('orders');
              else if (action === 'VIEW_PROFILE') clerk.openUserProfile();
              else if (action === 'VIEW_ACCOUNT') navigate('account');
              else if (action === 'VIEW_LOGIN') setAuthModalOpen(true);
              else if (action === 'VIEW_CATEGORIES') navigate('categories');
              else if (action === 'VIEW_DEALS') navigate('deals');
              else if (action === 'WISHLIST') {
                  matchingProducts.forEach(p => toggleWishlist(p.id));
                  navigate('wishlist');
              } else if (action === 'ADD_TO_CART') {
                  matchingProducts.forEach(p => addToCart(p, 1));
                  navigate('cart');
              } else if (action === 'SEARCH' && matchingProducts.length > 0) {
                  setSearchQuery(userMessage);
                  navigate('search');
              }
              
              return; 
          }

          // 5. Fallback to LLM for conversational CHAT intents
          if (!engine) {
              const fallbackMsg = "I am the Nexmart AI assistant! I'm here to help you navigate our catalog, compare products, manage your cart, and answer any shopping questions.";
              setAgentMessage(fallbackMsg);
              speak(fallbackMsg, false);
              const userChat = { role: "user" as const, content: userMessage };
              setChatHistory([...chatHistory, userChat, { role: "assistant" as const, content: fallbackMsg }].slice(-4));
              setWorkflowState('NEGOTIATING');
              return;
          }

          let systemContext = '';
          if (routingDecision.intent === IntentType.RESULT_REFINEMENT || routingDecision.intent === IntentType.RESULT_ACTION) {
              const productDetails = matchingProducts.map((p, i) => `${i + 1}. ${p.title}\nPrice: ₦${p.price}`).join('\n\n');
              systemContext = `You are the Nexmart AI assistant. Answer the user briefly about these products: \n${productDetails}`;
          } else {
              systemContext = `You are the Nexmart AI e-commerce assistant. Address the user as Surbhi. Keep responses concise. The user is currently on the '${activeView}' page. Tailor your response based on this context. Our platform features these categories: Fashion (Men, Women, Kids), Home, Beauty, Electronics, Groceries, Medicine, and Sports. You can also help the user navigate to their Cart, Wishlist, Orders, Profile, or Account. CRITICAL: You do NOT have the ability to fetch products. If the user asks for a product, tell them to use the search bar, but NEVER invent or list fake products.`;
          }

          const userChat = { role: "user" as const, content: userMessage };
          const newHistory = [...chatHistory, userChat].slice(-4);
          
          const stream = await engine.chat.completions.create({
              messages: [
                  { role: "system", content: systemContext },
                  ...newHistory
              ],
              temperature: 0.3,
              max_tokens: 60,
              stream: true
          });

          for await (const chunk of stream) {
              const text = chunk.choices[0]?.delta?.content || "";
              fullResponse += text;
              setAgentMessage(fullResponse);
          }
          speak(fullResponse, false);
          
          setChatHistory([...newHistory, { role: "assistant" as const, content: fullResponse }]);
          setWorkflowState('NEGOTIATING');

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
      <div className="fixed bottom-5 right-5 md:bottom-6 md:right-6 lg:bottom-8 lg:right-8 flex flex-col items-end z-[60] pointer-events-none">

          <div className="relative flex items-center justify-center pointer-events-auto w-full h-full origin-bottom-right">

              <motion.div 
                drag
                dragSnapToOrigin={false}
                dragElastic={0.2}
                onDragStart={() => {
                    setIsDragging(true);
                }}
                onDragEnd={() => setIsDragging(false)}
                onTap={handleOrbClick}
                animate={{ 
                    scale: isWorking ? 1.02 : 1,
                    y: isIdle && !isDragging ? [0, -6, 0] : 0
                }}
                transition={{ 
                    scale: { type: "spring", stiffness: 100, damping: 20 },
                    y: { duration: 8, repeat: Infinity, ease: "easeInOut" }
                }}
                className={`relative cursor-pointer transition-shadow w-[72px] h-[72px] sm:w-[84px] sm:h-[84px] md:w-[104px] md:h-[104px] lg:w-[124px] lg:h-[124px] xl:w-[146px] xl:h-[146px] aspect-square shrink-0 flex items-center justify-center rounded-full group drop-shadow-[0_30px_60px_rgba(255,106,0,0.3)] z-10`}
              >
                 {/* Animated Neon Backlight for Micro-Interactions */}
                 <motion.div
                     animate={{ 
                         rotate: isWorking ? 360 : 0, 
                         scale: isListening ? [1, 1.05, 1] : isTalking ? [0.98, 1.04, 0.98] : 1 
                     }}
                     transition={{
                         rotate: isWorking ? { duration: 4, repeat: Infinity, ease: "linear" } : { duration: 0.5 },
                         scale: isListening ? { duration: 0.8, repeat: Infinity, ease: "easeInOut" } 
                              : isTalking ? { duration: 2.5, repeat: Infinity, ease: "easeInOut" } 
                              : { duration: 0.3 }
                     }}
                     className="absolute inset-0 z-0 pointer-events-none"
                 >
                     <div className="absolute inset-[-2px] rounded-full bg-[conic-gradient(from_0deg,rgba(255,106,0,0.4)_0%,rgba(255,106,0,1)_50%,rgba(255,106,0,0.4)_100%)] blur-[6px] opacity-80" />
                     <div className="absolute inset-[-5px] rounded-full bg-[conic-gradient(from_180deg,rgba(255,138,31,0.2)_0%,rgba(255,106,0,0.8)_50%,rgba(255,138,31,0.2)_100%)] blur-[12px] opacity-40" />
                 </motion.div>

                 {/* Glossy White Interior */}
                 <div className="absolute inset-0 rounded-full bg-white overflow-hidden" />
                 
                 {/* Pure CSS 3D Glass Highlights (Smooth crescent reflection) */}
                 <div className="absolute inset-0 rounded-full shadow-[inset_-20px_-20px_40px_rgba(0,0,0,0.1),inset_4px_8px_16px_rgba(255,255,255,0.8),inset_0_-4px_12px_rgba(255,106,0,0.3)] border border-black/5 pointer-events-none z-10" />
                 
                 {/* Dark ambient ground shadow */}
                 <div className="absolute -bottom-6 w-3/4 h-5 bg-black/80 blur-[12px] rounded-[100%] pointer-events-none z-0" />
                 
                 {/* Sharp Neon Ground Light (Two layers for realistic falloff) */}
                 <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-[80%] h-1 bg-theme-accent blur-[3px] rounded-[100%] pointer-events-none z-0" />
                 <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[120%] h-3 bg-theme-accent blur-[12px] rounded-[100%] pointer-events-none z-0" />
                 
                 {/* Minimalist AI Face (Subtle dark indicators) */}
                 <motion.div 
                    animate={
                        isDragging ? { x: [-2, 2, -2], y: [-1, 1, -1] } :
                        isWorking ? { x: [-1, 1, -1], y: [-1, 1, -1] } : 
                        { x: aiProducts.length > 0 ? 0 : mousePos.x * 6, y: aiProducts.length > 0 ? 5 : mousePos.y * 6 }
                    }
                    transition={
                        isDragging ? { duration: 0.5, repeat: Infinity } :
                        isWorking ? { duration: 1.5, repeat: Infinity } : 
                        { type: "spring", stiffness: 200, damping: 20 }
                    }
                    className="absolute inset-0 flex items-center justify-center gap-2.5 md:gap-3 z-10 pointer-events-none"
                 >
                     {/* LEFT EYE — vertically elongated pill */}
                     <motion.div 
                         animate={{ 
                             width: "0.55rem",
                             height: "1.46rem",
                             borderRadius: "9999px"
                         }}
                         transition={{ duration: 0.2 }}
                         className={`bg-[#1a1a1a] shadow-[0_0_6px_rgba(0,0,0,0.15)] ${!isTalking ? 'eye-blink' : ''}`} 
                     />
                     {/* RIGHT EYE — vertically elongated pill */}
                     <motion.div 
                         animate={{ 
                             width: "0.55rem",
                             height: "1.46rem",
                             borderRadius: "9999px"
                         }}
                         transition={{ duration: 0.2 }}
                         className={`bg-[#1a1a1a] shadow-[0_0_6px_rgba(0,0,0,0.15)] ${!isTalking ? 'eye-blink' : ''}`} 
                     />
                 </motion.div>

                 <style dangerouslySetInnerHTML={{__html: `
                     @keyframes eyeBlink {
                         0%, 88%, 92%, 100% { transform: scaleY(1); }
                         90% { transform: scaleY(0.08); }
                     }
                     .eye-blink {
                         animation: eyeBlink 6s infinite;
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
                          className="h-full bg-theme-accent transition-all duration-300 ease-out shadow-[0_0_15px_rgba(255,106,0,0.8)] relative"
                          style={{ width: `${aiProgress.match(/(\d+)%/) ? aiProgress.match(/(\d+)%/)?.[1] : 100}%` }}
                      >
                          <div className="absolute top-0 right-0 bottom-0 w-10 bg-gradient-to-r from-transparent to-white/50 blur-[2px]" />
                      </div>
                      <div className="fixed bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-black text-theme-accent uppercase tracking-widest drop-shadow-md">
                          {aiProgress}
                      </div>
                  </div>
              )}


          </div>


      </div>
  );
}
