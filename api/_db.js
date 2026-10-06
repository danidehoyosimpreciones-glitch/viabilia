import { MongoClient, ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

// La conexión se reutiliza entre llamadas para no abrir una nueva cada vez
const cliente = (globalThis._mongo ||= new MongoClient(process.env.MONGODB_URI).connect());
export const db = async () => (await cliente).db('viabilia');
export { ObjectId };
export const sign = (id) => jwt.sign({ id: String(id) }, process.env.JWT_SECRET, { expiresIn: '7d' });

// Devuelve el id del usuario si el token es válido, o null
export function userId(req) {
  try {
    return jwt.verify((req.headers.authorization || '').replace('Bearer ', ''), process.env.JWT_SECRET).id;
  } catch { return null; }
}
