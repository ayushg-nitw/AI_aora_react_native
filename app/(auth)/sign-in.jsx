import { Text, View, ScrollView, SafeAreaView, Image, Alert } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import React, { useState } from 'react'
import { images } from '../../constants'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import { Link, router } from 'expo-router'
import { getCurrentUser, signIn } from '../../lib/appwrite'
import { useGlobalContext } from '../../context/GlobalProvider'  // Import Global Context

const SignIn = () => {
  const { setUser, setIsLoggedIn } = useGlobalContext();  // Access Global State
  const [loginform, setloginform] = useState({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    if (!loginform.email || !loginform.password) {
      Alert.alert('Error', 'Please fill in all the fields');
      return;
    }

    setIsSubmitting(true);

    try {
      await signIn(loginform.email, loginform.password);
      const result = await getCurrentUser(); // Ensure it's awaited

      if (result) {
        setUser(result);
        setIsLoggedIn(true);
        Alert.alert('Success', 'User signed in Successfully');
        router.replace('/home');
      } else {
        throw new Error("User not authenticated.");
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className='bg-primary h-full'>
      <ScrollView>
        <View className='w-full justify-center h-[90vh] px-4 my-6'>
          <Image source={images.logo} resizeMode='contain' className='w-[115px] h-[35px]' />
          <Text className='text-2xl text-white text-semibold mt-10 font-psemibold'>Log in to Aora</Text>

          <FormField
            title="Email"
            value={loginform.email}
            handleChangeText={(e) => setloginform({ ...loginform, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            value={loginform.password}
            handleChangeText={(e) => setloginform({ ...loginform, password: e })}
            otherStyles="mt-7"
          />

          <CustomButton
            title='Sign In'
            handlePress={submit}
            containerStyles='mt-7'
            isLoading={isSubmitting}
          />

          <View className='justify-center pt-5 flex-row gap-2'>
            <Text className='text-lg text-pregular text-gray-100'>Don't have an account?</Text>
            <Link href='/sign-up' className='text-lg font-psemibold text-secondary'>Sign Up</Link>
          </View>
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
}

export default SignIn;
