export default function handler(req, res) {
  res.status(200).json({ 
    status: 'ok', 
    message: 'APEX AI Backend is running',
    timestamp: new Date().toISOString()
  });
}
