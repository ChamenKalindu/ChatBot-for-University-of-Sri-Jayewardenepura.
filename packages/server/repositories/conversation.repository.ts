import type { ChatCompletionMessageParam } from 'openai/resources';
import fs from 'fs';
import path from 'path';
import template from '../prompts/chatbot.txt';

const uniInfo = fs.readFileSync(
   path.join(__dirname, '../prompts/japura.md'),
   'utf-8'
);
const instructions = template.replace('{{parkInfo}}', uniInfo);

const conversations: Record<string, ChatCompletionMessageParam[]> = {};

export const conversationRepository = {
   startConversation(conversationId: string) {
      if (!conversations[conversationId]) {
         conversations[conversationId] = [
            {
               role: 'system',
               content: instructions,
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
