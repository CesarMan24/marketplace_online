import { Text, View } from "react-native"
import BottomSheet from '@gorhom/bottom-sheet';
import { useMemo, useRef, useCallback } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Button } from "@rneui/themed"
/*
export default function Prueba() {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['25%', '50%', '75%'], []);
  const openBottomSheet = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <View style={{ flex: 1 }}>
          <Button title="Mostrar BottomSheet" onPress={openBottomSheet} 
          buttonStyle={{ backgroundColor: '#007bff', margin: 20 }}
          />
          <BottomSheet index={0} snapPoints={snapPoints} ref={bottomSheetRef}
          > 
            <View>
              <Text style={{ fontSize: 18 }}> HOLA DEL BOTTOMSHEET</Text>
              <Button title="Cerrar" onPress={() => bottomSheetRef.current?.close()} />
            </View>
          </BottomSheet>
        </View>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  )
} */

export default function Prueba() {
  return(
    <View>
      <Text></Text>
    </View>
  )
}