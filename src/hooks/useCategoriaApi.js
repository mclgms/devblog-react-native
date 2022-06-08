import api from '../services/api'

export const useCategoriaApi = () => ({
    getCategoriasComIcone: () => new Promise((resolve, reject) => {
        api.get('/api/categories?populate=icon')
            .then(response => {
                resolve(response)
            })
            .catch(err => reject(err))
    })
})