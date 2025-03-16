import { authService } from './auth.service.ts';
import { cardService } from './card.service.ts';
import { apiCardService } from './apiCard.service.ts';


const api = {
  auth: authService,
  card: cardService,
  apiCard : apiCardService
};

export default api;


