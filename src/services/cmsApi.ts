import axios from 'axios';

const STRAPI_URL = 'http://localhost:1337';
const ADMIN_TOKEN = '0889ca4cdbb55fdeddaa95f0dfca91eb8bb3dc15664b0912f4d1eeb661e9b905391c39fe965054160282519bf8fa7e8570b53b98d4a6f6427e53c7887e63e6f317a8f128fa7c44b33de19ce94db7b2ae72d3d3468fa0ac64e1d35e12d69d56a62cb8c485f4a6df25ba661cf97d7ca070db2e83cf3dcb687b3df73f18f21269ab'


const api = axios.create({ 
  baseURL: `${STRAPI_URL}/api`, 
  headers: { 'Authorization': `Bearer ${ADMIN_TOKEN}` }
});

export const getHomepage = async () => {

  const res = await api.get('/homepage?populate=*'); 
  return res.data.data; 
};

export const updateHomepage = async (payload: any) => {
 
  return api.put('/homepage', { data: payload });
};