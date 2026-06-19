// api.js
import axios from "axios";

const api = axios.create({
  baseURL: `http://localhost:3000`,
  timeout: 5000, // Se o backend não responder em 5 segundos, o app cancela e avisa
});

export default api;
