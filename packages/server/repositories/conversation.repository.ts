import type { ChatCompletionMessageParam } from 'openai/resources';

const conversations: Record<string, ChatCompletionMessageParam[]> = {};

export const conversationRepository = {
   startConversation(conversationId: string) {
      if (!conversations[conversationId]) {
         conversations[conversationId] = [
            {
               role: 'system',
               content:
                  'You are a helpful assistant. You are answering quiz questions and remembering previous ones.',
            },
         ];
      }
   },
   getPastMessages(conversationId: string) {
      return conversations[conversationId];
   },
   setUserPrompt(
      conversationId: string,
      newMessage: ChatCompletionMessageParam
   ) {
      conversations[conversationId]?.push(newMessage);
   },
   setAssistantResponse(
      conversationId: string,
      newMessage: ChatCompletionMessageParam
   ) {
      conversations[conversationId]?.push(newMessage);
   },
};
