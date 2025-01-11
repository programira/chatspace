import express from 'express';
import { User } from '../models/User';

const router = express.Router();

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
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: The user was successfully created
 */
router.post('/', async (req, res) => {
  const { name, avatarUrl } = req.body;
  const user = await User.create({ name });
  res.status(201).json(user);
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
