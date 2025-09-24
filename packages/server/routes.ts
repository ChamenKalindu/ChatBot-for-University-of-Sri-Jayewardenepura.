import { Router } from 'express';
import { chatController } from './controllers/chat.controller';

const router = Router();

router.get('/', async (req, res) => {
   res.send('hello world!');
});

router.get('/api/hello', (req, res) => {
   res.send('hello world');
});

router.post('/api/chat', chatController.sendMessage);

export default router;
