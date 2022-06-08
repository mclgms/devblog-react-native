import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Feather } from '@expo/vector-icons'
import * as Animatable from 'react-native-animatable'

export function Header({ action }) {
    return (
        <View style={styles.header}>
            <Animatable.Text
                animation="fadeInLeft"
                style={styles.name}>
                DevBlog
            </Animatable.Text>
            <TouchableOpacity onPress={action}>
                <Feather name="search" size={24} color="#FFF" />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 18,
        marginTop: 18,
        marginBottom: 20
    },
    name: {
        color: '#FFF',
        fontSize: 28,
        fontWeight: 'bold',
    }
})