import { Text, View, ScrollView, SafeAreaView, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { images } from '../../constants'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import { Link, router } from 'expo-router'
import { createUser } from '../../lib/appwrite'
import { useGlobalContext } from '../../context/GlobalProvider'  // Import Global Context

const SignUp = () => {
  const { setUser, setIsLoggedIn } = useGlobalContext(); // Access Global State
  const [signupform, setsignupform] = useState({ username: '', email: '', password: '' });
  const [isSubmitting, setisSubmitting] = useState(false);

  const submit = async () => {
    if (!signupform.username || !signupform.email || !signupform.password) {
      Alert.alert('Error', 'Please fill in all the fields');
      return;
    }

    setisSubmitting(true);

    try {
      const result = await createUser(signupform.email, signupform.password, signupform.username);

      if (result) {
        setUser(result);
        setIsLoggedIn(true);
        router.replace('/home');
      } else {
        throw new Error("User creation failed.");
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setisSubmitting(false);
    }
  };

  return (
    <SafeAreaView className='bg-primary h-full'>
      <ScrollView>
        <View className='w-full justify-center h-[95vh] px-4 my-6'>
          <Image source={images.logo} resizeMode='contain' className='w-[115px] h-[35px]' />
          <Text className='text-2xl text-white text-semibold mt-10 font-psemibold'>Sign Up to Aora</Text>

          <FormField
            title="Username"
            value={signupform.username}
            handleChangeText={(e) => setsignupform({ ...signupform, username: e })}
            otherStyles="mt-7"
          />

          <FormField
            title="Email"
            value={signupform.email}
            handleChangeText={(e) => setsignupform({ ...signupform, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            value={signupform.password}
            handleChangeText={(e) => setsignupform({ ...signupform, password: e })}
            otherStyles="mt-7"
          />

          <CustomButton
            title='Sign Up'
            handlePress={submit}
            containerStyles='mt-7'
            isLoading={isSubmitting}
          />

          <View className='justify-center pt-5 flex-row gap-2'>
            <Text className='text-lg text-pregular text-gray-100'>Have an Account already?</Text>
            <Link href='/sign-in' className='text-lg font-psemibold text-secondary'>Sign In</Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default SignUp;
