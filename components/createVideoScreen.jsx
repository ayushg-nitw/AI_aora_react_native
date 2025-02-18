import { Text, View, Image, TouchableOpacity, Touchable , Modal} from 'react-native';
import React , {useState} from 'react';
import { icons } from '../constants';
import VideoScreen2 from './VideoScreen2';

const CreateVideoScreen = ({
  video: {$id, title, thumbnail, video, creators: { username, avatar } }}) => {

 return (
    <View className="flex flex-col items-center px-4 mb-14">
      {/* Header (User Info + Menu Icon) */}
      <View className="flex flex-row gap-3 item-start">
        <View className="flex justify-center items-center flex-row flex-1">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary flex justify-center items-center p-0.5">
            <Image source={{ uri: avatar }} className="w-full h-full rounded-lg" resizeMode="cover" />
          </View>
          <View className="flex justify-center flex-1 ml-3 gap-y-1">
            <Text className="font-psemibold txt-sm text-white" numberOfLines={1}>{title}</Text>
            <Text className="text-xs text-gray-100 font-pregular" numberOfLines={1}>{username}</Text>
          </View>
        </View>

      </View>

       {/* Video/Thumbnail Section */}
            <TouchableOpacity
              activeOpacity={0.7}
              className="w-full h-60 rounded mt-3 relative flex justify-center items-center"
            >
             <Image source={{ uri: thumbnail }} className="w-full h-full rounded-xl" resizeMode="cover" />
             <Image source={icons.play} className="w-12 h-12 absolute" resizeMode="contain" />

            </TouchableOpacity>
  </View>
  );
};

export default CreateVideoScreen;