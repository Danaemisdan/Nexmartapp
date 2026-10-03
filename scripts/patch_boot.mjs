import fs from 'fs';

const agentOrbFile = '/Users/sanjeevn/Downloads/nexmart/src/components/os/AgentOrb.tsx';
let agentOrb = fs.readFileSync(agentOrbFile, 'utf8');

// 1. Remove the blocking return in handleSemanticTask
agentOrb = agentOrb.replace(
  "if (!engine || !userMessage.trim()) return;",
  "if (!userMessage.trim()) return;"
);

// 2. Allow listening while booting in handleOrbClick
agentOrb = agentOrb.replace(
  "if (!engine && isBooting) {\n      setIsDrawerOpen(true);\n      return;\n    }",
  "if (!engine && isBooting) {\n      // Let the user talk/interact even while the engine is booting!\n    }"
);

// 3. Make the welcome message more interactive and dynamic
agentOrb = agentOrb.replace(
  "await speak(\"Welcome to Nexmart... the smart way of shopping. I am your AI assistant. Please wait while I download my neural core...\", true);",
  "await speak(\"Welcome to Nexmart! I'm your AI assistant. I am ready to help you search and shop while my advanced neural core boots up in the background. What are you looking for today?\", true);"
);

// 4. Make the online message less disruptive, just a toast or a small ping
agentOrb = agentOrb.replace(
  "speak(\"My neural core is online. I am ready to help you shop!\", true);",
  "toast.success(\"Neural core is now fully online for advanced conversations!\");"
);

fs.writeFileSync(agentOrbFile, agentOrb);
console.log("Patched background booting interactivity!");
