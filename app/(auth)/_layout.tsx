import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import {Stack} from 'expo-router'
import { StatusBar } from 'expo-status-bar'   //not from react-native

const AuthLayout = () => {
  return (
    <>
    <Stack>
       <Stack.Screen 
         name='sign-in'
         options={{
          headerShown: false
         }}
       />
        <Stack.Screen 
         name='sign-up'
         options={{
          headerShown: false
         }}
       />
       
      {/* <StatusBar backgroundColor='#161622' style='light'/>  */}
    </Stack>
    </>
  )
}

export default AuthLayout

const styles = StyleSheet.create({})