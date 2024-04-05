import {StyleSheet, TextInput, Image, Button, Keyboard, ScrollView}  from 'react-native';

import { View } from '@/components/Themed';
import {useState} from "react";

export default function TabOneScreen() {
  const [text, onChangeText] = useState('gray cat sitting on a throne');
  const [searchText, setSearchText] = useState('');

  const handleSubmit =  () => {
    setSearchText(text)
    Keyboard.dismiss();
  }

  return (
    <View style={styles.container}>
      <TextInput
          style={styles.input}
          onChangeText={onChangeText}
          value={text}
          multiline
          numberOfLines={4}
      />
      <Button onPress={handleSubmit} title="Submit" />
        <ScrollView>
      <Image
          style={styles.tinyLogo}
          source={{
            uri: `https://swsvindland--stable-diffusion-xl-fastapi-app.modal.run/?prompt=${searchText}`,
          }}
      />
        <Image
            style={styles.tinyLogo}
            source={{
                uri: `https://swsvindland--stable-diffusion-xl-fastapi-app.modal.run/?prompt=${searchText}`,
            }}
        />
        <Image
            style={styles.tinyLogo}
            source={{
                uri: `https://swsvindland--stable-diffusion-xl-fastapi-app.modal.run/?prompt=${searchText}`,
            }}
        />
        <Image
            style={styles.tinyLogo}
            source={{
                uri: `https://swsvindland--stable-diffusion-xl-fastapi-app.modal.run/?prompt=${searchText}`,
            }}
        />
        </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    backgroundColor: 'white'
  },
  tinyLogo: {
    width: 300,
    height: 300,
  },
});
