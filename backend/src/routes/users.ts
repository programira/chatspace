import express from 'express';
import { User } from '../models/User';
import { Participant } from '../models/Participant';
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

// /**
//  * @swagger
//  * /api/users/{id}:
//  *   patch:
//  *     summary: Update a user
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: The user ID
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             $ref: '#/components/schemas/User'
//  *     responses:
//  *       200:
//  *         description: The user was successfully updated
//  */
// router.patch('/:id', async (req, res) => {
//   const { id } = req.params;
//   const { name, avatarUrl, isActive } = req.body;

//   const user = await User.findByPk(id);
//   if (!user) {
//     return res.status(404).json({ message: 'User not found' });
//   }

//   await user.update({ name, avatarUrl, isActive });
//   res.json(user);
// });

// /**
//  * @swagger
//  * /api/users/{id}:
//  *   delete:
//  *     summary: Delete a user
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: The user ID
//  *     responses:
//  *       200:
//  *         description: The user was successfully deleted
//  */
// router.delete('/:id', async (req, res) => {
//   const { id } = req.params;

//   const user = await User.findByPk(id);
//   if (!user) {
//     return res.status(404).json({ message: 'User not found' });
//   }

//   await user.destroy();
//   res.status(200).json({ message: 'User deleted' });
// });

export default router;
