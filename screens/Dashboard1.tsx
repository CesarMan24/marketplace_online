import Account from '../components/Account';
import { View } from 'react-native';
import { Session } from '@supabase/supabase-js';

export default function Dashboard1({ session }: { session: Session }) {
  return (
    <View style={{ flex: 1 }}>
      <Account key={session.user.id} session={session} />
    </View>
  );
}

/* 
ANTES DEL DESASTRE ------------------------------------------------------------------------

import { useState, useEffect } from 'react'
import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import { supabase } from '../lib/supabase';
import Auth from '../components/Auth';
import Account from '../components/Account';
import { View, Text } from 'react-native'
import { Session } from '@supabase/supabase-js'


export default function Dashboard1() {
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
    return(
    <View>
     {session && session.user ? <Account key={session.user.id} session={session} /> 
    
     : <View>
     <Text> Hola</Text>
     <Auth />
     </View>
     }
    
     
    </View>

    )
}

---------------------------------------------------------------------------------------------------------


import Account from '../components/Account';
import { View } from 'react-native';
import { Session } from '@supabase/supabase-js';

export default function Dashboard1({ session }: { session: Session }) {
  return (
    <View style={{ flex: 1 }}>
      <Account key={session.user.id} session={session} />
    </View>
  );
}


<View>
    <Text> Hola Dashboard1</Text>
    </View>
<View>
     {session && session.user ? <Account key={session.user.id} session={session} /> 
    
     : <View>
     <Text> Hola</Text>
     <Auth />
     </View>
     }
    
     
    </View>

    import { useState, useEffect } from 'react'
import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import { supabase } from '../lib/supabase';
import Auth from '../components/Auth';
import Account from '../components/Account';
import { View, Text } from 'react-native'
import { Session } from '@supabase/supabase-js'


export default function Dashboard1() {
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
    return(
    <View>
     {session && session.user ? <Account key={session.user.id} session={session} /> 
    
     : <View><Auth />
     
     </View>
     }
    
     
    </View>

    )
}


*/