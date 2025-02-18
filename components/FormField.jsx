import { Text, TextInput, TouchableOpacity, View, Image } from 'react-native';
import React, { useState } from 'react';
import { icons } from '../constants';

const FormField = ({ title, value, placeholder, otherStyles, handleChangeText, ...props }) => {
  const [showPass, setShowPass] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className={`space-y-1 ${otherStyles}`}>
      <Text className="text-gray-100 text-base font-pmedium">{title}</Text>

      <View
        className={`border-2 w-full h-16 px-4 bg-black-100 rounded-2xl items-center flex-row ${
          isFocused ? 'border-secondary' : 'border-gray-800'
        }`}
      >
        <TextInput
          className="flex-1 text-white font-psemibold text-base"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7b7b8b"
          onChangeText={handleChangeText}
          secureTextEntry={title === 'Password' && !showPass}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        {title === 'Password' && (
          <TouchableOpacity onPress={() => setShowPass(!showPass)}>
            <Image source={!showPass ? icons.eye : icons.eyeHide} className="w-7 h-10" resizeMode="contain" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
