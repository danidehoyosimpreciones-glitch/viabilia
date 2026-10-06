import { db, ObjectId, userId } from './_db.js';

export default async function handler(req, res) {
  const uid = userId(req);
  if (!uid) return res.status(401).json({ error: 'Inicia sesión para continuar.' });
  const own = (i) => (ObjectId.isValid(i) ? { _id: new ObjectId(i), uid } : null);
  try {
    const col = (await db()).collection('projects');
    if (req.method === 'GET') {
      if (req.query.id) {
        const p = own(req.query.id) && await col.findOne(own(req.query.id));
        return p ? res.json({ id: p._id, name: p.name, data: p.data }) : res.status(404).json({ error: 'Proyecto no encontrado.' });
      }
      const l = await col.find({ uid }).sort({ updated: -1 }).project({ name: 1, updated: 1 }).toArray();
      return res.json(l.map((p) => ({ id: p._id, name: p.name, updated: p.updated })));
    }
    if (req.method === 'POST') {
      const { id, name, data } = req.body || {};
      if (typeof name !== 'string' || !name.trim() || name.length > 120 || typeof data !== 'object' || JSON.stringify(data).length > 50000) {
        return res.status(400).json({ error: 'Revisa el nombre del proyecto y los datos.' });
      }
      if (id) {
        const r = own(id) && await col.updateOne(own(id), { $set: { name, data, updated: new Date() } });
        return r && r.matchedCount ? res.json({ id }) : res.status(404).json({ error: 'Proyecto no encontrado.' });
      }
      const r = await col.insertOne({ uid, name, data, updated: new Date() });
      return res.json({ id: r.insertedId });
    }
    if (req.method === 'DELETE') {
      if (own(req.query.id)) await col.deleteOne(own(req.query.id));
      return res.json({ ok: true });
    }
    res.status(405).end();
  } catch (e) {
    res.status(500).json({ error: 'Error del servidor.' });
  }
}
