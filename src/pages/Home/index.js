import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, FlatList, SafeAreaView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useCategoriaApi } from '../../hooks/useCategoriaApi'
import { setFavorite, getFavorite } from '../../services/favorite'
import api from '../../services/api'
import * as Animatable from 'react-native-animatable'

import { Header } from '../../components/Header'
import { CategoryItem } from '../../components/CategoryItem'
import { FavoritePost } from '../../components/FavoritePost'
import { PostItem } from '../../components/PostItem'

const FlatListAnimated = Animatable.createAnimatableComponent(FlatList)

export function Home() {
    const navigation = useNavigation()
    const [categorias, setCategorias] = useState([])
    const apiCategoria = useCategoriaApi()
    const [favCategories, setFavCaregories] = useState([])
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const loadData = async () => {
            // carrega os posts
            await getListPosts()

            await apiCategoria.getCategoriasComIcone()
                .then(response => {
                    setCategorias(response.data.data)
                    console.log('Categoria', response.data.data)
                })
                .catch(err => console.log(err))
        }
        loadData()
    }, [])

    useEffect(() => {
        async function loadFavorites() {
            const response = await getFavorite()
            setFavCaregories(response)
        }
        loadFavorites()
    }, [])

    /**
     * Recupera a lista de posts
     */
    const getListPosts = async () => {
        setLoading(true)
        const response = await api.get(`api/posts?populate=cover&createdAt:desc`)
        setPosts(response.data.data)
        setLoading(false)
    }

    // favoritando uma categoria
    const handleFavorite = async (id) => {
        const response = await setFavorite(id)
        setFavCaregories(response)
    }

    /**
     * Bavegar oara search
     */
    const handleSearch = () => {
        navigation.navigate('Search');
    }

    return (
        <SafeAreaView style={styles.container}>
            <Header action={handleSearch} />
            <FlatListAnimated
                animation="flipInX"
                delay={200}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingRight: 12 }}
                style={styles.categories}
                data={categorias}
                keyExtractor={item => String(item.id)}
                renderItem={({ item }) => <CategoryItem data={item} favorite={() => handleFavorite(item.id)} />}
            />


            <View style={styles.main}>
                {favCategories.length > 0 && (
                    <FlatList
                        horizontal
                        contentContainerStyle={{ paddingEnd: 18 }}
                        showsHorizontalScrollIndicator={false}
                        style={{ marginTop: 50, maxHeight: 100, paddingStart: 18, }}
                        data={favCategories}
                        keyExtractor={item => String(item.id)}
                        renderItem={({ item }) => <FavoritePost data={item} />}

                    />
                )}

                <Text style={[
                    styles.title, {
                        marginTop: favCategories.length > 0 ? 14 : 40
                    }]}>Conteúdos em alta</Text>

                <FlatList
                    style={{ flex: 1, paddingHorizontal: 18 }}
                    showsVerticalScrollIndicator={false}
                    data={posts}
                    keyExtractor={item => String(item.id)}
                    renderItem={({ item }) => <PostItem data={item} />}
                    refreshing={loading}
                    onRefresh={() => getListPosts()}
                />

            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#262330',
    },
    categories: {
        maxHeight: 115,
        backgroundColor: '#EFEFEF',
        marginHorizontal: 18,
        borderRadius: 8,
        zIndex: 9,
    },
    main: {
        backgroundColor: '#FFF',
        flex: 1,
        marginTop: -35,
    },
    title: {
        fontSize: 21,
        paddingHorizontal: 18,
        marginBottom: 14,
        fontWeight: 'bold',
        color: '#162133',
    }
})