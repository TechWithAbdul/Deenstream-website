import api from '../utils/api'

export async function createPermalink(target){
  const res = await api.post('/r/', { target })
  return res.data
}
