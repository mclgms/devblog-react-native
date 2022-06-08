import React, { useLayoutEffect, useState, useEffect } from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import api from '../../services/api'
import { theme } from '../../utils/theme/theme'

import { PostItem } from '../../components/PostItem'
import PullToRefreshViewNativeComponent from 'react-native/Libraries/Components/RefreshControl/PullToRefreshViewNativeComponent'


export function CategoryPosts() {
    const navigation = useNavigation()
    const route = useRoute()

    const [posts, setPosts] = useState([])

    useLayoutEffect(() => {
        navigation.setOptions({
            title: route.params.title === '' ? 'Categoria' : route.params.title
        })
    }, [navigation, posts])

    useEffect(() => {
        async function loadPosts() {
            const response = await api.get(`/api/categories/${route.params?.id}?fields=name&populate=posts,posts.cover`)
            setPosts(response.data?.data?.attributes?.posts?.data)

        }
        loadPosts()
    }, [])

    const handleBack = () => {
        navigation.goBack()
    }

    return (
        <View style={styles.container}>

            {posts.length === 0 && (
                <View style={styles.warningContainer}>
                    <Text style={styles.warning}>Esta categoria ainda não nenhum post</Text>
                    <TouchableOpacity
                        onPress={handleBack}
                        style={styles.backButton}>
                        <Text style={styles.textButton}>Encontrar posts</Text>
                    </TouchableOpacity>
                </View>
            )}
            <FlatList
                style={{ flex: 1 }}
                showsVerticalScrollIndicator={false}
                data={posts}
                keyExtractor={item => String(item.id)}
                renderItem={({ item }) => <PostItem data={item} />}
            />
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 18,
        backgroundColor: theme.colors.white,
    },
    warningContainer: {
        alignItems: 'center',
    },
    warning: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    backButton: {
        backgroundColor: '#132133',
        paddingVertical: 8,
        paddingHorizontal: 14,
        marginTop: 12,
        borderRadius: 4,
    },
    textButton: {
        color: theme.colors.white,
    }
})