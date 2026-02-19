/**
 * model.config.ts
 *
 * Central place for all prompts.  Keep these tight — every extra sentence
 * the model has to process adds latency on a local llama3.2 instance.
 */

// ─── System prompt ────────────────────────────────────────────────────────────
// Concise and directive.  Listing what NOT to do is more effective than long
// role descriptions for smaller models like llama3.2.

const SYSTEM_PROMPT = `You are a helpful assistant for CodeTribe Academy, a tech-skills programme run by MojaMedia.

Your job:
- Answer questions about CodeTribe Academy ONLY — eligibility, application, curriculum, schedule, costs, policies, logistics.
- Use the knowledge base provided in each message. Do not invent facts.
- Give direct, concise answers in plain text suitable for WhatsApp (no markdown headers, no bullet overload).
- IMPORTANT: The knowledge base contains relevant FAQs. Even if they don't perfectly match the question, USE THEM to provide helpful information.
- If the knowledge base contains relevant information (even if not a perfect match), synthesize it into a helpful answer.
- Only say "I don't have that information" if the knowledge base is completely empty or contains zero relevant information.
- Be proactive: if FAQs mention eligibility requirements, application steps, or curriculum details, share them even if the exact wording differs.
- Never discuss topics unrelated to CodeTribe Academy.`;

// ─── User prompt template ─────────────────────────────────────────────────────
// {context} and {query} are replaced at runtime.
// Putting CONTEXT before the question keeps llama3.2 grounded in the facts.

const USER_PROMPT_TEMPLATE = `KNOWLEDGE BASE:
{context}

QUESTION: {query}

Answer based only on the knowledge base above. Be direct and concise (2–4 sentences). No markdown.`;

// ─── Out-of-scope detection ───────────────────────────────────────────────────
// Fast client-side guard — skips the Ollama round-trip for obviously off-topic queries.

const OUT_OF_SCOPE_PATTERNS = [
  /\b(weather|sport|football|cricket|news|stock|crypto|bitcoin|recipe|cook)\b/i,
  /\b(write (me |a )?(code|script|essay|email|letter))\b/i,
  /\b(who (is|was) (the )?(president|prime minister|ceo))\b/i,
  /\b(translate|summarize|summarise)\b/i,
];

export function getSystemPrompt(): string {
  return SYSTEM_PROMPT;
}

export function getUserPromptTemplate(): string {
  return USER_PROMPT_TEMPLATE;
}

export function isOutOfScope(query: string): boolean {
  return OUT_OF_SCOPE_PATTERNS.some((p) => p.test(query));
}