import fs from 'fs';

const agentOrbFile = '/Users/sanjeevn/Downloads/nexmart/src/components/os/AgentOrb.tsx';
let agentOrb = fs.readFileSync(agentOrbFile, 'utf8');

// 1. Make the pill bigger and text larger
agentOrb = agentOrb.replace(
  "className=\"bg-white/90 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-200/50 rounded-full px-2 py-2 flex items-center gap-2\"",
  "className=\"bg-white/90 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-200/50 rounded-full px-4 py-3 flex items-center gap-4\""
);

agentOrb = agentOrb.replace(
  "className=\"px-4 text-xs font-semibold text-gray-500 hidden sm:block\"",
  "className=\"pl-4 pr-2 text-base font-bold text-gray-600 hidden sm:block tracking-wide\""
);

agentOrb = agentOrb.replace(
  "className=\"w-[1px] h-6 bg-gray-200 hidden sm:block\"",
  "className=\"w-[2px] h-8 bg-gray-200 hidden sm:block rounded-full\""
);

agentOrb = agentOrb.replace(
  "className={`cursor-pointer relative w-10 h-10 rounded-full flex items-center justify-center ${isListening ? 'bg-[#FF6A00]' : 'bg-gray-900'} shadow-lg hover:shadow-xl transition-all`}",
  "className={`cursor-pointer relative w-16 h-16 rounded-full flex items-center justify-center ${isListening ? 'bg-[#FF6A00]' : 'bg-gray-900'} shadow-xl hover:shadow-2xl transition-all transform hover:scale-105`}"
);

agentOrb = agentOrb.replace(
  "className=\"ml-1 pr-4 pl-2 py-2 text-sm font-medium text-gray-600 hover:text-[#FF6A00] transition-colors\"",
  "className=\"ml-2 pr-6 pl-2 py-2 text-lg font-semibold text-gray-500 hover:text-[#FF6A00] transition-colors\""
);

// Scale up the inner lines of the Orb
agentOrb = agentOrb.replace(
  "<motion.div animate={{ height: isTalking ? [\"4px\", \"12px\", \"4px\"] : \"4px\" }} transition={{ duration: 0.5, repeat: Infinity, delay: 0 }} className=\"w-1 bg-white rounded-full\" />",
  "<motion.div animate={{ height: isTalking ? [\"6px\", \"24px\", \"6px\"] : \"6px\" }} transition={{ duration: 0.5, repeat: Infinity, delay: 0 }} className=\"w-1.5 bg-white rounded-full\" />"
);
agentOrb = agentOrb.replace(
  "<motion.div animate={{ height: isTalking ? [\"4px\", \"16px\", \"4px\"] : \"4px\" }} transition={{ duration: 0.5, repeat: Infinity, delay: 0.1 }} className=\"w-1 bg-white rounded-full\" />",
  "<motion.div animate={{ height: isTalking ? [\"6px\", \"32px\", \"6px\"] : \"6px\" }} transition={{ duration: 0.5, repeat: Infinity, delay: 0.1 }} className=\"w-1.5 bg-white rounded-full\" />"
);
agentOrb = agentOrb.replace(
  "<motion.div animate={{ height: isTalking ? [\"4px\", \"12px\", \"4px\"] : \"4px\" }} transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }} className=\"w-1 bg-white rounded-full\" />",
  "<motion.div animate={{ height: isTalking ? [\"6px\", \"24px\", \"6px\"] : \"6px\" }} transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }} className=\"w-1.5 bg-white rounded-full\" />"
);
agentOrb = agentOrb.replace(
  "<div className=\"flex gap-0.5\">",
  "<div className=\"flex gap-1\">"
);

// 2. Add nuke script for Clerk Dev Badge inside useEffect
const nukeScript = `
    const nukeClerkBadge = () => {
      document.querySelectorAll('div').forEach(d => {
        if (
          d.style.position === 'fixed' && 
          d.textContent && 
          (d.textContent.includes('Configure your application') || d.textContent.includes('created your first user'))
        ) {
          d.style.display = 'none';
        }
      });
    };
    const interval = setInterval(nukeClerkBadge, 500);
`;
agentOrb = agentOrb.replace(
  "audioRef.current = new Audio();",
  "audioRef.current = new Audio();\n" + nukeScript
);
agentOrb = agentOrb.replace(
  "return () => {",
  "return () => {\n      clearInterval(interval);"
);

fs.writeFileSync(agentOrbFile, agentOrb);
console.log("UI Improved and Clerk nuked!");
