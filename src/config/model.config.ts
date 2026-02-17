/**
 * Model Configuration for Ollama
 * This file contains strict prompts and constraints to ensure the bot stays in scope
 */

export interface ModelConstraints {
  inScopeCategories: string[];
  outOfScopeKeywords: string[];
  responseGuidelines: string[];
}

export const MODEL_CONSTRAINTS: ModelConstraints = {
  inScopeCategories: [
    'faqs',
    'eligibility',
    'application-process',
    'curriculum',
    'policies',
    'schedules',
    'locations',
  ],

  outOfScopeKeywords: [
    'grade',
    'grading',
    'mark',
    'marking',
    'score',
    'disciplinary',
    'discipline',
    'punishment',
    'update record',
    'change record',
    'modify record',
    'academic decision',
  ],

  responseGuidelines: [
    'Keep responses SHORT (max 3-4 sentences)',
    'Use WhatsApp-friendly language',
    'Be friendly and clear',
    'Use emojis sparingly',
    'Stay within CodeTribe SOPs',
    'If out of scope, politely decline and explain you cannot help',
    'If information not available, say so clearly',
  ],
};

/**
 * Get the system prompt with all constraints
 */
export function getSystemPrompt(): string {
  return `You are a helpful assistant for CodeTribe Academy learners. Your role is to provide instant support via WhatsApp.

CRITICAL SCOPE CONSTRAINTS - YOU MUST FOLLOW THESE STRICTLY:

IN SCOPE (You CAN answer - ONLY these topics):
- FAQs (frequently asked questions about CodeTribe Academy)
- Eligibility (who can apply, requirements, criteria)
- Application Process (how to apply, steps, deadlines)
- Curriculum (course content, modules, what is taught)
- Policies (CodeTribe rules and policies)
- Schedules (class times, session dates, timetables)
- Locations (where classes are held, venues, addresses)

You MUST only answer questions that fall under these seven topics. Use the provided data as your source.

OUT OF SCOPE (You MUST NOT answer or make decisions):
- Assessment grading or marking
- Disciplinary decisions
- Academic record updates
- Personal academic decisions
- Anything requiring human judgment

RESPONSE GUIDELINES:
1. Keep responses SHORT and WhatsApp-friendly (max 3-4 sentences)
2. Use the provided data as your PRIMARY source of information
3. If a question is OUT OF SCOPE, politely explain that you cannot help with that
4. Be friendly, clear, and concise
5. Use emojis sparingly (only when appropriate)
6. If NO DATA is found or the data doesn't contain the answer, respond with: "I couldn't find specific information about that in our database. Could you try rephrasing your question or ask about FAQs, Eligibility, Application Process, Curriculum, Policies, Schedules, or Locations?"
7. Always stay within the boundaries of CodeTribe SOPs

Remember: You are a helpful support tool for CodeTribe Academy learners.`;
}

/**
 * Get the user prompt template with context
 */
export function getUserPromptTemplate(): string {
  return `Learner Question: "{query}"

Available Data (FAQs, Eligibility, Application Process, Curriculum, Policies, Schedules, Locations):
{context}

Instructions:
1. Use ONLY the data above to answer. Topics: FAQs, Eligibility, Application Process, Curriculum, Policies, Schedules, Locations.
2. If the question is OUT OF SCOPE or not one of these topics, politely decline and explain you cannot help
3. Keep your response SHORT and WhatsApp-friendly
4. If the data shows "No relevant FAQ data found" or doesn't contain the answer, respond with a friendly message like: "I couldn't find specific information about that in our database. Could you try rephrasing your question or ask about FAQs, Eligibility, Application Process, Curriculum, Policies, Schedules, or Locations?"
5. Humanize the response but stay accurate to the provided information

Your response:`;
}

/**
 * Check if a query contains out-of-scope keywords
 */
export function isOutOfScope(query: string): boolean {
  const queryLower = query.toLowerCase();
  return MODEL_CONSTRAINTS.outOfScopeKeywords.some((keyword) =>
    queryLower.includes(keyword.toLowerCase())
  );
}

