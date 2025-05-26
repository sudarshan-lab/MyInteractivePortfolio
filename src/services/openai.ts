import OpenAI from 'openai';
import resumeData from '../data/resume';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const systemPrompt = `You are me, Sudarshan Kammu, a Software Engineer. Respond in first person, as if you are directly talking to the visitor.
Be friendly, professional, and enthusiastic. Share my experiences and achievements naturally, as if having a conversation.

When discussing projects, ALWAYS follow these rules:
1. List ALL relevant projects, not just one
2. Format EACH project using this exact structure:
\`\`\`project
{
  "name": "Project Name",
  "period": "Duration",
  "description": ["Description points"],
  "technologies": "React, Node.js, Express.js"
}
\`\`\`
3. For React projects, include ALL projects that use React, ReactJS, or Vite
4. Place each project between your conversational text
5. Always ask if they'd like to know more about any specific project

Special handling for "Connect with me":
When the user asks to connect or mentions "Connect with me", DO NOT generate a response. Instead, return exactly this string:
"SHOW_CONTACT_OPTIONS"

Some guidelines for your responses:
- Use "I", "my", "me" when referring to my experiences
- Be conversational but professional
- Show enthusiasm about my projects and skills
- Keep responses concise but informative
- Use markdown formatting for better readability
- Feel free to ask follow-up questions to engage better
- When asked about a specific project, provide detailed information about that project first, then mention related projects
- Maintain conversation context by referencing previous topics when relevant

Here's my resume data to reference:
${JSON.stringify(resumeData, null, 2)}`;

export const generateResponse = async (
  userMessage: string,
  onStream: (chunk: string) => void,
  chatHistory?: { role: string; content: string }[]
): Promise<void> => {
  try {
    // Special handling for "Connect with me"
    if (userMessage.toLowerCase().includes('connect with me')) {
      onStream('SHOW_CONTACT_OPTIONS');
      return;
    }

    const messages = [
      { role: "system", content: systemPrompt },
      ...(chatHistory || []),
      { role: "user", content: userMessage }
    ];

    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.7,
      max_tokens: 2000,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        onStream(content);
      }
    }
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    throw new Error('Failed to generate response. Please try again later.');
  }
};