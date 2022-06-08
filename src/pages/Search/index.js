import React, { useState } from 'react'
import {
    View,
    Text,
    ActivityIndicator,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Alert,
    FlatList,
    Keyboard,
} from 'react-native'
import { Feather } from '@expo/vector-icons'

import api from '../../services/api'
import { theme } from '../../utils/theme/theme'

import { PostItem } from '../../components/PostItem'


export function Search() {

    const [input, setInput] = useState('')
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(false)

    async function handleSearchPost() {
        if (input === '') {
            Alert.alert(
                'Atenção',
                'Digite algo para pesquisar',
                [{ text: 'OK, ENTNEDI', style: 'cancel' }]
            )
            return
        }
        setLoading(true)
        const response = await api.get(`/api/posts?filters[title][$containsi]=${input}&populate=cover`)
        setPosts(response?.data?.data)

        if (response?.data?.data.length > 0) {
            setInput('')
            setLoading(false)
            Keyboard.dismiss()
        }

    }

    return (
        <View style={styles.container}>
            <View style={styles.containerInput}>
                <TextInput
                    style={styles.input}
                    placeholder='O que está buacando...'
                    value={input}
                    onChangeText={v => setInput(v)}
                />
                <TouchableOpacity
                    onPress={handleSearchPost}
                    style={styles.searchButton}>
                    <Feather name="search" sixe={25} color={theme.colors.black} />
                </TouchableOpacity>
            </View>

            {posts.length > 0 ? (
                loading ? (
                    <ActivityIndicator size={60} color={theme.colors.black} />
                ) : (<FlatList
                    style={{ flex: 1 }}
                    showsVerticalScrollIndicator={false}
                    data={posts}
                    keyExtractor={item => String(item.id)}
                    renderItem={({ item }) => <PostItem data={item} />}
                />
                )

            ) : (
                <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                        Nenhum Post Encontrado
                    </Text>
                </View>
            )}
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.white,
        padding: 18
    },
    containerInput: {
        flexDirection: 'row',
        width: '100%',
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    input: {
        width: '85%',
        backgroundColor: theme.colors.grey300,
        height: 45,
        borderTopLeftRadius: 4,
        borderBottomLeftRadius: 4,
        padding: 8,
        fontSize: 15,

    },
    searchButton: {
        width: '15%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.grey300,
        height: 45,
        borderTopRightRadius: 4,
        borderBottomRightRadius: 4,
        marginLeft: -1,
    }
})