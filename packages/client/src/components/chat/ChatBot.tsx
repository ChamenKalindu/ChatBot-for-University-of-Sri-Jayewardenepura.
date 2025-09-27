import React, { useRef, useState } from 'react';
import axios from 'axios';
import { Button } from '../ui/button';
import { FaArrowUp } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import TypingIndicator from './TypingIndicator';
import type { message } from './ChatMessages';
import ChatMessages from './ChatMessages';
import notificationSound from '@/assets/audio/notification.mp3';
import popSound from '@/assets/audio/pop.mp3';

const popAudio = new Audio(popSound);
const notificationAudio = new Audio(notificationSound);

type FormData = {
   prompt: string;
};

type chatResponse = {
   message: string;
};

const ChatBot = () => {
   const [messages, setMessages] = useState<message[]>([]);
   const [isBotTyping, setIsBotTyping] = useState(false);
   const [error, setError] = useState('');
   const conversationId = useRef(crypto.randomUUID());
   const { register, handleSubmit, reset, formState } = useForm<FormData>();

   const onSubmit = async ({ prompt }: FormData) => {
      try {
         setMessages((prev) => [...prev, { content: prompt, role: 'user' }]);
         setIsBotTyping(true);
         setError('');
         popAudio.play();

         reset({ prompt: '' });

         const { data } = await axios.post<chatResponse>('/api/chat', {
            prompt: prompt,
            conversationId: conversationId.current,
         });

         setMessages((prev) => [
            ...prev,
            { content: data.message, role: 'bot' },
         ]);
         notificationAudio.play();
      } catch (error) {
         console.log(error);
         setError('Something went wrong, try again');
      } finally {
         setIsBotTyping(false);
      }
   };

   const onKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         handleSubmit(onSubmit)();
      }
   };

   return (
      <div className="flex flex-col h-full w-3/4 mx-auto">
         <div className="flex flex-col flex-1 overflow-y-auto gap-3 mb-10">
            {/* Display chat messages */}
            <ChatMessages messages={messages} />

            {/* Typing Indicator */}
            {isBotTyping && <TypingIndicator />}
            {error && <p className="text-red-500">{error}</p>}
         </div>
         <form
            onSubmit={handleSubmit(onSubmit)}
            onKeyDown={onKeyDown}
            className="flex flex-col gap-2 items-end border-2 rounded-3xl p-4 mb-10"
         >
            <textarea
               {...register('prompt', {
                  required: true,
                  validate: (data) => data.trim().length > 0,
               })}
               className="w-full border-0 focus:outline-0 resize-none"
               placeholder="Ask Anything"
               autoFocus
            />
            <Button
               disabled={!formState.isValid}
               className="w-9 h-9 rounded-full"
            >
               <FaArrowUp />
            </Button>
         </form>
      </div>
   );
};

export default ChatBot;
