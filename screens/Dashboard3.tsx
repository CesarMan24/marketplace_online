import { View, Text, Alert, ScrollView } from "react-native"
import { Button, Input, Slider } from "@rneui/themed"
import { StyleSheet } from "react-native"
import { useState, useEffect } from "react"
import { TextInput } from "react-native"
import { Session } from "@supabase/supabase-js"
import { supabase } from "../lib/supabase"
import { useCallback } from "react"
import { useFocusEffect } from "@react-navigation/native"
import Ventaimg from "../components/Ventaimg"
import SelectDropdown from "react-native-select-dropdown"
import { AntDesign } from "@expo/vector-icons"
import { Dropdown } from "react-native-element-dropdown"
import * as ImagePicker from 'expo-image-picker'
import { Image } from "react-native"




export default function Form() {
    const [articulo, setArticulo] = useState(" ")
    const [descripcion, setDescripcion] = useState(" ")
    const [precio, setPrice] =  useState("")
    const [ventaurl, setVentaUrl] = useState("")
    const [categoria, setCategoria] = useState(null)
    const [session, setSession] = useState<Session | null>(null)
    const [loading, setLoading] = useState(true)
    const [username, setUsername] = useState('')
    const [ubicacion, setUbicacion] = useState("")
    const [id, SetUserId] = useState("")
    const [repeat_locations, setRepeat_locations] = useState<any[]>([])
    const data = [
    { label: 'Electronica', value: 'Electronica' },
    { label: 'Hogar', value: 'Hogar' },
    { label: 'Bebe', value: 'Bebe' },
    { label: 'Mascota', value: 'Mascota' },
    { label: 'Alimento', value: 'Alimento' },
    { label: 'Salud', value: 'Salud' },
    { label: 'Vehiculo', value: 'Vehiculo' },
    
  ];
      
   // const [session, setSession] = useState("")
    //const [value, setValue] = useState(0.5);
    useEffect(() => {
            supabase.auth.getSession().then(({ data: { session } }) => {
              setSession(session)
            })
        
            supabase.auth.onAuthStateChange((_event, session) => {
              setSession(session)
              setArticulo("")
              setDescripcion(""),
              setCategoria(null),
              setPrice("")
              setVentaUrl("")
            })
          }, [])
    useEffect(() => {
    if (session && session.user) {
      getProfile() 
    } else {
      setArticulo(""),
      setDescripcion(""),
      setCategoria(null),
      setPrice("")
      setVentaUrl("")}
  }, [session])

async function getProfile() {
     try {
      setLoading(true)
      //if (!session?.user) throw new Error('No hay usuario en la sesion')

      const { data, error, status } = await supabase
        .from('profiles')
        //.select(username, website, avatar_url)
        .select('id,username, ubicacion')
        .eq('id', session?.user.id)
        .single()
      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setUsername(data.username)
        setUbicacion(data.ubicacion)
        SetUserId(data.id)
        //setWebsite(data.website)
        
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      //setSession(session)
      setArticulo("")
      setDescripcion(""),
      setCategoria(null),
      setPrice("")
      setVentaUrl("")
      setLoading(false)
    }
}
useFocusEffect(
    useCallback(() => {
      getProfile();
      ubicacionesrepetidas();
    }, [session])
  );
function esSoloNumeros(cadena : string) {
  return /^[0-9]+([.]?[0-9]+)?$/.test(cadena);
}
function isEmpty(value : string) {
  return value === null || value === undefined || value === '';
}
async function handlesubmit() {
  //ubicacionesrepetidas();
  if(!session) {
    Alert.alert("Inicie sesion para poder registrar ventas")
    return
  }
 
  if(articulo == "" || articulo == " "){
  Alert.alert("Nombre del articulo ingresado erroneamente")
  return
  }
  if(descripcion == "" || descripcion == " "){
  Alert.alert("Descripcion ingresada erroneamente")
  return
  }
  if(!esSoloNumeros(precio)) {
  Alert.alert("Precio ingresado erroneamente")
  return
  }
  if(!ventaurl){
    Alert.alert("Imagen no detectada, intenta subirlo de nuevo")
    return
  }
  const ubicacionObj = typeof ubicacion === "string" ? JSON.parse(ubicacion) : ubicacion;
  for (let index = 0; index < repeat_locations.length;  index++) {
    /*console.log("entro al for")
    console.log (repeat_locations[index].ubicacion)
    console.log (" igual a ")
    console.log (JSON.parse(ubicacion)) */
    const repetido = repeat_locations[index].ubicacion
    //if(repeat_locations[index].ubicacion == JSON.parse(ubicacion)){
    if(repetido && repetido.latitude === ubicacionObj.latitude && ubicacionObj.longitude){
      //console.log (repeat_locations[index].ubicacion)
      Alert.alert("Ubicacion ya utilizada", " Seleccione la opcion 🔎 en el mapa para ver ubicaciones disponibles " )
      console.log("hay igualdad")
      return
    }
    
  } 
 

  if(!categoria) {
  Alert.alert("Categoria no ingresada") //categoria no ingresada
  return
  }

  try {
    const {error} = await supabase 
    .from('venta')
    .insert({articulo : articulo , 
      descripcion : descripcion , 
      precio : parseFloat(precio) , 
      id_usuario : id ,
      ubicacion : ubicacion, 
      venta_url: ventaurl,
      categoria: categoria
    });
    if (error) {
      Alert.alert(error.message)
    }else {
      Alert.alert("Venta registrada correctamente")
      setArticulo(""),
      setDescripcion(""),
      setCategoria(null),
      setPrice("")
      setVentaUrl("")
      ubicacionesrepetidas();
    }
  }
  catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
  }
}

/*useEffect(() => {
  const interval = setInterval(() => {
    ubicacionesrepetidas();
  }, 10000);
  return () => clearInterval(interval);
}, []); */

async function ubicacionesrepetidas() {
    const {data, error} = await supabase
    .from("ubicaciones_repetidas")
    .select("*")

    if(error) {
      console.log(error)
      return
    } else {
      setRepeat_locations(data)
      console.log("---------------")
      console.log(repeat_locations)
      //Alert.alert('Ubicaciones', JSON.stringify(repeat_locations, null, 2))
    }
  }
  const isanonimo = (usuario : string) => {
  if (usuario == "Anonimo"){
  console.log("usuario inexistente")
 return false
 }
 else{ 
  return true }
}

    return(
        <ScrollView>
          
          <View style={{ paddingHorizontal: 20, marginTop: 16 }}>
            {session && isanonimo(username)  && ubicacion ?
            <View>
             <Text style = {{fontFamily : "black", fontSize : 50 }}>Registro de ventas de {username } </Text> 
              <View>
              <Input  label = "Articulo" value={articulo} onChangeText={(text) => setArticulo(text)}/>
            </View>
            <View>
              <Input label = "Descripcion de Venta" value={descripcion} onChangeText={(text) => setDescripcion(text)}/>
            </View>
            <View>
              <Text> Precio en pesos mexicanos</Text>
              <TextInput keyboardType="decimal-pad" value = {precio} onChangeText={setPrice} placeholder="Anadir precio (solo valores numericos)"/>
            </View>
            <View> 
              <Input label="Ubicacion" value={JSON.stringify(ubicacion)} disabled placeholder='Manten presionado una ubicacion para anadirla en el mapa'/>
            </View>
            <View> 
              <Text>  {ventaurl ? "Imagen ingresada": "No hay imagen"} </Text>
                  <Ventaimg
                      size={200}
                      url={ventaurl}
                      onUpload={(url: string) => {
                        setVentaUrl(url)
                      }}
                    />
            </View>
            <View>
              <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder="Seleccione una opcion"
        searchPlaceholder="Search..."
        value={categoria}
        onChange={item => {
          setCategoria(item.value);
        }}
        renderLeftIcon={() => ( 
          <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
        )}
      />
            </View>
              <Button onPress={handlesubmit}> <Text style = {{color: 'white'}}> REGISTRAR </Text></Button>
              
             {/* <Button onPress={ubicacionesrepetidas}> Verificar ubicaciones</Button> */}
              <Text style= {{fontSize : 20}}> La direccion de registro se debe de seleccionar en el mapa, dicha ubicacion 
                se registra a la cuenta, por lo que se necesita iniciar sesion. La direccion
                puede modificarse en el mismo mapa
              </Text>
             </View>
            
             :<Text style = {{fontFamily : "black", fontSize : 50 , justifyContent: 'center'}}> Verifica el usuario</Text> }
            </View>
            
        </ScrollView>
    )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
 dropdownButtonStyle: {
  width: '50%', // Cambia de 200 a '100%'
  height: 50,
  backgroundColor: '#d1e7dd',
  borderRadius: 1,
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: 1,
  marginTop: 1,
  borderWidth: 1,
  borderColor: '#151E26',
},
    dropdownButtonTxtStyle: {
      flex: 1,
      fontSize: 18,
      fontWeight: '500',
      color: '#151E26',
    },
    dropdownButtonArrowStyle: {
      fontSize: 28,
    },
    dropdownButtonIconStyle: {
      fontSize: 28,
      marginRight: 8,
    },
    dropdownMenuStyle: {
      backgroundColor: '#E9ECEF',
      borderRadius: 8,
    },
    dropdownItemStyle: {
      width: '100%',
      flexDirection: 'row',
      paddingHorizontal: 12,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 8,
    },
    dropdownItemTxtStyle: {
      flex: 1,
      fontSize: 18,
      fontWeight: '500',
      color: '#151E26',
    },
    dropdownItemIconStyle: {
      fontSize: 28,
      marginRight: 8,
},
dropdown: {
      margin: 16,
      height: 50,
      borderBottomColor: 'gray',
      borderBottomWidth: 0.5,
    },
    icon: {
      marginRight: 5,
    },
    placeholderStyle: {
      fontSize: 16,
    },
    selectedTextStyle: {
      fontSize: 16,
    },
    iconStyle: {
      width: 20,
      height: 20,
    },
    inputSearchStyle: {
      height: 40,
      fontSize: 16,
    },
})
/* <TextInput keyboardType="decimal-pad" value = {price} onChangeText={setPrice} placeholder="Precio"/>*/
/*<View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18 }}>Value: {value.toFixed(2)}</Text>
      <Slider
        value={value}
        onValueChange={setValue}
        minimumValue={0}
        maximumValue={10}
        step={0.1}
        thumbStyle={{ height: 20, width: 20 }}
      />
    </View> 
    <Text style = {{fontFamily : "black", fontSize : 50 }}>Registro de ventas de {username } </Text>
    {session && session.user ? <Account key={session.user.id} session={session}
    <Text>{session?.user.email} </Text>



                <SelectDropdown
    data={categorias}
    onSelect={(selectedItem) => setCategoria(selectedItem)}
    buttonTextAfterSelection={(selectedItem) => selectedItem}
    rowTextForSelection={(item) => item}
    buttonStyle={{ 
      backgroundColor: '#d1e7dd',
      borderWidth: 1,
      borderColor: '#151E26',
      width: '100%',
      borderRadius: 8,
      height: 50
    }}
    buttonTextStyle={{ fontSize: 16, color: '#151E26' }}
    dropdownStyle={{ borderRadius: 8, backgroundColor: '#E9ECEF' }}
    rowTextStyle={{ fontSize: 16 }}
  />
    */




  /* import { View, Text, Alert, ScrollView } from "react-native"
import { Button, Input, Slider } from "@rneui/themed"
import { StyleSheet } from "react-native"
import { useState, useEffect } from "react"
import { TextInput } from "react-native"
import { Session } from "@supabase/supabase-js"
import { supabase } from "../lib/supabase"
import { useCallback } from "react"
import { useFocusEffect } from "@react-navigation/native"
import Ventaimg from "../components/Ventaimg"
import SelectDropdown from "react-native-select-dropdown"
import { AntDesign } from "@expo/vector-icons"
import { Dropdown } from "react-native-element-dropdown"
const data = [
    { label: 'Electronica', value: 'Electronica' },
    { label: 'Hogar', value: 'Hogar' },
    { label: 'Bebe', value: 'Bebe' },
    { label: 'Mascota', value: 'Mascota' },
    { label: 'Alimento', value: 'Alimento' },
    { label: 'Salud', value: 'Salud' },
    { label: 'Vehiculo', value: 'Vehiculo' },
    
  ];

 const DropdownComponent = () => {
    const [value, setValue] = useState(null);

    return (
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder="Seleccione una opcion"
        searchPlaceholder="Search..."
        value={value}
        onChange={item => {
          setValue(item.value);
        }}
        renderLeftIcon={() => (
          <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
        )}
      />
    );
    
  };



export default function Form() {
  

    const [articulo, setArticulo] = useState(" ")
    const [descripcion, setDescripcion] = useState(" ")
    const [precio, setPrice] =  useState("")
    const [ventaurl, setVentaUrl] = useState("")
    const [categoria, setCategoria] = useState("")
    const [session, setSession] = useState<Session | null>(null)
    const [loading, setLoading] = useState(true)
    const [username, setUsername] = useState('')
    const [ubicacion, setUbicacion] = useState("")
    const [id, SetUserId] = useState("")
    const categorias = [
  "electronica",
  "hogar",
  "prenda",
  "bebe",
  "mascota",
  "alimento",
  "salud",
  "vehiculo"
];
      
    
   // const [session, setSession] = useState("")
    //const [value, setValue] = useState(0.5);
    useEffect(() => {
            supabase.auth.getSession().then(({ data: { session } }) => {
              setSession(session)
            })
        
            supabase.auth.onAuthStateChange((_event, session) => {
              setSession(session)
            })
          }, [])
    useEffect(() => {
    if (session) getProfile()
  }, [session])

async function getProfile() {
     try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      const { data, error, status } = await supabase
        .from('profiles')
        //.select(`username, website, avatar_url`)
        .select(`id,username, ubicacion`)
        .eq('id', session?.user.id)
        .single()
      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setUsername(data.username)
        setUbicacion(data.ubicacion)
        SetUserId(data.id)
        //setWebsite(data.website)
        
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
}
useFocusEffect(
    useCallback(() => {
      getProfile();
    }, [session])
  );

async function handlesubmit() {
  if(!session) {
    Alert.alert("Inicie sesion para poder registrar ventas")
  }
  try {
    const {error} = await supabase 
    .from('venta')
    .insert({Articulo : articulo , Descripcion : descripcion , Precio : precio , id_usuario : id,Ubicacion : ubicacion, Venta_url : ventaurl, Categoria: categoria} )
  }
  catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
  }
}
    return(
        <ScrollView>
          <View style={{ paddingHorizontal: 20, marginTop: 16 }}>
            {session && session.user ?
            <View>
             <Text style = {{fontFamily : "black", fontSize : 50 }}>Registro de ventas de {username } </Text> 
              <View>
              <Input  label = "Articulo" value={articulo} onChangeText={(text) => setArticulo(text)}/>
            </View>
            <View>
              <Input label = "Descripcion de Venta" value={descripcion} onChangeText={(text) => setDescripcion(text)}/>
            </View>
            <View>
              <TextInput keyboardType="decimal-pad" value = {precio} onChangeText={setPrice} placeholder="Anadir precio"/>
            </View>
            <View> 
              <Input label="Ubicacion" value={JSON.stringify(ubicacion)} disabled placeholder='Manten presionado una ubicacion para anadirla en el mapa'/>
            </View>
            <View> 
              <Ventaimg
                      size={200}
                      url={ventaurl}
                      onUpload={(url: string) => {
                        setVentaUrl(url)
                      }}
                    />
            </View>
            <View>
              
  <DropdownComponent/>
            </View>
              <Button onPress={handlesubmit}> Registrar</Button>
              <Text style= {{fontSize : 20}}> La direccion de registro se debe de seleccionar en el mapa, dicha ubicacion 
                se registra a la cuenta, por lo que se necesita iniciar sesion. La direccion
                puede modificarse en el mismo mapa
              </Text>
             </View>
            
             :<Text style = {{fontFamily : "black", fontSize : 50 }}> Inicie sesion para registrar productos</Text> }
            </View>
            
        </ScrollView>
    )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
 dropdownButtonStyle: {
  width: '50%', // Cambia de 200 a '100%'
  height: 50,
  backgroundColor: '#d1e7dd',
  borderRadius: 1,
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: 1,
  marginTop: 1,
  borderWidth: 1,
  borderColor: '#151E26',
},
    dropdownButtonTxtStyle: {
      flex: 1,
      fontSize: 18,
      fontWeight: '500',
      color: '#151E26',
    },
    dropdownButtonArrowStyle: {
      fontSize: 28,
    },
    dropdownButtonIconStyle: {
      fontSize: 28,
      marginRight: 8,
    },
    dropdownMenuStyle: {
      backgroundColor: '#E9ECEF',
      borderRadius: 8,
    },
    dropdownItemStyle: {
      width: '100%',
      flexDirection: 'row',
      paddingHorizontal: 12,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 8,
    },
    dropdownItemTxtStyle: {
      flex: 1,
      fontSize: 18,
      fontWeight: '500',
      color: '#151E26',
    },
    dropdownItemIconStyle: {
      fontSize: 28,
      marginRight: 8,
},
dropdown: {
      margin: 16,
      height: 50,
      borderBottomColor: 'gray',
      borderBottomWidth: 0.5,
    },
    icon: {
      marginRight: 5,
    },
    placeholderStyle: {
      fontSize: 16,
    },
    selectedTextStyle: {
      fontSize: 16,
    },
    iconStyle: {
      width: 20,
      height: 20,
    },
    inputSearchStyle: {
      height: 40,
      fontSize: 16,
    },
})*/



/* 
import * as ImagePicker from 'expo-image-picker'
import { supabase } from '../lib/supabase'

// ...dentro de tu componente...

async function pickAndUploadImage() {
  // Selecciona la imagen
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 1,
  });

  if (!result.canceled && result.assets && result.assets.length > 0) {
    const asset = result.assets[0];
    const uri = asset.uri;
    const fileName = uri.split('/').pop() || `venta_${Date.now()}.jpg`;
    const response = await fetch(uri);
    const blob = await response.blob();

    // Sube la imagen al bucket
    const { data, error } = await supabase.storage
      .from('ventasimg')
      .upload(fileName, blob, {
        cacheControl: '3600',
        upsert: true,
        contentType: 'image/jpeg',
      });

    if (error) {
      Alert.alert('Error al subir imagen', error.message);
      return;
    }

    // Obtén la URL pública
    const { data: publicUrlData } = supabase
      .storage
      .from('ventasimg')
      .getPublicUrl(fileName);

    setVentaUrl(publicUrlData.publicUrl); // Guarda la URL en tu estado
  }
}
*/