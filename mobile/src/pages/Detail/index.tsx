import React, { useCallback, useEffect, useState } from 'react';

import { View, TouchableOpacity, Image, Text, SafeAreaView, Linking } from 'react-native'
import { Feather as Icon, FontAwesome as Fa } from "@expo/vector-icons";
import { useNavigation, useRoute } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';
import * as MailComposer from "expo-mail-composer";
import styles from "./styles";


interface Params {
    id: number;
}

interface Item {
    title: string;
}

interface Point {
    name: string;
    whatsapp: string;
    image: string;
    email: string;
    city: string;
    uf: string;
    items: Item[]
}

export default function Detail() {
    const navigation = useNavigation()
    const route = useRoute();
    const [point, setPoint] = useState<Point>();

    const getPoint = useCallback(
        async () => {
            const params = route.params as Params;
            const res = await fetch(`http://192.168.1.3:3333/points/${params.id}`)
            setPoint(await res.json())
        }, [])

    const sendEmail = useCallback(() => {
        MailComposer.composeAsync({
            recipients: [point?.email || ""],
            subject: "Interesse em coleta de resíduos"
        })
    }, []);

    const sendWhatsAppMessage = useCallback(
        () => {
            Linking.openURL(`whatsapp://send?phone=${point?.whatsapp}&text=Tenho interesse em tornar meu estabelecimento um ponto de coleta de resíduos`)
        }, [])

    useEffect(() => {
        getPoint();
    }, [])

    return (
        <SafeAreaView style={{ flex: 1 }}>
            {point &&
                <>
                    <View style={styles.container}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Icon name="arrow-left" size={20} color="#34CB79" />
                        </TouchableOpacity>
                        <Image style={styles.pointImage} source={{ uri: point.image }} />
                        <Text style={styles.pointName}>
                            {point.name}
                        </Text>
                        <Text style={styles.pointItems}>
                            {point.items.map(item => item.title).join(", ")}
                        </Text>
                        <View style={styles.address}>
                            <Text style={styles.addressTitle}>
                                Endereço
                            </Text>
                            <Text
                                style={styles.addressContent}
                            >
                                {point.city}, {point.uf}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.footer}>
                        <RectButton style={styles.button} onPress={sendWhatsAppMessage}>
                            <Fa name="whatsapp" size={20} color={"#fff"}></Fa>
                            <Text style={styles.buttonText}>WhatsApp</Text>
                        </RectButton>
                        <RectButton style={styles.button} onPress={sendEmail}>
                            <Icon name="mail" size={20} color={"#fff"}></Icon>
                            <Text style={styles.buttonText}>E-mail</Text>
                        </RectButton>
                    </View>
                </>}
        </SafeAreaView >
    )
}

