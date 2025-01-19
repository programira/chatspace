import express from 'express';
import { Message } from '../models/Message';
import { User } from '../models/User';
import { Request, Response, Router } from 'express';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Message:
 *       type: object
 *       required:
 *         - senderId
 *         - text
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the message
 *         senderId:
 *           type: string
 *           description: ID of the user who sent the message
 *         text:
 *           type: string
 *           description: The content of the message
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The time the message was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The time the message was last updated
 *       example:
 *         id: "1"
 *         senderId: "123"
 *         text: "Hello, world!"
 *         createdAt: "2025-01-01T12:00:00Z"
 *         updatedAt: "2025-01-01T12:10:00Z"
 */

/**
 * @swagger
 * /api/messages:
 *   get:
 *     summary: Get all messages
 *     tags:
 *       - Messages
 *     responses:
 *       200:
 *         description: List of messages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Message'
 */
router.get('/', async (req: Request, res: Response) : Promise<any> => { 
  // Parse the "limit" query parameter (default: 20)
  const limit = parseInt(req.query.limit as string, 10) || 20;
  
  try {
    const messages = await Message.findAll({ 
      include: [
        {
          model: User,
          as: 'messageSender', // This alias is used in the model associations Message.belongsTo(User, { foreignKey: 'senderId', as: 'messageSender' });
          attributes: ['name'],
        },
      ],
      order: [['createdAt', 'DESC']],
      limit,
    });
    // Reverse messages to show older ones first (for natural chat flow)
    res.json(messages.reverse());
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

/**
 * @swagger
 * /api/messages:
 *   post:
 *     summary: Create a new message
 *     tags:
 *       - Messages
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Message'
 *     responses:
 *       201:
 *         description: Message successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 */
router.post('/', async (req, res) => {
  try {
    const { text, senderId } = req.body;
    const message = await Message.create({ text, senderId });
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create message' });
  }
});


/**
 * @swagger
 * /api/messages/{id}:
 *   put:
 *     summary: Update a message
 *     tags:
 *       - Messages
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the message to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 description: The new text of the message
 *               senderId:
 *                 type: string
 *                 description: The ID of the sender (current user)
 *     responses:
 *       200:
 *         description: The updated message
 *       400:
 *         description: Bad request
 *       404:
 *         description: Message not found
 *       403:
 *         description: Forbidden
 */

router.put('/:id', async (req: Request, res: Response) : Promise<any> => { 
  const { id } = req.params;
  const { text, senderId } = req.body;

  if (!text || !senderId) {
    return res.status(400).json({ message: 'Text and senderId are required.' });
  }

  try {
    const message = await Message.findByPk(id);

    if (!message) {
      return res.status(404).json({ message: 'Message not found.' });
    }

    if (message.senderId !== senderId) {
      return res.status(403).json({ message: 'You are not authorized to update this message.' });
    }

    await message.update({
      text,
      updatedAt: new Date(),
    });

    res.json(message);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update message' });
  }
});

/**
 * @swagger
 * /api/messages/{id}/delete:
 *   put:
 *     summary: Mark a message as deleted
 *     tags:
 *       - Messages
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the message to mark as deleted
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               senderId:
 *                 type: string
 *                 description: The ID of the sender (current user)
 *     responses:
 *       200:
 *         description: The updated message
 *       404:
 *         description: Message not found
 *       403:
 *         description: Forbidden
 */
router.put('/:id/delete', async (req: Request, res: Response) : Promise<any> => { 
  const { id } = req.params;
  const { senderId } = req.body;

  if (!senderId) {
    return res.status(400).json({ message: 'SenderId is required.' });
  }

  try {
    const message = await Message.findByPk(id);

    if (!message) {
      return res.status(404).json({ message: 'Message not found.' });
    }

    if (message.senderId !== senderId) {
      return res.status(403).json({ message: 'You are not authorized to delete this message.' });
    }

    await message.update({
      text: 'This message was deleted',
      updatedAt: new Date(),
    });

    res.json(message);
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark message as deleted' });
  }
});

export default router;
