import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;
  console.log('Request method:', req.method);
  console.log('Card ID:', id);

  if (req.method === 'GET') {
    try {
      console.log('Fetching card with ID:', id);
      const card = await prisma.card.findUnique({
        where: { id }
      });

      console.log('Found card:', card);

      if (!card) {
        console.log('Card not found');
        return res.status(404).json({ error: 'Card not found' });
      }

      res.status(200).json(card);
    } catch (error) {
      console.error('Error fetching card:', error);
      res.status(500).json({ error: `Failed to fetch card: ${error.message}` });
    }
  } else if (req.method === 'PUT') {
    try {
      console.log('Updating card with ID:', id);
      console.log('Update data:', req.body);
      
      const card = await prisma.card.update({
        where: { id },
        data: {
          title: req.body.title.trim(),
          description: req.body.description.trim(),
          type: req.body.type,
          budget: String(req.body.budget || '0'),
          budgetValue: parseInt(req.body.budget || '0', 10),
          experience: req.body.type === 'supplier' ? parseInt(req.body.experience || '0', 10) : null,
          foundedYear: req.body.type === 'advertiser' ? parseInt(req.body.foundedYear || '0', 10) : null,
          trafficSource: req.body.type === 'supplier' ? (req.body.trafficSource || '').trim() : '',
          sources: req.body.type === 'advertiser' ? 
            (Array.isArray(req.body.sources) ? req.body.sources.map(s => s.trim()).filter(Boolean) : []) : [],
          goals: Array.isArray(req.body.goals) ? req.body.goals.map(g => g.trim()).filter(Boolean) : [],
          advantages: Array.isArray(req.body.advantages) ? req.body.advantages.map(a => a.trim()).filter(Boolean) : [],
          features: []
        }
      });

      console.log('Updated card:', card);
      res.status(200).json(card);
    } catch (error) {
      console.error('Error updating card:', error);
      res.status(500).json({ error: `Failed to update card: ${error.message}` });
    }
  } else if (req.method === 'DELETE') {
    try {
      console.log('Deleting card with ID:', id);
      
      await prisma.card.delete({
        where: { id }
      });

      console.log('Card deleted successfully');
      res.status(204).end();
    } catch (error) {
      console.error('Error deleting card:', error);
      res.status(500).json({ error: `Failed to delete card: ${error.message}` });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  await prisma.$disconnect();
} 