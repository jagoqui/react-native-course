import {StatusBar} from 'expo-status-bar';
import React, {useState} from 'react';
import {Image, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';
import uploadToAnonymousFileAsyc from 'anonymous-files';

export default function App() {
    const initialImage = 'https://picsum.photos/300';

    const [selectedImage, setSelectedImage] = useState({
        localUri: initialImage,
        remoteUri: '',
        width: 300,
        height: 300
    });

    let openImagePicker = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissionResult?.granted) {
            alert('Permission to access camera is required!');
            return;
        }

        const pickerResult = await ImagePicker.launchImageLibraryAsync();
        if (pickerResult.cancelled) {
            return;
        }

        if (Platform.OS === 'web') {
            const remoteUri = await uploadToAnonymousFileAsyc(pickerResult.uri);
            setSelectedImage({
                localUri: pickerResult.uri,
                remoteUri,
                width: pickerResult.width,
                height: pickerResult.height
            });
            console.log(remoteUri);
        } else {

            setSelectedImage(
                {
                    localUri: pickerResult.uri,
                    remoteUri: '',
                    width: pickerResult.width,
                    height: pickerResult.height
                })
        }

    }

    const openSharedDialog = async () => {
        if (!(await Sharing.isAvailableAsync())) {
            alert(`This image is available for sharing at ${selectedImage.remoteUri}`);
            return;
        }

        await Sharing.shareAsync(selectedImage.localUri);

    }
    return (
        <View style={styles.container}>
            <StatusBar style="auto"/>
            <Text style={styles.titledText}>Pick a image</Text>
            <TouchableOpacity onPress={openImagePicker}>
                <Image source={{uri: selectedImage.localUri, width: selectedImage.width, height: selectedImage.height}}
                       style={styles.image}/>
            </TouchableOpacity>
            {selectedImage.localUri !== initialImage ? (
                <TouchableOpacity style={styles.bottom} onPress={openSharedDialog}>
                    <Text style={styles.bottomText}>Shares this image</Text>
                </TouchableOpacity>) : (<View/>)
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#cccccc',
        alignItems: 'center',
        justifyContent: 'center',
    },
    titledText: {
        color: '#393939',
        fontSize: 25,
        marginBottom: 30
    },
    image: {
        maxWidth: '80%',
        maxHeight: '70%',
        borderRadius: 100,
        resizeMode: 'contain'
    },
    bottom: {
        backgroundColor: 'deepskyblue',
        padding: 15,
        borderRadius: 25
    },
    bottomText: {
        color: '#fff',
        fontSize: 35
    },
});
