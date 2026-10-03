import fs from 'fs';

const agentOrbFile = '/Users/sanjeevn/Downloads/nexmart/src/components/os/AgentOrb.tsx';
let agentOrb = fs.readFileSync(agentOrbFile, 'utf8');

const dynamicFastTrack = `
  const randomResponse = (responses: string[]) => responses[Math.floor(Math.random() * responses.length)];
  
  const productTitle = matchingProducts.length > 0 ? matchingProducts[0].title : "the item";
  const productCount = matchingProducts.length;

  if (fastTrackActions.includes(action)) {
    if (action === 'SEARCH') {
      const searchString = extractedIntent?.productType || extractedIntent?.category || generatedKeywords.join(" ") || userMessage;
      if (matchingProducts.length > 0) {
        fullResponse = randomResponse([
          \`I found \${productCount} option\${productCount > 1 ? 's' : ''} for \${searchString}. The top match is the \${productTitle}. Take a look!\`,
          \`Here are \${productCount} great option\${productCount > 1 ? 's' : ''} I found for you. Would you like me to compare them?\`,
          \`I've pulled up \${productCount} product\${productCount > 1 ? 's' : ''} that fit your request, including the \${productTitle}. Check them out!\`
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
        \`I've added the \${productTitle} to your cart. What would you like to do next?\`,
        \`Done! The \${productTitle} is in your cart. Ready to checkout?\`,
        \`It's in your cart! Let me know if you want to keep shopping or check out.\`
      ]);
    } else if (action === 'WISHLIST') {
      fullResponse = randomResponse([
        \`Got it. I've saved the \${productTitle} to your wishlist.\`,
        \`Saved to your wishlist! Need help with anything else?\`,
        \`I've bookmarked the \${productTitle} for you in your wishlist.\`
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
  /const randomResponse = \(\s*responses\s*:\s*string\[\]\s*\)[\s\S]*?\}\s*\}\s*(?=\n\s*setAgentMessage\(fullResponse\);)/m,
  dynamicFastTrack.trim()
);

fs.writeFileSync(agentOrbFile, agentOrb);
console.log("Patched dynamic intelligence!");
