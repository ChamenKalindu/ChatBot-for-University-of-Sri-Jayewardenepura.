import type { Request, Response } from 'express';
import { z } from 'zod';
import { chatService } from '../services/chat.service.js';

const chatSchema = z.object({
   prompt: z
      .string()
      .trim()
      .min(1, 'Prompt is required')
      .max(1000, 'Prompt is too long'),
   conversationId: z.uuid(),
});

export const chatController = {
   async sendMessage(req: Request, res: Response) {
      // validation
      const parseResult = chatSchema.safeParse(req.body);
      if (!parseResult.success) {
         res.status(400).send(parseResult.error.message);
         return;
      }

      const { prompt, conversationId } = req.body;

      try {
         const assistantMessage = await chatService.sendMessage(
            prompt,
            conversationId
         );
         res.send({ message: assistantMessage });
      } catch (error) {
         res.status(500).json(
            'Failed to generate response from the assistant.'
         );
      }
   },
};
