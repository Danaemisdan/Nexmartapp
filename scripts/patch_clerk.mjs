import fs from 'fs';

const agentOrbFile = '/Users/sanjeevn/Downloads/nexmart/src/components/os/AgentOrb.tsx';
let agentOrb = fs.readFileSync(agentOrbFile, 'utf8');

// Replace the old nukeScript
const oldNukeScriptRegex = /const nukeClerkBadge = \(\) => \{[\s\S]*?const interval = setInterval\(nukeClerkBadge, 500\);/m;

const newNukeScript = `
    const nukeClerkBadge = () => {
      // 1. Hide by text content (ignoring inline styles)
      const walkDOM = (node: any) => {
        if (node.nodeType === 3) {
          const text = node.textContent || '';
          if (text.includes('Configure your application') || text.includes('created your first user')) {
            let parent = node.parentElement;
            while (parent && parent.tagName !== 'BODY') {
              if (parent.id === 'clerk-components' || parent.style.position === 'fixed' || parent.style.position === 'absolute' || window.getComputedStyle(parent).position === 'fixed') {
                parent.style.display = 'none';
                parent.style.opacity = '0';
                parent.style.pointerEvents = 'none';
                break;
              }
              parent = parent.parentElement;
            }
          }
        } else if (node.nodeType === 1 && node.nodeName !== 'SCRIPT') {
          // Check shadow DOM
          if (node.shadowRoot) walkDOM(node.shadowRoot);
          for (let i = 0; i < node.childNodes.length; i++) {
            walkDOM(node.childNodes[i]);
          }
        }
      };
      
      walkDOM(document.body);
      
      // 2. Hide by brute force Clerk internal classes if they exist
      const styles = document.createElement('style');
      styles.innerHTML = \`
        .cl-devModeBadge, .cl-developmentModeBadge, 
        [class*="cl-internal-"] { 
           display: none !important; 
           opacity: 0 !important; 
           pointer-events: none !important; 
        }
      \`;
      if (!document.getElementById('anti-clerk-styles')) {
        styles.id = 'anti-clerk-styles';
        document.head.appendChild(styles);
      }
    };
    const interval = setInterval(nukeClerkBadge, 200);
`;

if (oldNukeScriptRegex.test(agentOrb)) {
  agentOrb = agentOrb.replace(oldNukeScriptRegex, newNukeScript.trim());
} else {
  console.log("Could not find old script");
}

fs.writeFileSync(agentOrbFile, agentOrb);
console.log("Super nuker applied!");
