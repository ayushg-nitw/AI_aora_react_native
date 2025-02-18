import { Text, View, Image, TouchableOpacity, Touchable , Modal} from 'react-native';
import React , {useState} from 'react';
import { icons } from '../constants';
import VideoScreen2 from './VideoScreen2';

const VideoCard = ({
  video: {$id, title, thumbnail, video, creators: { username, avatar } }, 
  isPlaying,
  isProfile, 
  isBookmark,
  onPlay,
  activeMenu,
  handleMenuToggle,
  handleBookmark}) => {

 return (
    <View className="flex flex-col items-center px-4 mb-14">
      {/* Header (User Info + Menu Icon) */}
      <View className="flex flex-row gap-3 item-start">
        <View className="flex justify-center items-center flex-row flex-1">
          { (isBookmark==='false' && isProfile=='false') &&
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary flex justify-center items-center p-0.5">
              <Image source={{ uri: avatar }} className="w-full h-full rounded-lg" resizeMode="cover" />
          </View>
         }
          <View className="flex justify-center flex-1 ml-3 gap-y-1">
            <Text className="font-psemibold txt-sm text-white" numberOfLines={1}>{title}</Text>
            <Text className="text-xs text-gray-100 font-pregular" numberOfLines={1}>{username}</Text>
          </View>
        </View>
        
      { ( isProfile==='false' || isBookmark==='false') &&
        <View className="pt-2 relative">
          <TouchableOpacity
            className="flex-1 justify-center items-center"
            onPress={()=>handleMenuToggle($id)} // Toggle menu for this video
          >
            <Image source={icons.menu} className="w-5 h-5" resizeMode="contain" />
          </TouchableOpacity>

          {/* Bookmark Modal (Dropdown Style) */}
          {activeMenu === $id && ( // Only show for the active menu
            <View className="absolute top-10 right-6 bg-gray-800 rounded-lg p-3 w-40 shadow-lg z-50">
              <TouchableOpacity
                className="flex flex-row items-center py-2"
                onPress={() => {
                  handleBookmark($id)
                  handleMenuToggle(null); // Close menu
                }}
              >
                <Image source={icons.bookmark} className="w-5 h-5 mr-2" resizeMode="contain" />
                <Text className="text-white text-sm">Add to Bookmark</Text>
              </TouchableOpacity>
            </View>
          )}

        </View>
       }

      </View>

      {/* Video/Thumbnail Section */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPlay} // Toggle play state
        className="w-full h-60 rounded mt-3 relative flex justify-center items-center"
      >
        {isPlaying ? (
          <VideoScreen2 videoSource={video} onClose={onPlay} />
        ) : (
          <>
            <Image source={{ uri: thumbnail }} className="w-full h-full rounded-xl" resizeMode="cover" />
            <Image source={icons.play} className="w-12 h-12 absolute" resizeMode="contain" />
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default VideoCard;