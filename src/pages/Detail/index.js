import React, { useState, useEffect, useLayoutEffect } from 'react'
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    Image,
    ScrollView,
    TouchableOpacity,
    Share,
    Modal,
} from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import api from '../../services/api'
import { constants } from '../../utils/constants'
import { Feather, Entypo } from '@expo/vector-icons'

import { LinkWeb } from '../../components/LinkWeb'



export function Detail() {
    const route = useRoute()
    const navigation = useNavigation()
    const [post, setPost] = useState({})
    const [links, setLinks] = useState([])

    const [modalVisible, setModalVisible] = useState(false)
    const [opneLink, setOpenLink] = useState({})

    useEffect(() => {
        async function getPost() {
            const response = await api.get(`api/posts/${route.params?.id}?populate=cover,category,opcoes`)
            setPost(response.data.data)
            setLinks(response.data?.data?.attributes?.opcoes)

        }
        getPost()
    }, [])


    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={handleShare}>
                    <Entypo name="share" size={25} color="#FFF" />
                </TouchableOpacity>
            )
        })
    }, [navigation, post])

    /**
     * Compartilhar
     */
    async function handleShare() {
        try {
            const result = await Share.share({
                message: `
                    Confere este post ${post?.attributes?.title}

                    ${post?.attributes?.description}

                    Vai lá no devpost
                `
            })

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    console.log('ACTIVITY TYPE')
                } else {
                    console.log('Compartilhando com sucesso')
                }
            } else if (result.action === Share.dismissAction) {
                console.log('modal fechado sem compartilhamento')

            }
        } catch (error) {
            console.log(error)
        }
    }

    function handleOpenLink(link) {
        setOpenLink(link)
        setModalVisible(true)
        console.log(link)
    }

    return (
        <SafeAreaView style={styles.container}>
            <Image
                resizeMode='cover'
                style={styles.cover}
                source={{ uri: `${constants.base_url}${post.attributes?.cover?.data?.attributes?.url}` }}
            />

            <Text style={styles.title}>{post?.attributes?.title}</Text>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}>


                <Text style={styles.description}>
                    {post?.attributes?.description}
                </Text>

                {links.length > 0 && (
                    <Text style={styles.subtitle} >
                        Links
                    </Text>
                )}

                {
                    links.map(link => (
                        <TouchableOpacity
                            key={String(link.id)}
                            style={styles.linkButton}
                            onPress={() => handleOpenLink(link)}
                        >
                            <Feather name="link" color="#1e4387" size={14} />
                            <Text style={styles.linkText}>{link?.name}</Text>
                        </TouchableOpacity>
                    ))
                }

            </ScrollView>
            <Modal transparent animationType='slide' visible={modalVisible}>
                <LinkWeb
                    link={opneLink.link}
                    title={opneLink.name}
                    closeModal={() => setModalVisible(false)}
                />
            </Modal>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    cover: {
        width: '100%',
        height: 230,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 14,
        marginTop: 18,
    },
    content: {
        paddingHorizontal: 12,
    },
    description: {
        lineHeight: 20,
    },
    subtitle: {
        fontWeight: 'bold',
        marginTop: 14,
        marginBottom: 6,
        fontSize: 18,
    },
    linkButton: {
        flexDirection: 'row',
        alignContent: 'center',
        marginBottom: 8,
    },
    linkText: {
        color: '#1e4387',
        fontSize: 16,
        marginLeft: 6,
    }
})
