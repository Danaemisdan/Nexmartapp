<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Engineering Principles
• Preserve full backward compatibility.
• Build on the existing taxonomy and query understanding implementation.
• Do not redesign the current architecture.
• Keep search logic modular, reusable, and easy to extend.
• Prefer configuration files over hardcoded logic.
• Keep search deterministic and explainable.
• Every ranking decision should be traceable and debuggable.
• Use named constants instead of magic numbers.
• Keep metadata optional so products without taxonomy remain searchable.
• Normalize inputs before matching rather than adding duplicate rules.
• Keep memory usage low.
• Do not preload or index the full catalog.
• Do not introduce additional search passes unless they provide measurable value.
• Avoid category-specific code. New categories should be added by updating taxonomy configuration rather than modifying search logic.
• Keep startup time unchanged.
• Preserve existing AI features (conversation, cart, checkout, recommendations, speech).
• Ensure future commerce providers can integrate by extending metadata rather than changing search behaviour.
• Optimize for maintainability, observability, and search quality before adding new AI capabilities.
