import { BarCodeScanner } from 'expo-barcode-scanner';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

export default function App() {
  const [ hasPermission, setHasPermission ] = useState(null);
  const [ scanned, setScanned ] = useState(false);
  const [ currentBarcode, setCurrentBarcode ] = useState('');
  const [ barcodeList, setBarcodeList ] = useState({});

  //barcodeList will later increment the REST API

  useEffect(() => {
    setBarcodeList({...currentBarcode});
  }, [currentBarcode])

  useEffect(()=> {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setCurrentBarcode({
      id: String(Date.now()),
      data: String(data),
    });
    console.log(currentBarcode);
  }

  if(hasPermission === null){
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.camera}>
        <BarCodeScanner 
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />

        {scanned && <Button 
          title={`Tap to scan again`}
          onPress={() => setScanned(false)}
        />}
      </View>
      <View style={styles.display}>
        <Text style={styles.text}>
          {currentBarcode !== '' ?
          `You have just scanned the barcode nº ${currentBarcode.data}`
          : `You can begin scanning now :)`
          }
        </Text>
      </View>
    </View>
  );
}

//Splash view pendent
//Do a fullscreen camera view with corner indicator to set the barcode in, Touchable Opacity after scanned with "scan again" in the middle, and text view below
//Submit button in the left corner (when submited is going to be added in the REST API).

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  camera: {
    height: '70%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ccc',
  },
  text: {
    color: 'grey',
    maxWidth: 250,
  },  
  display: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '30%',
  },
});
