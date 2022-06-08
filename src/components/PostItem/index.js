import React from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'
import { constants } from '../../utils/constants'
import { useNavigation } from '@react-navigation/native'

const { width, height } = Dimensions.get('window')

export function PostItem({ data }) {
    const navigation = useNavigation()

    const imgUrl = `${constants.base_url}${data?.attributes?.cover?.data?.attributes?.url}`


    const handleDetails = () => {
        navigation.navigate('Detail', { id: data?.id })
    }

    return (
        <TouchableOpacity
            onPress={handleDetails}
            style={styles.container}>
            <View style={styles.header}>
                <Image
                    style={styles.cover}
                    source={{ uri: imgUrl }}
                />

            </View>
            <View style={styles.body}>
                <Text style={styles.title} numberOfLines={1}>
                    {data?.attributes?.title}
                </Text>
                <Text style={styles.description} numberOfLines={2}>
                    {data?.attributes?.description}
                </Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: '#EFEFEF',
        borderRadius: 4,
        marginBottom: 14,
        paddingHorizontal: 12,
        paddingVertical: 14,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    cover: {
        width: 90,
        height: 90,
        borderRadius: 4,
    },
    body: {
        width: '70%',
        marginLeft: 5,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 14,
        marginBottom: 14,
    },
    description: {
        fontSize: 12,
        lineHeight: 16,
    }
})