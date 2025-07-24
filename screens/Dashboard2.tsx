import React, {useRef, useEffect, useState} from 'react';
import  MapView, {MapMarker, PROVIDER_GOOGLE} from 'react-native-maps';
import { Marker } from 'react-native-maps';
import { StyleSheet, View,TouchableOpacity, Text, Alert, ScrollView, PushNotificationIOS } from 'react-native';
import { Button, Input } from '@rneui/themed'
import { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
//import { useRef } from 'react';
//import { useEffect } from 'react';
//import * as Location from 'expo-location';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { Modal, Image } from 'react-native';
import { RealtimeChannel } from '@supabase/supabase-js';
//import BottomSheet from '@gorhom/bottom-sheet';
//import { useMemo } from 'react';
//import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
//import { GestureHandlerRootView } from 'react-native-gesture-handler';
/*useEffect(() => {
  (async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permiso de ubicación denegado');
    }
  })();
}, []); 
const FOCUS = {
    latitude: 32.6245,
    longitude: -115.4523,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
}
    const FOCUS = {
    latitude: 32.6245,
    longitude: -115.4523,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
}
*/

 const FOCUS = {
    latitude: 32.6245,
    longitude: -115.4523,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,}

export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [message, setMessage] = useState("")
  const [datacategories, setDatacategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [ubicacion, setUbicacion] = useState<{ latitude: number; longitude: number; latitudeDelta: number; longitudeDelta: number } | null>(null)
  const [username, setUsername] = useState("")
  const [regioninicial, setregioninicial] = useState<{ latitude: number; longitude: number; latitudeDelta: number; longitudeDelta: number } | null>(null)
  const [markerdashboard, setmarkerdashboard] = useState(false)
  const [selectedVenta, setSelectedVenta] = useState(null)
  
 const markertittle = `Ubicacion ${username}`
  const mapRef = useRef(null)
  const [bottompage, setBottomPage] = useState(false)
 const [chatenvivo, setChatenvivo] = useState(false)
 const [mensajesegunnventa,setmensajessegunventa] = useState<any[]>([])
  useEffect(() => {
            supabase.auth.getSession().then(({ data: { session } }) => {
              setSession(session)
            })
        
            supabase.auth.onAuthStateChange((_event, session) => {
              setSession(session)
            })
          }, [])
useEffect(() => {
    if (session) {
    getProfile()} else {
      setUbicacion(null)
    }
    
}, [session]);
useFocusEffect(
    useCallback(() => {
      getProfile();
      
    }, [session])
  );
  async function getProfile() {
    try {
      setLoading(true)
      //if (!session?.user) throw new Error('No user on the session!')

      const { data, error, status } = await supabase
        .from('profiles')
        //.select(username, website, avatar_url)
        .select('ubicacion, username')
        .eq('id', session?.user.id)
        .single()
      if (error && status !== 406) {
        throw error
      }

      if (data) {
        //setUsername(data.username)
        //setWebsite(data.website)
        //setFull_Name(data.full_name)
        //setAvatarUrl(data.avatar_url)
        //setUbicacion(data.ubicacion)
  setUbicacion({
    latitude: data.ubicacion.latitude,
    longitude: data.ubicacion.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  setUsername(data.username)
  
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message)
        Alert.alert("Verifique los datos de su cuenta (username, nombre, fotografia)")
      }
    } finally {
      setLoading(false)
    }
  }
const test: TestFunction = (latitude, longitude) => {
  if(session && username){
  updateUbicacion(latitude, longitude)
   Alert.alert("Ubicacion",`Lat:${latitude} Long:${longitude}  \nUbicacion guardada correctamente para ${username}`);} 
   else{
     Alert.alert("Ubicacion",`Lat:${latitude} Long:${longitude}  \nInicia sesion y verifica tu usuario para guardar ubicacion`)
   }
};
interface TestFunction {
    (latitude: number, longitude: number): void;
}
async function updateUbicacion(latitude: number, longitude : number){
  try {
      setLoading(true)
      if (!session?.user) {
        //throw new Error('Inicia sesion para guardar ubicaciones') 
       
      }

      const updates = {
       id: session?.user.id,
       ubicacion: {latitude, longitude},
       updated_at: new Date()
      }

      const { error } = await supabase.from('profiles').upsert(updates)
     
      if (error) {
        Alert.alert("algo salio mal")
        throw error
        
      }
      //setUbicacion(JSON.stringify({ latitude, longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 }));
      setUbicacion({ latitude, longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 });
      
    } finally {
      setLoading(false)
      
    }
  }
  const handlepress = () => {
    console.log(ubicacion)
      if (ubicacion && mapRef.current ) {
        //@ts-ignore
        mapRef.current.animateToRegion(ubicacion, 5000);
        //Alert.alert("Redirigiendo a la direccion guardada")
        console.log("REDIRIGIENDO A LA DIRECCION GUARDADA")
      }
        else{
        Alert.alert("No se encontro ubicacion, pulse el mapa para anadir una")
      }
    }; 
async function handleCategories (categoriaelegir : string | null) {
  console.log("Datos filtrados para categoria " +categoriaelegir)
  const {data, error} = await supabase.rpc(
    'ventas_porcategoria7', {categoriaelegir}); //ventas_categoria2
    if (error) {
      Alert.alert ('Error', error.message);
      return;
    }
    if (data) {
      console.log("Datos", data) 
     //Alert.alert('Datos', JSON.stringify(data, null, 2));
    
     if (categoriaelegir == null) {
       Alert.alert ("Todos las ventas mostradas en el mapa")
     } else if (categoriaelegir == "F"){
       Alert.alert ("Limpiar Mapa")
     }else {
      Alert.alert ("Datos mostrados en mapa de " +categoriaelegir)
     }
     setDatacategories(data)
    }
}

 
/*async function handleCategories(categoriaElegir: string | null) {
  const { data, error } = await supabase
    .rpc('ventas_porcategoria2', { categoriaelegir: categoriaElegir });

  if (error) {
    Alert.alert('Algo salio mal');
  } else {
    Alert.alert('Ventas obtenidas:', data);
  }

  return data;
} */
//const STORAGE_URL = "https://supabase.com/dashboard/project/rtbtjinwleilrrdulpag/storage/buckets/ventasimg";
const STORAGE_URL = "https://rtbtjinwleilrrdulpag.supabase.co/storage/v1/object/public/ventasimg/";
//https://rtbtjinwleilrrdulpag.supabase.co
function getPublicImageUrl(path: string | null) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  console.log(STORAGE_URL + path)
  return STORAGE_URL + path;
}
const STORAGE_URL2 = "https://rtbtjinwleilrrdulpag.supabase.co/storage/v1/object/public/avatars/";
//https://rtbtjinwleilrrdulpag.supabase.co
function getPublicImageUrl2(path: string | null) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  console.log(STORAGE_URL2 + path)
  return STORAGE_URL2 + path; 
}

const  pruebamundo = (ubicacion : {latitude: number, longitude: number}) => { //datacategories.map
  setBottomPage(false)
  console.log(" ------------------------------------- ")
  console.log("bottompage es falso")
  console.log("latitude: " +ubicacion.latitude)
  console.log("longitude: " +ubicacion.longitude)
  let gotoubicacion = {
    latitude: ubicacion.latitude,
    longitude: ubicacion.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01
  }
  //@ts-ignore
  mapRef.current.animateToRegion(gotoubicacion, 2000); 
  //Alert.alert(" Rederigiendo a la ubicacion del producto")
  
}
async function enviarmensaje(id_venta: number, mensaje: string, messenger: string) {
console.log("proceso de enviar el mensaje")
setMessage("")
const {error} = await supabase.from('venta_mensaje').insert([{
  id_venta : id_venta,
  mensaje: mensaje,
  messenger: messenger,
}]
)
if (error){ console.error('Error al enviar mensaje:', error.message);
  Alert.alert(" Error al enviar el mensaje", " usuario " +messenger)
  console.log("erro al mandar mensaje")
}else{
  console.log("mensaje ingresado correctamente")
}
} 

async function handlemensajesporventa(iddelaventa: number) {
  setChatenvivo(true)
  const {data, error} = await supabase.rpc('mensajes_por_venta6',{iddelaventa})
  if (error) {
    console.error('Error al cargar mensajes:', error.message);
} else if (data.id){
 console.error('Error al cargar mensajes:');
} else {
  setmensajessegunventa(data)
  console.log(" ----------------------------------------------- ")
  console.log(" mensajes cargados correctamente segun la venta " +data.id_venta)
}
}
//function chat (idVenta: number, agregarmensaje: (nuevo: any) => void) {
//useEffect(() => )
//}
/*useEffect(() => {
  console.log("cambio")
  if (!selectedVenta) return;

  // Suscripción al canal de realtime de Supabase
  const channel = supabase
    //.channel('realtime:mensajes')
    .channel('realtime:mensajes')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'venta_mensaje',
        filter: `id_venta=eq.${selectedVenta.id_venta}`,
      },
      (payload) => {
        // Agrega el nuevo mensaje al estado
        setmensajessegunventa((prev) => [...prev, payload.new]);
      }
    )
    .subscribe();

  // Limpia la suscripción al desmontar o cambiar de venta
  return () => {
    supabase.removeChannel(channel);
  };
}, [selectedVenta]);

useEffect(() => {
  console.log("useffect cambios chat")
if(chatenvivo && selectedVenta)
{
  handlemensajesporventa(selectedVenta.id_venta)
}
}, [selectedVenta, chatenvivo] 
) 
async function ConstantRefresh() {
  setInterval(() => {
    console.log("refresh")
    handlemensajesporventa(selectedVenta.id_venta)
  }, 5000);
} */

useEffect(() => {
 console.log ("en el useeffect")
  let interval: NodeJS.Timeout | undefined;
  if (chatenvivo && selectedVenta) {
    // Llama una vez al abrir el chat 
    handlemensajesporventa( //@ts-ignore
      selectedVenta.id_venta);
    // Luego cada 5 segundos
    interval = setInterval(() => {
      console.log("---------------------------------------------------------")
      console.log(" en el interval de" //@ts-ignore
        +selectedVenta.articulo)
      handlemensajesporventa( //@ts-ignore
        selectedVenta.id_venta);
    }, 5000);
  }
  // Limpia el intervalo al cerrar el chat o cambiar de venta
  return () => {
    if (interval) clearInterval(interval);
  };
}, [chatenvivo, selectedVenta]);

const handlechatstyles = (usernameventa: string) => {
  if(usernameventa == username) {
    return 'flex-end'
  }
  else {
    return 'flex-start'
  }
}
 return(
  <View style={{flex:1}}> 
  
  {session  ? ( 
    <>
    <MapView provider={PROVIDER_GOOGLE} ref={mapRef} style={StyleSheet.absoluteFill}
      initialRegion={FOCUS}
       showsUserLocation
       userLocationPriority = {'balanced'}
       zoomControlEnabled
       showsMyLocationButton 
       onLongPress={event => { 
    const {latitude, longitude} = event.nativeEvent.coordinate;
     test(latitude, longitude);
    }}>
     
      {ubicacion?.latitude && ubicacion?.longitude && session && ( 
        <Marker 
       coordinate={ubicacion} 
       title= {markertittle} 
       zIndex={2}
       pinColor="black"
       /> 
       )}
      {datacategories.map((venta, index) => (
        <Marker
          icon={venta.venta_url}
        // title={venta.articulo? String(venta.artiuclo) : ""}
        title={venta.articulo}
          pinColor="blue"
          description={venta.descripcion}
          key={index}
          zIndex={1}
          coordinate={{
            latitude: venta.ubicacion.latitude,
            longitude: venta.ubicacion.longitude,
          }}
          onPress={() => {setmarkerdashboard(true)
            setSelectedVenta(venta)
          }}
        />
      ))}
       </MapView>
       {/*<Button color= 'green' onPress={() => setChatenvivo(true)}> <Text style = {{color: 'white'}}> CHAT </Text></Button>*/ }
       <Modal
       visible = {markerdashboard}
       transparent = {true}
       animationType='fade'
       onRequestClose={() => setmarkerdashboard(false)}
       >

        <View style= {{backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent : 'center', flex: 1}}>
          <View style = {{backgroundColor : 'white', padding : 20, borderRadius: 10, alignItems : 'center', width : 300}}>
          {selectedVenta && (
            <>
             <Button  color= 'blue' onPress={() => setmarkerdashboard(false)}> <Text style = {{color: 'white'}}> CERRAR </Text></Button>
            <Text style = {{fontWeight : '100', fontSize: 20, alignItems:'flex-start' }}> {
              //@ts-ignore
                       selectedVenta.username}</Text>
            
  <Image
    source={{ 
      //@ts-ignore
      uri: getPublicImageUrl2(selectedVenta.avatar_url) || "" }}
    style={{ width: 50, height: 50, marginBottom: 10 , borderRadius: 75}}
    resizeMode="contain"
  />
            <Text style = {{fontFamily: "black", fontSize: 20}}> { //selectedVenta.id_venta
              //@ts-ignore
                       selectedVenta.articulo}</Text>
              
            <Text style = {{fontSize : 14}}> {
              //@ts-ignore
            selectedVenta.descripcion}</Text>
            <Text style = {{fontFamily: "black", fontSize: 20}}> Fecha que se registro: </Text>
              <Text>
            {//@ts-ignore
            selectedVenta.fecha_anadido}</Text>
            <Text style = {{fontFamily: "black", fontSize: 20}}> Precio : </Text>
            <Text>
               {
              //@ts-ignore
            selectedVenta.precio} </Text>
            { 
              //@ts-ignore
            selectedVenta.venta_url ? (
  <Image
    source={{ 
      //@ts-ignore
      uri: getPublicImageUrl(selectedVenta.venta_url) || "" }}
    style={{ width: 200, height: 200, marginBottom: 10 }}
    resizeMode="contain"
  />
      
) : (
  <Text>Sin imagen</Text>
)}
          <Button color= 'green' onPress={() => //@ts-ignore
            handlemensajesporventa(selectedVenta.id_venta)}> <Text style = {{color: 'white'}}> CHAT </Text></Button>

            </>
          )}
          </View>
        </View>
      {/*///////////////////////////////////////////// */}
        </Modal>
  <Modal visible = {bottompage} animationType='fade' transparent = {true}> 
 <View style= {{backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent : 'center', flex: 1}}>
  <View style = {{backgroundColor : 'white', padding : 20, borderRadius: 10, alignItems : 'center', width : 300}}>
    <Button  color= 'blue' onPress={() => {setBottomPage(false) 
      setChatenvivo(false)}
    }> <Text style = {{color: 'white'}}> CERRAR </Text></Button>
    
    <ScrollView> 
      <Text style = {{fontFamily : "black", fontSize : 30, textAlign: 'center' }}>Presiona en la foto para ir a su respectiva ubicacion </Text>
          {datacategories.map((venta, index) => 
      <TouchableOpacity onPress={() => pruebamundo(venta.ubicacion)} key={venta.id_venta ?? index}>
        <Text style = {{textAlign: 'center',alignContent: 'center', fontFamily : "black"}}> {venta.articulo} </Text>
          <Image 
    source={{ 
    uri: getPublicImageUrl(venta.venta_url) || "" }}
    style={{ width: 200, height: 200, marginBottom: 10 }}
    resizeMode="contain"
    
  />
  </TouchableOpacity>
          )}
 
    </ScrollView>
  </View>
 </View>
      </Modal>
      {/*///////////////////////////////////////////// */}
      <Modal visible = {chatenvivo} animationType="slide">
          <View style = {{flex: 1, backgroundColor: '#d3d3d3'}} >
            {selectedVenta ? (
            <View style = {{flex: 1}}>
              <View style = {{ borderBottomWidth: 2,
          paddingVertical: 10,
          backgroundColor: '#3366cc',
          alignItems: 'center', }}> 
             <Button
            color="blue"
            onPress={() => {
              setChatenvivo(false)
              setmensajessegunventa([])}
            }
            
            buttonStyle={{
              backgroundColor: '#3366cc',
              borderRadius: 8,
              paddingHorizontal: 24,
              paddingVertical: 8,
              alignSelf: 'center',
              marginBottom: 1,
            }}
            title="CERRAR"
            titleStyle={{ color: 'white', fontWeight: 'bold' }} 
          />
          <Text style ={{fontFamily: 'black', textAlign: 'center', color: 'white', fontSize: 20}}> {//@ts-ignore
          selectedVenta.username}</Text>
            <Text style={{fontFamily: 'black',fontSize: 30,textAlign: 'center',color: '#fff',marginBottom: 8,}}>
            {//@ts-ignore
            selectedVenta.articulo}
          </Text>
              <Image
    source={{ 
      //@ts-ignore
      uri: getPublicImageUrl(selectedVenta.venta_url) || "" }}
    style={{ width: 70, height: 70, marginBottom: 10 , borderRadius: 35,alignSelf:'center', }}
    resizeMode="contain"
  />
            </View>
          <ScrollView style = {{flex:1}}>
            {mensajesegunnventa.map((mensaje,indexmensajes) =>
          
            <View key= {indexmensajes}  style={{flexDirection: 'row',justifyContent: handlechatstyles(mensaje.messenger), marginRight: 5}}>
           <View  style ={{alignSelf: 'flex-start', 
            paddingHorizontal: 10, paddingVertical: 8,
            marginVertical: 5, marginBottom: 5, marginHorizontal: 5,
            backgroundColor: '#1e90ff', 
            borderWidth: 2, borderColor: '#000000ff', borderRadius: 12,
            maxWidth: '50%'
          }}>
            <Text style = {{color :'white', alignContent: 'center', fontSize:20 }}> {mensaje.messenger}</Text>
            <Text style ={{color : 'white',fontSize: 15}}> {mensaje.mensaje}</Text>

  </View>
            <Image
    source={{ 
      //@ts-ignore
      uri: getPublicImageUrl2(mensaje.avatar_url) || "" }}
    style={{ width: 50, height: 50, marginBottom: 10 , borderRadius: 75}}
    resizeMode="contain"
  />
          </View>
          ) }
            </ScrollView>
          <View style = {{alignItems: 'center', flexDirection: 'row',justifyContent:'center', backgroundColor: '#f5f5f5', marginHorizontal: 5}}> 
          <Input placeholder = " Escribe tu Mensaje" value={message} onChangeText={setMessage} containerStyle={{ flex: 1, marginRight: 2, marginBottom: 0 }} inputContainerStyle={{ borderBottomWidth: 1, borderColor: '#ccc' }}/>
          <Button
            color="blue"
            buttonStyle={{ backgroundColor: '#3366cc',borderRadius: 20,paddingHorizontal: 20,paddingVertical: 10,minWidth: 80,}}
            title="ENVIAR"
            titleStyle={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}
            onPress={() => enviarmensaje(//@ts-ignore
              selectedVenta.id_venta, message, username )}
          />
          </View>
             </View>
             
            ) : (
              <View>
                <Text> Ninguna venta seleccionada</Text>
                 <TouchableOpacity onPress={() => setChatenvivo(false)}>
              <Text style = {{color: '#006400'}}> Cerrar </Text>
            </TouchableOpacity>
              </View>
            ) }
             
          </View>

      </Modal>
      <Text style ={{alignSelf: 'flex-start',backgroundColor: 'backgroundColor: rgba(162, 160, 160, 0.71)',  fontSize: 15 }}> 
        {username}</Text>
        {ubicacion ? (
       <TouchableOpacity style={styles.focusButton} onPress={handlepress}>
        <Text style={styles.focusButtonText}> Ir a Ubicacion</Text>
      </TouchableOpacity> 
        ) : (<></>)}
      <TouchableOpacity style={styles.focusButton} onPress={() => setBottomPage(true)}>
        <Text style={styles.focusButtonText}> Ver Productos</Text>
      </TouchableOpacity> 
      
      <View style = {{margin: 5}}> 
        <TouchableOpacity onPress= {() =>handleCategories(null)}
        style = {{margin: 10 ,backgroundColor: 'backgroundColor: rgba(52, 52, 52, 0.8)',alignSelf: 'flex-start', paddingVertical:10}}>
          <Text style = {{width : 'auto', height : 'auto'}}> 🔎 </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress= {() =>handleCategories("Electronica")}
        style = {{margin: 10 ,backgroundColor: 'backgroundColor: rgba(52, 52, 52, 0.8)',alignSelf: 'flex-start', paddingVertical:10}}>
          <Text style = {{width : 'auto', height : 'auto'}}> 📺 </Text>
        </TouchableOpacity>
         <TouchableOpacity onPress= {() =>handleCategories("Hogar")}
        style = {{margin: 10 ,backgroundColor: 'backgroundColor: rgba(52, 52, 52, 0.8)',alignSelf: 'flex-start', paddingVertical:10}}>
          <Text style = {{width : 'auto', height : 'auto'}}> 🏠 </Text>
        </TouchableOpacity>
         <TouchableOpacity onPress= {() =>handleCategories("Bebe")}
        style = {{margin: 10 ,backgroundColor: 'backgroundColor: rgba(52, 52, 52, 0.8)',alignSelf: 'flex-start', paddingVertical:10}}>
          <Text style = {{width : 'auto', height : 'auto'}}> 👶 </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress= {() =>handleCategories("Mascota")}
        style = {{margin: 10 ,backgroundColor: 'backgroundColor: rgba(52, 52, 52, 0.8)',alignSelf: 'flex-start', paddingVertical:10}}>
          <Text style = {{width : 'auto', height : 'auto'}}> 🐶 </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress= {() =>handleCategories("Alimento") }
        style = {{margin: 10 ,backgroundColor: 'backgroundColor: rgba(52, 52, 52, 0.8)',alignSelf: 'flex-start', paddingVertical:10}}>
          <Text style = {{width : 'auto', height : 'auto'}}> 🍗 </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress= {() =>handleCategories("Salud")}
        style = {{margin: 10 ,backgroundColor: 'backgroundColor: rgba(52, 52, 52, 0.8)',alignSelf: 'flex-start', paddingVertical:10}}>
          <Text style = {{width : 'auto', height : 'auto'}}> 💊 </Text>
        </TouchableOpacity>
         <TouchableOpacity onPress= {() =>handleCategories("Vehiculo")}
        style = {{margin: 10 ,backgroundColor: 'backgroundColor: rgba(52, 52, 52, 0.8)',alignSelf: 'flex-start', paddingVertical:10}}>
          <Text style = {{width : 'auto', height : 'auto'}}> 🚗 </Text>
        </TouchableOpacity>
         <TouchableOpacity onPress= {() =>handleCategories("F")}
        style = {{margin: 10 ,backgroundColor: 'backgroundColor: rgba(52, 52, 52, 0.8)',alignSelf: 'flex-start', paddingVertical:10}}>
          <Text style = {{width : 'auto', height : 'auto'}}> 🫙 </Text>
        </TouchableOpacity>
      </View>
  
    

     
    </>
) : (
        <Text style = {{fontSize: 50 ,textAlign : 'center', marginVertical: 200, marginHorizontal: 10}}> Mapa no renderizado</Text>
       )}
 
  </View>
 )
   

  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  focusButton: {
    
    top: 20,
    alignSelf: 'center',
    backgroundColor: '#2196F3',
    paddingHorizontal: 32,
    paddingVertical: 10,
    borderRadius: 25,
    elevation: 4,
    marginVertical: 5
  },
  focusButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  locationButton: {
    position : 'absolute',
    top: 20,
    alignSelf : 'flex-start',
    backgroundColor: 'green',
    borderRadius: 25,
  }
});

/*  
MODAL

<Modal visible = {chatenvivo} animationType="slide">
          <View style = {{flex: 1, backgroundColor: '#d3d3d3'}} >
            {selectedVenta ? (
            <View style = {{flex: 1}}>
              <View style = {{ borderBottomWidth: 2,
          paddingVertical: 10,
          backgroundColor: '#3366cc',
          alignItems: 'center', }}> 
             <Button
            color="blue"
            onPress={() => {
              setChatenvivo(false)
              setmensajessegunventa([])}
            }
            
            buttonStyle={{
              backgroundColor: '#3366cc',
              borderRadius: 8,
              paddingHorizontal: 24,
              paddingVertical: 8,
              alignSelf: 'center',
              marginBottom: 1,
            }}
            title="CERRAR"
            titleStyle={{ color: 'white', fontWeight: 'bold' }} 
          />
          <Text style ={{fontFamily: 'black', textAlign: 'center', color: 'white', fontSize: 20}}> {//@ts-ignore
          selectedVenta.username}</Text>
            <Text style={{fontFamily: 'black',fontSize: 30,textAlign: 'center',color: '#fff',marginBottom: 8,}}>
            {//@ts-ignore
            selectedVenta.articulo}
          </Text>
              <Image
    source={{ 
      //@ts-ignore
      uri: getPublicImageUrl(selectedVenta.venta_url) || "" }}
    style={{ width: 70, height: 70, marginBottom: 10 , borderRadius: 35,alignSelf:'center', }}
    resizeMode="contain"
  />
            </View>
          <ScrollView style = {{flex:1}}>
            {mensajesegunnventa.map((mensaje,indexmensajes) =>
          
            <View key= {indexmensajes}  style={{flexDirection: 'row',justifyContent: handlechatstyles(mensaje.messenger), marginRight: 5}}>
           <View  style ={{alignSelf: 'flex-start', 
            paddingHorizontal: 10, paddingVertical: 8,
            marginVertical: 5, marginBottom: 5, marginHorizontal: 5,
            backgroundColor: '#1e90ff', 
            borderWidth: 2, borderColor: '#000000ff', borderRadius: 12,
            maxWidth: '50%'
          }}>
            <Text style = {{color :'white', alignContent: 'center', fontSize:20 }}> {mensaje.messenger}</Text>
            <Text style ={{color : 'white',fontSize: 15}}> {mensaje.mensaje}</Text>

  </View>
            <Image
    source={{ 
      //@ts-ignore
      uri: getPublicImageUrl2(mensaje.avatar_url) || "" }}
    style={{ width: 50, height: 50, marginBottom: 10 , borderRadius: 75}}
    resizeMode="contain"
  />
          </View>
          ) }
            </ScrollView>
          <View style = {{alignItems: 'center', flexDirection: 'row',justifyContent:'center', backgroundColor: '#f5f5f5', marginHorizontal: 5}}> 
          <Input placeholder = " Escribe tu Mensaje" value={message} onChangeText={setMessage} containerStyle={{ flex: 1, marginRight: 2, marginBottom: 0 }} inputContainerStyle={{ borderBottomWidth: 1, borderColor: '#ccc' }}/>
          <Button
            color="blue"
            buttonStyle={{ backgroundColor: '#3366cc',borderRadius: 20,paddingHorizontal: 20,paddingVertical: 10,minWidth: 80,}}
            title="ENVIAR"
            titleStyle={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}
            onPress={() => enviarmensaje(//@ts-ignore
              selectedVenta.id_venta, message, username )}
          />
          </View>
             </View>
             
            ) : (
              <View>
                <Text> Ninguna venta seleccionada</Text>
                 <TouchableOpacity onPress={() => setChatenvivo(false)}>
              <Text style = {{color: '#006400'}}> Cerrar </Text>
            </TouchableOpacity>
              </View>
            ) }
             
          </View>

      </Modal>








onPress={() => enviarmensaje(selectedVenta.id_venta, message,  )}



<BottomSheet
    ref={bottomSheetRef}
    index={-1}
    snapPoints={snapPoints}
     >
       <Text> HOLA </Text>
     </BottomSheet>
<TouchableOpacity style={styles.locationButton} onPress={handlepress}>
        <Text style={styles.focusButtonText}> Add Location</Text>
      </TouchableOpacity>  
      
          <View>
      <TouchableOpacity style={styles.focusButton} onPress={handlepress}>
        <Text style={styles.focusButtonText}>Focus</Text>
      </TouchableOpacity> 
      
    </View>


    useEffect(() => {
  (async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permiso denegado para ubicacion del usuario');
    }
let location = await Location.getCurrentPositionAsync({});
    setregioninicial({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  })();
}, []); 
      */