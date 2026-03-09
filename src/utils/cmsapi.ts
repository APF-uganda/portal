import axios from 'axios';
import { CMS_API_URL } from '../config/api';

const api = axios.create({
  baseURL: CMS_API_URL,
});

export default api;
