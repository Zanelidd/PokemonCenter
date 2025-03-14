import { authService } from './auth.service.ts';
import { cardService } from './card.service.ts';


const api = {
  auth: authService,
  card: cardService,
};

export default api;


