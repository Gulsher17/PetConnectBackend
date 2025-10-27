// controllers/chatController.js
const chatService = require('../services/chatService');
const { getIO } = require('../server/socket');

exports.getAllChats = async (req, res) => {
  try {
    const result = await chatService.getAllChats(req.user.id);
    res.json(result);
  } catch (error) {
    console.error('Get chats error:', error);
    res.status(500).json({ success: false, msg: error.message });
  }
};

exports.getOrCreateChat = async (req, res) => {
  try {
    const result = await chatService.getOrCreateChat(req.user.id, req.params.adoptionRequestId);
    res.json(result);
  } catch (error) {
    console.error('Get or create chat error:', error);
    res.status(500).json({ success: false, msg: error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const result = await chatService.getMessages(req.user.id, req.params.chatId);
    res.json(result);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ success: false, msg: error.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { content, messageType = 'text', attachments, metadata } = req.body;
    const result = await chatService.sendMessage(
      req.user.id, req.params.chatId, content, messageType, attachments, metadata
    );
    res.json(result);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ success: false, msg: error.message });
  }
};

exports.sendAttachmentMessage = async (req, res) => {
  try {

  // Determine message type (image or file)
    const isImage = !!req.files?.[0]?.mimetype?.startsWith('image/');
    const messageType = isImage ? 'image' : 'file';

  // Prepare attachments array
    const attachments = (req.files || []).map((f) => ({
      url: f.path,             // Cloudinary URL
      type: f.mimetype,        // e.g., image/png, application/pdf
      filename: f.originalname,
      size: f.size,
    }));

  // Default content if user didn’t provide one
    const content =
      req.body?.content?.trim() ||
      (isImage ? 'Sent image(s)' : ' Sent file(s)');

  // Call chat service to create the message
    const result = await chatService.sendMessage(
      req.user.id,req.params.chatId,content,messageType,attachments,{}
    );

//Emit the message to all connected chat participants
    const io = getIO();
    io.to(`chat-${req.params.chatId}`).emit('new-message', result.message);

    res.json(result);
  } catch (error) {
    console.error('Send attachment message error:', error);
    res.status(500).json({ success: false, msg: error.message });
  }
};

