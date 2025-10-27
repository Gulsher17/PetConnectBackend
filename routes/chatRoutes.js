// routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const chatController = require('../controllers/chatController');

// Adoption / regular chats
router.get('/', auth, chatController.getAllChats); 
router.get('/adoption/:adoptionRequestId', auth, chatController.getOrCreateChat); 
router.get('/:chatId/messages', auth, chatController.getMessages); 
router.post('/:chatId/messages', auth, chatController.sendMessage); 

// Image uploads (Jpg, jpeg, etc.)
router.post('/:chatId/attachments/images', auth,  chatController.sendAttachmentMessage);

// File uploads (pdf, docx, etc.)
router.post('/:chatId/attachments/files',auth, chatController.sendAttachmentMessage);

module.exports = router;

