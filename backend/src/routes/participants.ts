import express from 'express';
import { Participant } from '../models/Participant';
import { User } from '../models/User';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Participant:
 *       type: object
 *       required:
 *         - userId
 *         - joinedAt
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the participant
 *         userId:
 *           type: string
 *           description: ID of the user who is participating
 *         joinedAt:
 *           type: string
 *           format: date-time
 *           description: The time the participant joined
 *         isActive:
 *           type: boolean
 *           description: Whether the participant is currently active
 *         user:
 *           type: object
 *           description: Details of the user
 *           properties:
 *             id:
 *               type: string
 *               description: The user ID
 *             name:
 *               type: string
 *               description: The user's name
 *             avatarUrl:
 *               type: string
 *               description: The user's avatar URL
 *             isActive:
 *               type: boolean
 *               description: Whether the user is currently active
 *       example:
 *         id: "1"
 *         userId: "123"
 *         joinedAt: "2025-01-01T12:00:00Z"
 *         isActive: true
 *         user:
 *           id: "123"
 *           name: "Alice"
 *           avatarUrl: "https://example.com/avatar.jpg"
 *           isActive: true
 */

/**
 * @swagger
 * /api/participants:
 *   get:
 *     summary: Get all participants
 *     tags:
 *       - Participants
 *     responses:
 *       200:
 *         description: List of participants
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Participant'
 */
router.get('/', async (req, res) => {
  try {
    const participants = await Participant.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'avatarUrl', 'isActive']
        }
      ]
    });
    res.json(participants);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch participants' });
  }
});

/**
 * @swagger
 * /api/participants:
 *   post:
 *     summary: Add a participant
 *     tags:
 *       - Participants
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Participant'
 *     responses:
 *       201:
 *         description: Participant successfully added
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Participant'
 */
router.post('/', async (req, res) => {
  try {
    const { userId, joinedAt } = req.body;
    const participant = await Participant.create({ userId, joinedAt });
    res.status(201).json(participant);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add participant' });
  }
});

// /**
//  * @swagger
//  * /api/participants/{id}:
//  *   delete:
//  *     summary: Remove a participant
//  *     tags:
//  *       - Participants
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: The participant ID
//  *     responses:
//  *       200:
//  *         description: Participant successfully removed
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 message:
//  *                   type: string
//  *                   example: "Participant removed."
//  */
// router.delete('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     await Participant.destroy({ where: { id } });
//     res.status(200).json({ message: 'Participant removed.' });
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to remove participant' });
//   }
// });

export default router;
