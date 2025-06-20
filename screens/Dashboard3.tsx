import { View, Text } from "react-native"
import { Button, Input } from "@rneui/themed"
import { useState, useEffect } from "react"
export default function Form() {
    const [Articulo, setArticulo] = useState("")
    
    return(
        <View>
            <Text style = {{fontFamily : "black", fontSize : 10}}> Registro de ventas</Text>
            <View>
            <Input label = "Articulo" value={Articulo} onChangeText={(text) => setArticulo(text)}/>
            </View>
        </View>
    )
}