import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const card = await prisma.card.findUnique({
        where: { id: parseInt(id) }
      });

      if (!card) {
        return res.status(404).json({ error: 'Card not found' });
      }

      res.status(200).json(card);
    } catch (error) {
      console.error('Error fetching card:', error);
      res.status(500).json({ error: 'Failed to fetch card' });
    }
  } else if (req.method === 'PUT') {
    try {
      const card = await prisma.card.update({
        where: { id: parseInt(id) },
        data: req.body
      });

      res.status(200).json(card);
    } catch (error) {
      console.error('Error updating card:', error);
      res.status(500).json({ error: 'Failed to update card' });
    }
  } else if (req.method === 'DELETE') {
    try {
      await prisma.card.delete({
        where: { id: parseInt(id) }
      });

      res.status(204).end();
    } catch (error) {
      console.error('Error deleting card:', error);
      res.status(500).json({ error: 'Failed to delete card' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 