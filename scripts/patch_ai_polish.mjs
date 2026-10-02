import fs from 'fs';

// 1. Patch IntentRouter.ts
const intentRouterFile = '/Users/sanjeevn/Downloads/nexmart/src/lib/IntentRouter.ts';
let intentRouter = fs.readFileSync(intentRouterFile, 'utf8');

// Update address routing
intentRouter = intentRouter.replace(
  "lower.includes('profile') || lower.includes('account') || lower.includes('settings')",
  "lower.includes('profile') || lower.includes('account') || lower.includes('settings') || lower.includes('address') || lower.includes('password')"
);

// Fix add bug
intentRouter = intentRouter.replace(
  "lower.includes('add') || lower.includes('buy') || lower.includes('purchase')",
  "lower.match(/\\badd\\b/i) || lower.match(/\\bbuy\\b/i) || lower.match(/\\bpurchase\\b/i)"
);

// Add better/alternative to refinements
intentRouter = intentRouter.replace(
  "['only', 'under', 'above', 'between', 'cheapest', 'expensive', 'highest rated', 'newest', 'top', 'first', 'keep']",
  "['only', 'under', 'above', 'between', 'cheapest', 'expensive', 'highest rated', 'newest', 'top', 'first', 'keep', 'better', 'alternative', 'another', 'different']"
);

fs.writeFileSync(intentRouterFile, intentRouter);


// 2. Patch ResultRefinementEngine.ts
const refinementEngineFile = '/Users/sanjeevn/Downloads/nexmart/src/lib/ResultRefinementEngine.ts';
let refinementEngine = fs.readFileSync(refinementEngineFile, 'utf8');

refinementEngine = refinementEngine.replace(
  "const isSort = lowerQuery.includes('cheapest') || lowerQuery.includes('expensive') || lowerQuery.includes('highest rated') || lowerQuery.includes('newest');",
  "const isSort = lowerQuery.includes('cheapest') || lowerQuery.includes('expensive') || lowerQuery.includes('highest rated') || lowerQuery.includes('newest') || lowerQuery.includes('better');"
);

refinementEngine = refinementEngine.replace(
  "} else if (lowerQuery.includes('highest rated') || lowerQuery.includes('rating')) {",
  "} else if (lowerQuery.includes('highest rated') || lowerQuery.includes('rating') || lowerQuery.includes('better')) {"
);

refinementEngine = refinementEngine.replace(
  "if (isSlice) {",
  `if (isSlice || lowerQuery.includes('alternative') || lowerQuery.includes('another') || lowerQuery.includes('different')) {
      if (lowerQuery.includes('alternative') || lowerQuery.includes('another') || lowerQuery.includes('different')) {
        if (newContext.productSnapshot.length > 1) {
          newContext.productSnapshot = newContext.productSnapshot.slice(1);
        }
      } else {`
);

refinementEngine = refinementEngine.replace(
  "newContext.productSnapshot = newContext.productSnapshot.slice(0, limit);\n        }\n      }\n    }",
  "newContext.productSnapshot = newContext.productSnapshot.slice(0, limit);\n        }\n      }\n      }\n    }"
);

fs.writeFileSync(refinementEngineFile, refinementEngine);


// 3. Patch AgentOrb.tsx
const agentOrbFile = '/Users/sanjeevn/Downloads/nexmart/src/components/os/AgentOrb.tsx';
let agentOrb = fs.readFileSync(agentOrbFile, 'utf8');

// Add useRef to imports
if (!agentOrb.includes("useRef")) {
  agentOrb = agentOrb.replace("import React, { useState, useEffect", "import React, { useState, useEffect, useRef");
}

// Add messagesEndRef inside AgentOrb component
agentOrb = agentOrb.replace(
  "const [isDrawerOpen, setIsDrawerOpen] = useState(false);",
  "const [isDrawerOpen, setIsDrawerOpen] = useState(false);\n  const messagesEndRef = useRef<HTMLDivElement>(null);\n\n  const scrollToBottom = () => {\n    messagesEndRef.current?.scrollIntoView({ behavior: \"smooth\" });\n  };\n\n  useEffect(() => {\n    scrollToBottom();\n  }, [chatHistory, userTranscript, agentMessage, isWorking]);"
);

// Add the dummy div for scroll
agentOrb = agentOrb.replace(
  "</div>\n        \n        {/* Input Area */}",
  "<div ref={messagesEndRef} />\n        </div>\n        \n        {/* Input Area */}"
);

// Randomize AI Responses
const fastTrackResponses = `
  const randomResponse = (responses: string[]) => responses[Math.floor(Math.random() * responses.length)];

  if (fastTrackActions.includes(action)) {
    if (action === 'SEARCH') {
      if (matchingProducts.length > 0) {
        fullResponse = randomResponse([
          "I found a few options that match your search. Take a look below.",
          "Here are some great options I found for you. Would you like me to compare them?",
          "I've pulled up some products that fit your request. Check them out!"
        ]);
      } else {
        fullResponse = randomResponse([
          "Sorry, I couldn't find any matching products on Nexmart.",
          "Hmm, I'm not seeing any exact matches for that right now.",
          "I couldn't find exactly what you're looking for. Can I help you find something similar?"
        ]);
      }
    } else if (action === 'ADD_TO_CART') {
      fullResponse = randomResponse([
        "I've added the selected item(s) to your cart. What would you like to do next?",
        "Done! Added to your cart. Ready to checkout?",
        "It's in your cart! Let me know if you want to keep shopping or check out."
      ]);
    } else if (action === 'WISHLIST') {
      fullResponse = randomResponse([
        "Got it. I've saved those to your wishlist. What would you like to do next?",
        "Saved to your wishlist! Need help with anything else?",
        "I've bookmarked that for you in your wishlist."
      ]);
    } else if (action === 'CHECKOUT') {
      fullResponse = randomResponse([
        "Taking you to checkout now.",
        "Let's get this wrapped up. Heading to checkout!",
        "Opening the checkout page for you."
      ]);
    } else if (action === 'VIEW_CART') {
      fullResponse = randomResponse(["Taking you to your cart now.", "Opening your cart.", "Here is your cart!"]);
    } else if (action === 'VIEW_WISHLIST') {
      fullResponse = randomResponse(["Taking you to your wishlist now.", "Opening your saved items.", "Here is your wishlist!"]);
    } else if (action === 'VIEW_ORDERS') {
      fullResponse = randomResponse(["Taking you to your orders now.", "Opening your order history.", "Here are your orders."]);
    } else if (action === 'VIEW_PROFILE') {
      if (lower.includes('how')) {
        fullResponse = "You can access your profile and account settings by clicking your avatar in the top right corner.";
      } else {
        fullResponse = randomResponse(["Opening your profile settings now.", "Taking you to your account page.", "Here are your profile settings."]);
      }
    } else if (action === 'VIEW_LOGIN') {
      fullResponse = "Sure! I'm opening the login page for you. You can sign in with your email or mobile number.";
    } else if (action === 'VIEW_ACCOUNT') {
      fullResponse = randomResponse(["Taking you to your account now.", "Opening your account dashboard.", "Here is your account page!"]);
    } else if (action === 'CONTINUE_SHOPPING') {
      fullResponse = randomResponse(["Taking you back to the home page so you can continue shopping.", "Returning you to the store.", "Let's keep shopping!"]);
    } else if (action === 'VIEW_CATEGORIES') {
      fullResponse = "Taking you to our product categories now.";
    } else if (action === 'VIEW_DEALS') {
      fullResponse = "Taking you to our special deals and offers now.";
    } else if (action === 'CHAT_GREETING') {
      fullResponse = randomResponse([
        "Hello! I'm your Nexmart AI assistant. How can I help you find the perfect products today?",
        "Hi there! What are you looking to shop for today?",
        "Greetings! I'm here to help you navigate our store and find the best deals."
      ]);
    } else if (action === 'FAQ_CATALOG') {
      fullResponse = "We have a wide variety of products on Nexmart! You can explore our Fashion, Home essentials, Beauty products, Electronics & Appliances, Groceries, Medicine, and Sports equipment. What are you shopping for today?";
    } else if (action === 'FAQ_CAPABILITIES') {
      fullResponse = "I am your personal AI shopping assistant! I can help you search our entire product catalog, compare items side-by-side, filter by price and specs, manage your cart and wishlist, and guide you through checkout. Just let me know what you need!";
    } else if (action === 'FAQ_SHIPPING') {
      fullResponse = "We offer fast, reliable shipping across the region! Standard delivery typically takes 2-4 business days, and express shipping is available at checkout. Plus, you can track your orders directly from your orders page.";
    } else if (action === 'FAQ_PAYMENT') {
      fullResponse = "We accept secure payments via debit/credit cards, bank transfers, and mobile money options. All transactions are fully encrypted for your security.";
    } else if (action === 'FAQ_RETURNS') {
      fullResponse = "We want you to love your purchase! We offer a hassle-free 14-day return policy for eligible items in original condition. If an item arrives damaged or defective, we'll replace or refund it immediately.";
    } else if (action === 'FAQ_SUPPORT') {
      fullResponse = "Our customer support team is always here to help! You can reach out to us via support@nexmart.com or use the help center in your account settings.";
    } else if (action === 'FAQ_DISCOUNTS') {
      fullResponse = "We regularly feature amazing deals and discounts! Check out our Deals section from the menu to see today's top discounted items and special promotions.";
    }
  }
`;

agentOrb = agentOrb.replace(
  /if \(fastTrackActions\.includes\(action\)\) \{[\s\S]*?\}\s*\}\s*setAgentMessage\(fullResponse\);/,
  fastTrackResponses + "\n  setAgentMessage(fullResponse);"
);


fs.writeFileSync(agentOrbFile, agentOrb);
console.log("Patched all fixes!");
