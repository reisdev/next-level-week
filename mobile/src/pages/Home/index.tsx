import React, { useState, useCallback, useEffect } from "react"
import { View, Image, Text, ImageBackground } from "react-native";
import { Feather as Icon } from "@expo/vector-icons"
import { RectButton } from "react-native-gesture-handler";
import RNPickerSelect, { PickerStyle } from 'react-native-picker-select';

import styles from "./styles";
import { useNavigation } from "@react-navigation/native";

interface UF {
  sigla: string;
}

interface City {
  nome: string
}

const Home = () => {
  const navigation = useNavigation();
  const [ufs, setUFs] = useState<UF[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [params, setParams] = useState<{
    city: string,
    uf: string
  }>({ city: "", uf: "" });

  const getUFS = useCallback(
    async () => {
      const res = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome`);
      setUFs(await res.json());
    }, [])

  const getCities = async () => {
    if (params.uf) {
      const res = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${params.uf}/municipios`)
      setCities(await res.json());
    }
  }

  useEffect(() => {
    getCities()
  }, [params.uf])

  useEffect(() => {
    getUFS()
  }, [])

  return <ImageBackground
    source={require("../../assets/home-background.png")}
    style={styles.container}
    imageStyle={{
      width: 274, height: 368
    }}>
    <View style={styles.main}>
      <Image
        source={require("../../assets/logo.png")}
      />
      <Text style={styles.title}>
        Seu marketplace de coleta de resíduos
      </Text>
      <Text style={styles.description}>
        Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente
      </Text>
    </View>
    <View style={styles.footer}>
      <RNPickerSelect
        value={params.uf}
        style={{
          height: 60,
          backgroundColor: '#FFF',
          borderRadius: 10,
          marginBottom: 8,
          paddingHorizontal: 24,
          fontSize: 20,
        } as PickerStyle}
        onValueChange={(value) => setParams({ uf: value, city: "" })}
        items={ufs.map(((uf: UF) =>
          ({ label: uf.sigla, value: uf.sigla }))
        )}
      />
      <RNPickerSelect
        value={params.city}
        onValueChange={(value) => setParams({ ...params, city: value })}
        items={cities.map(((city: City) =>
          ({ label: city.nome, value: city.nome }))
        )}
      />
      <RectButton style={styles.button} onPress={() => navigation.navigate("points", params)}>
        <View style={styles.buttonIcon}>
          <Text>
            <Icon name="arrow-right" color={"#fff"} size={24} />
          </Text>
        </View>
        <Text style={styles.buttonText}>
          Entrar
        </Text>
      </RectButton>
    </View>
  </ImageBackground>
}

export default Home;