import React, { useState, useEffect, useCallback } from 'react'

import styles from "./style";
import { View, Text, Image, Alert, } from 'react-native';
import { Feather as Icon } from "@expo/vector-icons";
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import { useNavigation, useRoute } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps'
import * as Location from "expo-location";
import { SvgUri } from "react-native-svg";

interface Item {
    id: number;
    title: string;
    imageUrl: string;
}

interface Point {
    id: number;
    name: string;
    image: string;
    latitude: number;
    longitude: number;
}

interface Params {
    uf: string;
    city: string;
}

export default function Points() {
    const navigation = useNavigation()
    const route = useRoute();
    const [items, setItems] = useState<Item[]>([])
    const [selectedItems, setSelectedItems] = useState<number[]>([])
    const [points, setPoints] = useState<Point[]>([])
    const [initialPosition, setInitialPosition] = useState<{
        latitude: number, longitude: number
    }>({ latitude: 0, longitude: 0 })

    const handleItemSelect = (id: number) => {
        const index = selectedItems.indexOf(id);
        if (index >= 0) setSelectedItems(selectedItems.filter(item => item != id))
        else setSelectedItems([...selectedItems, id])
    }

    const loadPosition = useCallback(async () => {
        const { status } = await Location.requestPermissionsAsync();
        if (status !== "granted") {
            Alert.alert("Ops! Precisamos da sua permissão para obter a localização");
            return;
        }
        const location = await Location.getCurrentPositionAsync();
        const { latitude, longitude } = location.coords;
        setInitialPosition({ latitude, longitude });
    }, [])

    const getItems = useCallback(
        async () => {
            const res = await fetch(`http://192.168.1.3:3333/items`)
            setItems(await res.json());
        }, [])

    const getPoints = useCallback(
        async () => {
            console.log(route.params)
            const params = route.params ? (route.params as Params) : null;
            const res = await fetch(`http://192.168.1.3:3333/points${selectedItems.length > 0 ? `?items=${selectedItems.join(",")}&` : "?"}${params ? params.city ? `city=${params.city}&` : "" : ""}${params ? params.uf ? `uf=${params.uf}` : "" : ""}`)
            setPoints(await res.json());
        }, [selectedItems, route.params]
    )

    useEffect(() => {
        getPoints()
    }, [selectedItems])

    useEffect(() => {
        getItems();
        getPoints();
        loadPosition();
    }, []);

    return (
        <>
            <View style={styles.container}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-left" size={20} color="#34CB79" />
                </TouchableOpacity>
                <Text style={styles.title}>
                    Boas Vindas
                </Text>
                <Text style={styles.description}>
                    Encontre no mapa um ponto de coleta
                </Text>
                <View style={styles.mapContainer}>
                    {initialPosition.latitude !== 0 &&
                        <MapView
                            style={styles.map}
                            initialRegion={{
                                ...initialPosition,
                                latitudeDelta: 0.14,
                                longitudeDelta: 0.14
                            }}
                        >
                            {points.map((point: Point) =>
                                <Marker
                                    style={styles.mapMarker}
                                    coordinate={{
                                        latitude: point.latitude,
                                        longitude: point.longitude
                                    }}
                                    onPress={() => navigation.navigate("detail", { id: point.id })}
                                    key={point.id}
                                >
                                    <View
                                        style={styles.mapMarkerContainer}
                                    >
                                        <Image
                                            style={styles.mapMarkerImage}
                                            source={{ uri: point.image }}
                                        />
                                        <Text
                                            style={styles.mapMarkerTitle}
                                        >
                                            {point.name}
                                        </Text>
                                    </View>
                                </Marker>
                            )}
                        </MapView>}
                </View>
            </View>
            <View style={styles.itemsContainer}>
                <ScrollView
                    contentContainerStyle={{
                        paddingHorizontal: 20
                    }}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                >
                    {items.map((item: Item) =>
                        <TouchableOpacity
                            style={[
                                styles.item,
                                selectedItems.includes(item.id)
                                    ? styles.selectedItem : []
                            ]}
                            onPress={() => handleItemSelect(item.id)}
                            key={item.id}>
                            <SvgUri
                                width={42}
                                height={42}
                                uri={item.imageUrl} />
                            <Text style={styles.itemTitle}>{item.title}</Text>
                        </TouchableOpacity>
                    )}
                </ScrollView>
            </View>
        </>
    )
}
