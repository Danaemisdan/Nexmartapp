import fs from 'fs';

const file = '/Users/sanjeevn/Downloads/nexmart/src/components/os/AgentOrb.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Fix setSearchQuery
content = content.replace(
  "setSearchQuery(userMessage);",
  "const intelligentQuery = extractedIntent?.productType || extractedIntent?.subcategory || extractedIntent?.category || generatedKeywords[0] || userMessage;\n      setSearchQuery(intelligentQuery);"
);

// 2. Fix ghost bubble
content = content.replace(/setWorkflowState\('NEGOTIATING'\);/g, "setWorkflowState('NEGOTIATING');\n    setUserTranscript('');");

fs.writeFileSync(file, content);
console.log("Patched successfully!");
