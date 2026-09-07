import { askAssistant, isAssistantConfigured } from '../services/assistant.service.js';
import { ApiError } from '../utils/ApiError.js';

export async function chat(req, res) {
  if (!isAssistantConfigured()) {
    throw new ApiError(503, 'The assistant is not configured on this server');
  }

  let reply;

  try {
    reply = await askAssistant(req.body.messages);
  } catch (error) {
    console.error(error);
    throw new ApiError(502, 'The assistant is unavailable right now, please try again');
  }

  res.json({ success: true, data: { reply } });
}
