import express from 'express';
import { User } from '../models/User';
import { Participant } from '../models/Participant';
import { Message } from '../models/Message';
import { Request, Response, Router } from 'express';

const router: Router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the user
 *         name:
 *           type: string
 *           description: The name of the user
 *       example:
 *         id: "1"
 *         name: "Alice"
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get('/', async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Log in or create a user
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the user
 *     responses:
 *       200:
 *         description: User successfully logged in or created
 *       400:
 *         description: Bad request
 */

router.post('/', async (req: Request, res: Response): Promise<any> => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Name is required.' });
  }

  try {
    // Find or create the user
    const [user] = await User.findOrCreate({
      where: { name },
    });

    // Update or create the participant entry
    let participant = await Participant.findOne({ where: { userId: user.id } });
    if (!participant) {
      participant = await Participant.create({
        userId: user.id,
        joinedAt: new Date(),
        isActive: true,
      });
    } else {
      await participant.update({
        joinedAt: new Date(),
        isActive: true,
      });
    }

    // Return the user data
    return res.status(200).json(user);
  } catch (error) {
    console.error('Error logging in user:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});
/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user, associated participant, and messages
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to delete
 *     responses:
 *       200:
 *         description: User successfully deleted
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;

  try {
    // Find user by ID
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete all messages sent by this user
    await Message.destroy({ where: { senderId: id } });

    // Delete the associated participant entry
    await Participant.destroy({ where: { userId: id } });

    // Delete the user
    await user.destroy();

    return res.status(200).json({ message: 'User and all related data deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
