import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { StyleSheet, View, Alert, TextInput, Text, ScrollView} from 'react-native'
import { Button, Input } from '@rneui/themed'
import { Session } from '@supabase/supabase-js'
import Avatar from './Avatar'
import { fonts } from '@rneui/themed/dist/config'
import { useFocusEffect } from '@react-navigation/native'
export default function Account({ session }: { session: Session }) {
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState('')
  const [full_name, setFull_Name] = useState('')
  const [website, setWebsite] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  //const[ubicacion, setUbicacion] = useState(" ")
  const [usuarios, setusuariosrepetidos] = useState<any[]>([])

  useEffect(() => {
    
    if (session) {getProfile()}
    else {
    setUsername('');
    setFull_Name('');
    setAvatarUrl('');
    setWebsite('');
    //setUbicacion('');
    setLoading(false);
    }
  }, [session])

  async function getProfile() {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      const { data, error, status } = await supabase
        .from('profiles')
        //.select(`username, website, avatar_url`)
        .select(`username,full_name, avatar_url`)
        .eq('id', session?.user.id)
        .single()
      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setUsername(data.username)
        //setWebsite(data.website)
        setFull_Name(data.full_name)
        setAvatarUrl(data.avatar_url)
        usuariosrepetidos()
       // setUbicacion(data.ubicacion)
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  async function updateProfile({
    username,
    website,
    full_name,
    avatar_url,
  }: {
    username: string
    website: string
    full_name: string
    avatar_url: string
  }) {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      for (let index = 0; index < usuarios.length; index++) {

        if(username == usuarios[index].username) {
          Alert.alert("Usermae ya utilizado", "Escribe uno nuevo")
          console.log("--------------------------")
          console.log("USERNAME YA UTILIZADO")
          return
        }
        
      }
      const updates = {
        id: session?.user.id,
        username,
        full_name,
        website,
        avatar_url,
        updated_at: new Date(),
      }

      const { error } = await supabase.from('profiles').upsert(updates)

      if (error) {
        throw error
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

function firstname(full_name: string | null | undefined) {
  if (!full_name) return '';
  return full_name.split(' ')[0] || '';
}

async function usuariosrepetidos() {
  const {data, error} = await supabase
  .from('usuarios_repetidos')
  .select('*')
  if(data) {
    setusuariosrepetidos(data)
  }
  if(error) {
    console.log(error)
  }
}

  return (
    <ScrollView>
    
    <View style={styles.container}>
      {username ? <Text style = {{fontSize: 50}}> HOLA  🙋🏻, {firstname(full_name)}</Text>
      : <Text style = {{fontSize: 50}}> HOLA  🙋🏻</Text>}
     
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input label="Email" value={session?.user?.email} disabled />
      </View>
      <View style={styles.verticallySpaced}>
        <Input label="Usuario" value={username || ''} onChangeText={(text) => setUsername(text)} />
      </View>
      <View style={styles.verticallySpaced}>
        <Input label="Nombre" value={full_name || ''} onChangeText={(text) => setFull_Name(text)} />
      </View>
    
    { /*
     <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input label="Ubicacion (manten presionado en el mapa para anadir ubicacion)" value={JSON.stringify(ubicacion)} disabled placeholder="manten presionado mapa para anadir ubicacion"/>
      </View>
    
    <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input label="Ubicacion" value={ubicacion} disabled />
      </View>}
      {/*<View style={styles.verticallySpaced}>
        <Input label="Website" value={website || ''} onChangeText={(text) => setWebsite(text)} />
      </View>*/ }
      <View>
        {/* aqui se copio el avatar en el body*/ }
      <Avatar
        size={200}
        url={avatarUrl}
        onUpload={(url: string) => {
          setAvatarUrl(url)
          updateProfile({ username, full_name, website, avatar_url: url })
        }}
      />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button
          color= "green"
          title={loading ? 'Cargando ...' : 'Actualizar perfil'}
          onPress={() => updateProfile({ username,full_name, website, avatar_url: avatarUrl })}
          disabled={loading}
        />
      </View>

      <View style={styles.verticallySpaced}>
        <Button color =  "red" title="Cerrar sesion" onPress={() => supabase.auth.signOut()} />
      </View>
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
  mt20: {
    marginTop: 20,
  },
})