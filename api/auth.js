import bcrypt from 'bcryptjs';
import { db, ObjectId, sign, userId } from './_db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { action, email, password, avatar } = req.body || {};
  try {
    const users = (await db()).collection('users');
    await users.createIndex({ email: 1 }, { unique: true });

    if (action === 'avatar') {
      const uid = userId(req);
      if (!uid) return res.status(401).json({ error: 'Inicia sesión para continuar.' });
      await users.updateOne({ _id: new ObjectId(uid) }, { $set: { avatar: Math.abs(parseInt(avatar)) % 6 } });
      return res.json({ ok: true });
    }
    if (!/^\S+@\S+\.\S+$/.test(email || '') || (password || '').length < 8) {
      return res.status(400).json({ error: 'Escribe un correo válido y una contraseña de mínimo 8 caracteres.' });
    }
    const mail = email.toLowerCase().trim();
    if (action === 'register') {
      if (await users.findOne({ email: mail })) return res.status(409).json({ error: 'Ese correo ya está registrado. Inicia sesión.' });
      const r = await users.insertOne({ email: mail, hash: await bcrypt.hash(password, 10), avatar: 0, rol: 'usuario', creado: new Date() });
      return res.json({ token: sign(r.insertedId), user: { email: mail, avatar: 0 } });
    }
    const u = await users.findOne({ email: mail });
    if (!u || !(await bcrypt.compare(password, u.hash))) return res.status(401).json({ error: 'Correo o contraseña incorrectos.' });
    res.json({ token: sign(u._id), user: { email: u.email, avatar: u.avatar || 0 } });
  } catch (e) {
    res.status(500).json({ error: 'No se pudo conectar con la base de datos. Revisa MONGODB_URI.' });
  }
}
