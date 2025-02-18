import { Text, TextInput, TouchableOpacity, View, Image, Alert } from 'react-native';
import React, { useState } from 'react';
import { icons } from '../constants';
import { router, usePathname } from 'expo-router';

const SearchInput = ({placeholder, initialQuery}) => {
  const [showPass, setShowPass] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const Pathname = usePathname();
  const [query, setQuery] = useState(initialQuery || "");

  return (

      <View
        className={`border-2 w-full h-16 px-4 bg-black-100 rounded-2xl items-center flex-row ${
          isFocused ? 'border-secondary' : 'border-gray-800'
        } space-x-4`}
      >
        <TextInput
          className="text-base mt-0.5 text-white flex-1 font-pregular"
          value={query}
          placeholder={placeholder}
          placeholderTextColor="#CDCDE0"
          onChangeText= { (e) => setQuery(e)}

        />

          <TouchableOpacity
            onPress={()=>{
              if(!query) return Alert.alert("Missing Query", "Please input something to search !");
              if(Pathname.startsWith('/search')) router.setParams({query});
              else router.push(`/search/${query}`);
            }}
          >
            <Image source= {icons.search} className='w-6 h-6' resizeMode='contain'></Image>
          </TouchableOpacity>
 
      </View>

  );
};

export default SearchInput;
