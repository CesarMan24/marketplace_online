import React, { useState } from 'react'
import { Alert, StyleSheet, View, AppState } from 'react-native'
import { supabase } from '../lib/supabase'
import { Button, Input } from '@rneui/themed'
import { Text } from '@rneui/themed'
import { Image } from '@rneui/themed'
// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive 
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function signInWithEmail() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error){ Alert.alert(error.message)
      console.log(error)
    }
    setLoading(false)
  }

  async function signUpWithEmail() {
    setLoading(true)
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    })

    if (error) {
      Alert.alert(error.message) 
      console.log(error)
    }
    if (!session) Alert.alert('Cuenta aceptada y guardada, revisa tu correo')
    setLoading(false)
  }

  return (
    <View style={styles.bg}>
      <View style={styles.card}>
        <Text style={styles.title}>Bienvenido a Marketplace</Text>
        <Text style={styles.subtitle}>Inicia sesión o regístrate para continuar</Text>
        <Input
          label="Email"
          leftIcon={{ type: 'font-awesome', name: 'envelope' }}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com (hotmail/outlook)"
          autoCapitalize={'none'}
          inputStyle={{ color: '#222' }}
        />
        <Input
          label="Contrasena"
          leftIcon={{ type: 'font-awesome', name: 'lock' }}
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Contrasena (no necesariamente la del correo)"
          autoCapitalize={'none'}
        />
        <Button
          title="Iniciar sesión"
          buttonStyle={styles.button}
          titleStyle={styles.buttonTitle}
          disabled={loading}
          onPress={signInWithEmail}
          containerStyle={{ marginBottom: 10 }}
        />
        <Button
          title="Registrar cuenta"
          buttonStyle={[styles.button, { backgroundColor: '#34C759' }]}
          titleStyle={styles.buttonTitle}
          disabled={loading}
          onPress={signUpWithEmail}
        />
        <Text style={styles.info}>
          Las contraseñass se utilizan solo para ingresar a la cuenta y no se guardan en la base de datos. Se requiere una cuenta para la creación de ventas.
        </Text>
        <Text style = {{fontSize:20, textAlign: 'center'}}> Imagen del correo en hotmail al registrar</Text>
       <Image
  style={{
    width: 300,
    height: 300,
    alignSelf: 'center', 
    resizeMode: 'contain', 
    
  }}
  source={{
    uri: 'https://rtbtjinwleilrrdulpag.supabase.co/storage/v1/object/sign/almacenamientoapp/Captura%20de%20pantalla%202025-07-23%20101554.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV85ZTE3ZGRiNy0xYTI5LTQwOTgtOTA4Zi1kMmQyZDcwM2UwMDEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhbG1hY2VuYW1pZW50b2FwcC9DYXB0dXJhIGRlIHBhbnRhbGxhIDIwMjUtMDctMjMgMTAxNTU0LnBuZyIsImlhdCI6MTc1MzI5MTU1OSwiZXhwIjoxNzg0ODI3NTU5fQ.C16Gdaoff5gV06Gio1-BHH7OlrcS5chGLLZ8CzMKA6w'
  }}
/>
      </View>
      
    </View>
  )
}

const styles = StyleSheet.create({
   bg: {
    flex: 1,
    backgroundColor: '#f2f6fc',
    justifyContent: 'center',
    alignItems: 'center',
 
  },
  card: {
    width: '92%',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.13,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    marginTop: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#007AFF',
    textAlign: 'center',
    marginBottom: 6,
  },
   subtitle: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    marginBottom: 18,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 12,
  },
  buttonTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  info: {
    marginTop: 18,
    color: '#888',
    fontSize: 12,
    textAlign: 'center',
  },
})


/*

 <Image
          style={{ width: 200, height: 200, alignItems:'center', alignContent: 'center' }}
          source={{ uri: 'https://rtbtjinwleilrrdulpag.supabase.co/storage/v1/object/sign/almacenamientoapp/Captura%20de%20pantalla%202025-07-06%20134126.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV85ZTE3ZGRiNy0xYTI5LTQwOTgtOTA4Zi1kMmQyZDcwM2UwMDEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhbG1hY2VuYW1pZW50b2FwcC9DYXB0dXJhIGRlIHBhbnRhbGxhIDIwMjUtMDctMDYgMTM0MTI2LnBuZyIsImlhdCI6MTc1MTgzNDU2NSwiZXhwIjoyMDY3MTk0NTY1fQ.vIFt6Zi5a06kj93g7_9iJuzv-5O5-_hBf7RmM5q8OHE' }}
        />

*/