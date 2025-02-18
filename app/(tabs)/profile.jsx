import { FlatList, Text, TouchableOpacity, View, Image, Modal } from 'react-native';
import React, { useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import useAppwrite from '../../lib/useAppwrite';
import { getUserPosts, signOut } from "../../lib/appwrite";
import { useGlobalContext } from '../../context/GlobalProvider';
import { router } from 'expo-router';
import { icons } from '@/constants';
import InfoBox from '../../components/InfoBox';
import EmptyState from '@/components/EmptyState';
import VideoScreen from '../../components/VideoScreen';

const Profile = () => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext();
  const { data: posts } = useAppwrite(() => getUserPosts(user.documents[0].$id));

  const [selectedVideo, setSelectedVideo] = useState(null); // Store selected video
  const [play, setPlay] = useState(false); // Play state

  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLoggedIn(false);
    router.replace('/sign-in'); // Navigate to sign-in page
  };

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        setSelectedVideo(null); // Close video when tab loses focus
        setPlay(false);
      };
    }, [])
  );

  return (
    <SafeAreaView className="bg-primary h-full">

      {/* Profile Header */}
      <View className="w-full justify-center items-center mt-6 mb-12 px-4">
        <TouchableOpacity className="w-full items-end mb-10" onPress={logout}>
          <Image source={icons.logout} resizeMode="contain" className="w-6 h-6" />
        </TouchableOpacity>

        {/* User Avatar */}
        <View className="w-16 h-16 border border-secondary rounded-lg justify-center items-center">
          <Image
            source={{ uri: user.documents[0]?.avatar }}
            className="w-[90%] h-[90%] rounded-lg"
            resizeMode="cover"
          />
        </View>


        <InfoBox title={user.documents[0]?.username} containerStyles="mt-5" titleStyles="text-lg" />


        {/* Posts & Followers Count */}
        <View className="mt-5 flex-row">
          <InfoBox title={posts.length || 0} subtitle="Posts" containerStyles="mr-5" titleStyles="text-xl" />
          <InfoBox title="1.2k" subtitle="Followers" titleStyles="text-xl" />
        </View>
      </View>
      

      {/* Videos in Grid View */}
      <FlatList
        data={posts}
        numColumns={3} // Show 3 videos per row
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            className="w-1/3 p-1" 
            onPress={() => {
              setSelectedVideo(item.video);
              setPlay(true);
            }}
          >
            <Image source={{ uri: item.thumbnail }} className="w-full h-32 rounded-lg" resizeMode="cover" />
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => <EmptyState title="No videos found!" subtitle="No videos uploaded yet!" />}
      />

      {/* Video Modal */}
      <Modal visible={selectedVideo !== null} animationType="slide" transparent={true}>
        <View className="flex-1 bg-black justify-center items-center">
          {/* Close Button */}
          <TouchableOpacity className="absolute top-10 right-6" onPress={() => {
            setSelectedVideo(null);
            setPlay(false);
          }}>
            <Image source={icons.close} className="w-8 h-8" resizeMode="contain" />
          </TouchableOpacity>

          {/* Full-Screen Video */}
          {selectedVideo && (
            <View className="w-full h-full">
              <VideoScreen 
                videoSource={selectedVideo} 
                play={play} 
                onClose={() => {
                  setSelectedVideo(null);
                  setPlay(false);
                }} 
              />
            </View>
          )}
        </View>
      </Modal>

      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

export default Profile;
