import AsyncStorage from "@react-native-async-storage/async-storage";
import api from './api'

// buscar categoria favoritada
async function getFavorite() {
    const data = await AsyncStorage.getItem("@favCategory")

    if (data !== null) {
        // achgou a categoria
        const response = await api.get(`api/categories/${data}?fields=name&populate=posts,posts.cover`)
        return response.data?.data?.attributes?.posts?.data
    } else {
        return []
    }
}

// Favoritar
async function setFavorite(category) {
    await AsyncStorage.setItem('@favCategory', String(category))
    const response = await getFavorite()
    return response
}

export {
    getFavorite,
    setFavorite
}
