const fs = require('fs');

const filePath = '/Users/sanjeevn/Downloads/nexmart/src/components/os/AgentOrb.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add isDrawerOpen state
content = content.replace(
    'const [isDragging, setIsDragging] = useState(false);',
    'const [isDragging, setIsDragging] = useState(false);\n  const [isDrawerOpen, setIsDrawerOpen] = useState(false);'
);

// 2. Open drawer on startListening
content = content.replace(
    /recognitionRef\.current\.onstart = \(\) => \{\s*setWorkflowState\('LISTENING'\);\s*setUserTranscript\('Listening\.\.\.'\);\s*setAgentMessage\(''\);\s*\};/,
    `recognitionRef.current.onstart = () => {
              setWorkflowState('LISTENING');
              setUserTranscript('Listening...');
              setAgentMessage('');
              setIsDrawerOpen(true);
          };`
);

// 3. Update handleOrbClick
content = content.replace(
    /const handleOrbClick = \(\) => \{[\s\S]*?startListening\(\);\s*\}\s*\};/,
    `const handleOrbClick = () => {
      if (!engine && !isBooting) {
          initWebLLM();
          setIsDrawerOpen(true);
          return;
      }
      if (!engine && isBooting) {
          setIsDrawerOpen(true);
          return;
      }
      if (isWorking) {
          setIsDrawerOpen(true);
          return;
      }
      
      if (isTalking) {
          stopTalking();
          startListening();
      } else if (isListening) {
          if (recognitionRef.current) recognitionRef.current.stop();
          setWorkflowState('IDLE');
          setUserTranscript('');
      } else {
          if (!isDrawerOpen) {
              setIsDrawerOpen(true);
          } else {
              startListening();
          }
      }
  };
  
  const handleTextSubmit = (e) => {
      e.preventDefault();
      if (input.trim()) {
          handleSemanticTask(input.trim());
      }
  };`
);

// 4. Replace the return statement
const uiReplacement = `return (
      <>
          {/* Main Bottom Bar */}
          <div className="fixed bottom-0 left-0 right-0 z-[60] pointer-events-none flex justify-center pb-4 md:pb-6">
              <div className="pointer-events-auto flex flex-col items-center w-full max-w-2xl px-4">
                  
                  {/* Glassmorphic Drawer Panel */}
                  <AnimatePresence>
                      {isDrawerOpen && (
                          <motion.div 
                              initial={{ opacity: 0, y: 20, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 20, scale: 0.95 }}
                              transition={{ type: "spring", stiffness: 300, damping: 25 }}
                              className="w-full bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-2xl rounded-3xl mb-4 overflow-hidden flex flex-col"
                          >
                              {/* Header */}
                              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100/50 bg-white/50">
                                  <div className="flex items-center gap-2">
                                      <Sparkles className="w-5 h-5 text-indigo-500" />
                                      <span className="font-semibold text-gray-800">Nexmart AI</span>
                                      {isBooting && <Loader2 className="w-4 h-4 text-gray-400 animate-spin ml-2" />}
                                  </div>
                                  <button onClick={() => setIsDrawerOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                      <X className="w-4 h-4 text-gray-500" />
                                  </button>
                              </div>
                              
                              {/* Chat History & Content */}
                              <div className="p-6 h-[300px] overflow-y-auto flex flex-col gap-4">
                                  {chatHistory.length === 0 && !userTranscript && !agentMessage && (
                                      <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-400 gap-3">
                                          <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
                                              <Sparkles className="w-6 h-6 text-indigo-300" />
                                          </div>
                                          <p className="text-sm font-medium">How can I help you shop today?</p>
                                          <div className="flex flex-wrap justify-center gap-2 mt-2">
                                              {suggestedPrompts.slice(0,3).map((prompt, i) => (
                                                  <button key={i} onClick={() => handleSemanticTask(prompt)} className="text-xs bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-600 px-3 py-1.5 rounded-full transition-colors">
                                                      "{prompt}"
                                                  </button>
                                              ))}
                                          </div>
                                      </div>
                                  )}
                                  
                                  {chatHistory.map((msg, i) => (
                                      <div key={i} className={\`flex \${msg.role === 'user' ? 'justify-end' : 'justify-start'}\`}>
                                          <div className={\`max-w-[85%] px-4 py-3 rounded-2xl text-sm \${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-sm' : 'bg-gray-100 text-gray-800 rounded-bl-sm'}\`}>
                                              {msg.content}
                                          </div>
                                      </div>
                                  ))}
                                  
                                  {/* Active Transcript / Typing Indicator */}
                                  {(userTranscript || agentMessage || isWorking) && (
                                      <>
                                          {userTranscript && chatHistory[chatHistory.length-1]?.content !== userTranscript && (
                                              <div className="flex justify-end">
                                                  <div className="max-w-[85%] px-4 py-3 rounded-2xl text-sm bg-indigo-600 text-white rounded-br-sm opacity-80">
                                                      {userTranscript}
                                                  </div>
                                              </div>
                                          )}
                                          {(isWorking || agentMessage) && chatHistory[chatHistory.length-1]?.content !== agentMessage && (
                                              <div className="flex justify-start">
                                                  <div className="max-w-[85%] px-4 py-3 rounded-2xl text-sm bg-gray-100 text-gray-800 rounded-bl-sm">
                                                      {isWorking && !agentMessage ? (
                                                          <div className="flex gap-1 items-center h-5">
                                                              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}} />
                                                              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}} />
                                                              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}} />
                                                          </div>
                                                      ) : (
                                                          agentMessage
                                                      )}
                                                  </div>
                                              </div>
                                          )}
                                      </>
                                  )}
                              </div>
                              
                              {/* Input Area */}
                              <div className="p-4 border-t border-gray-100/50 bg-white/50">
                                  <form onSubmit={handleTextSubmit} className="relative flex items-center">
                                      <input 
                                          type="text"
                                          value={input}
                                          onChange={(e) => setInput(e.target.value)}
                                          placeholder="Type or click the mic to speak..."
                                          className="w-full bg-gray-100/80 border-transparent focus:bg-white focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 rounded-full py-3 pl-4 pr-12 text-sm text-gray-800 placeholder-gray-400 transition-all outline-none"
                                      />
                                      <button type="submit" disabled={!input.trim()} className="absolute right-2 p-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white rounded-full transition-colors">
                                          <ArrowUp className="w-4 h-4" />
                                      </button>
                                  </form>
                              </div>
                          </motion.div>
                      )}
                  </AnimatePresence>

                  {/* Sleek Floating Action Bar */}
                  <div className="bg-white/90 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-200/50 rounded-full px-2 py-2 flex items-center gap-2">
                      <div className="px-4 text-xs font-semibold text-gray-500 hidden sm:block">
                          Nexmart <span className="text-indigo-500">AI</span>
                      </div>
                      
                      <div className="w-[1px] h-6 bg-gray-200 hidden sm:block" />
                      
                      {/* The Tiny Orb */}
                      <motion.div 
                          onClick={handleOrbClick}
                          animate={{ 
                              scale: isWorking ? 1.05 : 1,
                          }}
                          className={\`cursor-pointer relative w-10 h-10 rounded-full flex items-center justify-center \${isListening ? 'bg-indigo-600' : 'bg-gray-900'} shadow-lg hover:shadow-xl transition-all\`}
                      >
                          {/* Inner glowing effect when active */}
                          {(isWorking || isListening || isTalking) && (
                              <motion.div
                                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                                  transition={{ duration: 1.5, repeat: Infinity }}
                                  className="absolute inset-0 rounded-full bg-indigo-400 blur-md -z-10"
                              />
                          )}
                          <div className="flex gap-0.5">
                              <motion.div animate={{ height: isTalking ? ["4px", "12px", "4px"] : "4px" }} transition={{ duration: 0.5, repeat: Infinity, delay: 0 }} className="w-1 bg-white rounded-full" />
                              <motion.div animate={{ height: isTalking ? ["4px", "16px", "4px"] : "4px" }} transition={{ duration: 0.5, repeat: Infinity, delay: 0.1 }} className="w-1 bg-white rounded-full" />
                              <motion.div animate={{ height: isTalking ? ["4px", "12px", "4px"] : "4px" }} transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }} className="w-1 bg-white rounded-full" />
                          </div>
                      </motion.div>
                      
                      {!isDrawerOpen && (
                          <button onClick={() => setIsDrawerOpen(true)} className="ml-1 pr-4 pl-2 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
                              Ask anything...
                          </button>
                      )}
                  </div>
              </div>
          </div>
          
          {/* Booting Progress Toast */}
          {!isAiReady && hasStartedBoot && (
              <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-white shadow-lg border border-gray-100 rounded-full px-4 py-2 flex items-center gap-3">
                  <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />
                  <span className="text-xs font-semibold text-gray-700">{aiProgress}</span>
              </div>
          )}
      </>
  );
}`;

content = content.replace(/return \(\s*<div className="fixed bottom-5[\s\S]*$/, uiReplacement + '\n}\n');

fs.writeFileSync(filePath, content);
console.log('Successfully updated AgentOrb.tsx');
