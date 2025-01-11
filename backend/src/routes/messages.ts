import express from 'express';
import { Message } from '../models/Message';

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
router.get('/', async (req, res) => {
  try {
    const messages = await Message.findAll({ include: ['sender'] });
    res.json(messages);
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

export default router;
