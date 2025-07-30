
import { useState, useEffect } from 'react'
import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import Dashboard1 from './screens/Dashboard1';
import Dashboard2 from './screens/Dashboard2';
import Dashboard3 from './screens/Dashboard3';
import Dashboard4 from './screens/Dashboard4';
import { supabase } from './lib/supabase';
import Auth from './components/Auth';
import Account from './components/Account';
import { View, Text } from 'react-native'
import { Session } from '@supabase/supabase-js'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
//import Prueba from './screens/prueba';
export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  const Tab = createBottomTabNavigator();
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])   
//useEffect(() => {
//  supabase.auth.signOut();
//}, []);
if (!session) {
  return( 
  <GestureHandlerRootView>
  <Auth />
  </GestureHandlerRootView> )
}
  return ( 
<GestureHandlerRootView>
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
  name="Cuenta"
  children={() => <Dashboard1 session={session} />}
  options={{
    tabBarIcon: ({ color, size }) => (
      <Text style={{ fontSize: size, color: "black" }}>🪪</Text>
    ),
  }}
/>
        <Tab.Screen name = "Mapa" component={Dashboard2}  options={{
            tabBarIcon: ({ color, size }) => (
              <Text style={{ fontSize: size }}>🗺️</Text>
            ),
          }} />

          <Tab.Screen name = "Ventas" component={Dashboard3}  options={{
            tabBarIcon: ({ color, size }) => (
              <Text style={{ fontSize: size }}>💰</Text>
            ),
          }} />
          <Tab.Screen name = "Tus Ventas" component={Dashboard4}  options={{
            tabBarIcon: ({ color, size }) => (
              <Text style={{ fontSize: size }}>📄</Text>
            ),
          }} />
        
          
      </Tab.Navigator>
      
    </NavigationContainer>  
</GestureHandlerRootView>
  )
}
/*
 <Tab.Screen name = "test" component={Prueba}  options={{
            tabBarIcon: ({ color, size }) => (
              <Text style={{ fontSize: size }}>📄</Text>
            ),
          }} />
<Tab.Screen name = "Cuenta" component={Dashboard1}    options={{
            tabBarIcon: ({ color, size }) => (
              <Text style={{ fontSize: size, color: "black"}}>🪪</Text>
            ),
          }} />

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 


  <View>
     {session && session.user ? <Account key={session.user.id} session={session} /> 
    
     : <Auth />}
    
    </View>


     <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name = "Dashboard1" component={Dashboard1}/>
        <Tab.Screen name = "Dasboard2" component={Dashboard2}/>
      </Tab.Navigator>
    </NavigationContainer>  



    antes



import { useState, useEffect } from 'react'
import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import Dashboard1 from './screens/Dashboard1';
import Dashboard2 from './screens/Dashboard2';
import Dashboard3 from './screens/Dashboard3';
import { supabase } from './lib/supabase';
import Auth from './components/Auth';
import Account from './components/Account';
import { View, Text } from 'react-native'
import { Session } from '@supabase/supabase-js'
export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  const Tab = createBottomTabNavigator();
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])   
//useEffect(() => {
//  supabase.auth.signOut();
//}, []);
  return ( 
    
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name = "Cuenta" component={Dashboard1}    options={{
            tabBarIcon: ({ color, size }) => (
              <Text style={{ fontSize: size, color: "black"}}>🪪</Text>
            ),
          }} />
        <Tab.Screen name = "Map" component={Dashboard2}  options={{
            tabBarIcon: ({ color, size }) => (
              <Text style={{ fontSize: size }}>🗺️</Text>
            ),
          }} />
          <Tab.Screen name = "Ventas" component={Dashboard3}  options={{
            tabBarIcon: ({ color, size }) => (
              <Text style={{ fontSize: size }}>💰</Text>
            ),
          }} />
      </Tab.Navigator>
    </NavigationContainer>  
   
  )
} 
*/




/* 

    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name = "Cuenta" component={Dashboard1}    options={{
            tabBarIcon: ({ color, size }) => (
              <Text style={{ fontSize: size, color: "black"}}>🪪</Text>
            ),
          }} />
        <Tab.Screen name = "Mapa" component={Dashboard2}  options={{
            tabBarIcon: ({ color, size }) => (
              <Text style={{ fontSize: size }}>🗺️</Text>
            ),
          }} />
          <Tab.Screen name = "Ventas" component={Dashboard3}  options={{
            tabBarIcon: ({ color, size }) => (
              <Text style={{ fontSize: size }}>💰</Text>
            ),
          }} />
      </Tab.Navigator>
    </NavigationContainer>  
*/
