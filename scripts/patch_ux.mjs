import fs from 'fs';

// 1. Fix CategoryNav.tsx
const navFile = '/Users/sanjeevn/Downloads/nexmart/src/components/dashboard/CategoryNav.tsx';
let navContent = fs.readFileSync(navFile, 'utf8');
navContent = navContent.replace(
  "text-[13px] font-black uppercase tracking-wider",
  "text-[14px] font-semibold capitalize tracking-tight"
);
fs.writeFileSync(navFile, navContent);

// 2. Fix MarketplaceHeader.tsx
const headerFile = '/Users/sanjeevn/Downloads/nexmart/src/components/dashboard/MarketplaceHeader.tsx';
let headerContent = fs.readFileSync(headerFile, 'utf8');
headerContent = headerContent.replace(
  "if (onLogoClick) onLogoClick();",
  "setSearchQuery('');\n              if (onLogoClick) onLogoClick();"
);
fs.writeFileSync(headerFile, headerContent);

// 3. Fix AgentOrb.tsx
const agentFile = '/Users/sanjeevn/Downloads/nexmart/src/components/os/AgentOrb.tsx';
let agentContent = fs.readFileSync(agentFile, 'utf8');
agentContent = agentContent.replace(
  "SearchContextManager.clear();\n        navigate('home');",
  "SearchContextManager.clear();\n        setSearchQuery('');\n        navigate('home');"
);
fs.writeFileSync(agentFile, agentContent);

console.log("Patched UX successfully!");
