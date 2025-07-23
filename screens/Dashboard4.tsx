import { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { useState, useEffect, useCallback } from "react";
import { View, Text, Image, ScrollView } from "react-native";
import { Button, Input } from '@rneui/themed'
import { Alert } from "react-native";
import { color } from "@rneui/themed/dist/config";
import { useFocusEffect } from "@react-navigation/native";
export default function Tusventas() {
const [session, setSession] = useState<Session | null>(null)
const [tusventas, seTusVentas] = useState<any[]>([])
const [loading, setLoading] = useState(true)
const [id, setId] = useState("")
const [username, setUsername] = useState("")
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
    getProfile()}   
}, [session]);
useFocusEffect(
    useCallback(() => {
      getProfile();
      //ubicacionesrepetidas();
    }, [session])
  );
async function getProfile() {
    try {
      setLoading(true)
      //if (!session?.user) throw new Error('No user on the session!')

      const { data, error, status } = await supabase
        .from('profiles')
        //.select(username, website, avatar_url)
        .select('id, username')
        .eq('id', session?.user.id)
        .single()
      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setUsername(data.username)
        setId(data.id)
        yoursells(data.id)
  
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message)
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
      
    }
  }


async function yoursells (iddelusuario: string) {
const {data, error} = await supabase.rpc(
    'ventas_de_usuario2', {iddelusuario});
    if (error) {
      Alert.alert ('Error', error.message);
      return;
    }
    if (data) {
      //console.log("Datos", data) 
      seTusVentas(data)
      console.log("Ventas ", tusventas)
     //Alert.alert('Datos', JSON.stringify(data, null, 2));
     if ( iddelusuario == null) {
       Alert.alert ("Incie sesion para ver ventas")
     } 
    }
} 
async function eliminar_registro(idventa : number) {
    console.log("----------------------------------------------------")
    console.log("idventa " +idventa)
    const {data,error} = await supabase.rpc('eliminar_registro', {idventa});
    if (error) {
    console.error('Error al eliminar el registro:', error.message);
  } else {
    console.log('Registro eliminado con éxito.');
    Alert.alert("Registro eliminado con exito ")
    //yoursells(id)//refresh para no mostrar el registro eliminado
    getProfile()
  }
}
const STORAGE_URL = "https://rtbtjinwleilrrdulpag.supabase.co/storage/v1/object/public/ventasimg/";
//https://rtbtjinwleilrrdulpag.supabase.co
function getPublicImageUrl(path: string | null) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  console.log(STORAGE_URL + path)
  return STORAGE_URL + path;
}
    return(
        
        <ScrollView>
            {session ? (
        <View>
            <Text style = {{fontFamily : "black", fontSize : 30}}> Control de registro </Text>
            {tusventas.map((tuventa,idx) => (
            
             <View key = {tuventa.id_venta ?? idx} style = {{shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5,alignItems: 'center', flexDirection: 'row',borderColor: 'black', borderWidth: 5, margin: 5, }}>
                <Image   source={{ 
      //@ts-ignore
      uri: getPublicImageUrl(tuventa.venta_url) || "" }}
    style={{ width: 100, height: 100, margin:5 }}
    resizeMode="cover"/>
            <View style={{ paddingVertical: 10, paddingHorizontal: 10, flex: 1 }}>
              <Text style={{ textAlign: 'left', fontSize: 20, fontWeight: 'bold', marginBottom: 4 }}>
                {tuventa.articulo}
              </Text>
              <Text style={{ textAlign: 'left', fontSize: 12, color: '#444', marginBottom: 4 }}>
                {tuventa.descripcion}
              </Text>
              <Text style={{ textAlign: 'left', fontSize: 14, color: '#666', marginBottom: 8 }}>
                Categoría: {tuventa.categoria}
              </Text>
              <Button
                color="red"
                onPress={() => eliminar_registro(tuventa.id_venta)}
                buttonStyle={{ paddingVertical: 6 }}
                title= "Eliminar registro"
              />
                
            </View>
            </View>
            )
            )}
        </View>
            ) : (<Text style = {{fontFamily : "black", fontSize : 50 }}> Inicia sesion para ver tus ventas </Text>) }
        </ScrollView>
    )
}