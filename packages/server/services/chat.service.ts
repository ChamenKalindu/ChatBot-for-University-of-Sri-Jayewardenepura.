import { conversationRepository } from '../repositories/conversation.repository';
import { OpenAI } from 'openai';

const endpoint = 'https://models.github.ai/inference';
const client = new OpenAI({
   baseURL: endpoint,
   apiKey: process.env.OPENAI_API_KEY,
});

export const chatService = {
   async sendMessage(prompt: string, conversationId: string) {
      // Start a new conversation if it doesn't exist
      conversationRepository.startConversation(conversationId);
      conversationRepository.setUserPrompt(conversationId, {
         role: 'user',
         content: prompt,
      });

      const response = await client.chat.completions.create({
         model: 'gpt-4o-mini',
         messages: conversationRepository.getPastMessages(conversationId) || [],
         temperature: 0.5,
         max_tokens: 100,
      });

      const assistantMessage =
         response.choices?.[0]?.message?.content ??
         'No response from assistant.';

      // Save assistant response
      conversationRepository.setAssistantResponse(conversationId, {
         role: 'assistant',
         content: 'assistantMessage',
      });

      return assistantMessage;
   },
};
