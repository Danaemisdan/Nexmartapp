import fs from 'fs';

const agentFile = '/Users/sanjeevn/Downloads/nexmart/src/components/os/AgentOrb.tsx';
let agentContent = fs.readFileSync(agentFile, 'utf8');
agentContent = agentContent.replace(
  "const handleTextSubmit = (e) => {",
  "const handleTextSubmit = (e: React.FormEvent) => {"
);
fs.writeFileSync(agentFile, agentContent);

console.log("Patched AgentOrb.tsx type error!");
