// api.js
import axios from 'axios';

// Mantenha o seu IP aqui (o modo Tunnel do Expo se encarrega de mapear a rota interna)
const IP_COMPUTADOR = '192.168.0.5'; // Use o IP que você encontrou da rede wi-fi, quando mudar de rede pode ser necessario alterar o ip, pois o sistema pode travar

const api = axios.create({
  baseURL: `http://${IP_COMPUTADOR}:3000`,
  timeout: 5000, // Se o backend não responder em 5 segundos, o app cancela e avisa
});

export default api;