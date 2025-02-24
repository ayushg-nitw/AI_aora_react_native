import { FlatList, StyleSheet, Text, View,Image, RefreshControl } from 'react-native'
import React, { useEffect,useCallback } from 'react'

import { useFocusEffect } from 'expo-router'
import { SafeAreaView } from 
'react-native-safe-area-context'
import { useState } from 'react'
import { StatusBar } from 'expo-status-bar'

import {images} from '../../constants'

import SearchInput from '../../components/SearchInput'
import Trending from '../../components/Trending'
import EmptyState from '../../components/EmptyState'
import { Alert } from 'react-native'
import {getAllPosts, getLatestPosts} from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import VideoCard from '../../components/VideoCard'
import { useGlobalContext } from '@/context/GlobalProvider'
import { updateDocument } from '../../lib/appwrite'


const Home = () => {

  const {user, setUser, setIsLoggedIn} = useGlobalContext();

if (!user) {
  return (
    <SafeAreaView className="bg-primary h-full flex items-center justify-center">
      <Text className="text-white text-lg">Loading...</Text>
    </SafeAreaView>
  );
}

  const { data: posts, refetch } = useAppwrite(getAllPosts);
  const { data: latestPosts } = useAppwrite(getLatestPosts);

  const [refreshing, setRefreshing] = useState(false);
  const [activeVideo, setActiveVideo] = useState(null); // Track which video is playing

  const [activeMenu, setActiveMenu] = useState(null); // Track which menu is open

  const handleMenuToggle = (videoId) => {
    setActiveMenu(activeMenu === videoId ? null : videoId); // Toggle menu for specific video
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setActiveVideo(null);
    await refetch();
    setRefreshing(false);
  };

  const handlePlay = (videoId) => {
    setActiveVideo((prev) => (prev === videoId ? null : videoId)); // Stop previous video
  };

   const handleBookmark = async (videoId) => {
      if (!user) {
        Alert.alert("Error", "User information is missing. Please log in again.");
        return;
      }
    
      try {
         const video = posts.find((item) => item.$id === videoId);
        if (!video) return;
    
        const userId = user.$id;
  
        const isBookmarked = video.bookmark.includes(userId);
    
        if (isBookmarked) {
          Alert.alert("Already Bookmarked", "This video is already in your bookmarks!");
          return;
        }
        // If not bookmarked, add to bookmarks
        const updatedBookmarks = [...video.bookmark, userId];
    
        // Update the video document in Appwrite
        await updateDocument(videoId, { bookmark: updatedBookmarks });
        Alert.alert("Success", "Video Bookmarked Successfully!");
    
        // Small delay before refetch to ensure state updates properly
        setTimeout(() => refetch(), 500);
    
      } catch (error) {
        console.error("Error updating bookmark:", error);
        Alert.alert("Error", "Failed to update bookmark. Try again.");
      }
    };
  
  useFocusEffect(
    React.useCallback(() => {
      return () => setActiveVideo(null); // Runs when tab loses focus
    }, [])
  );

  return (

    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        renderItem={({ item }) => (

          <VideoCard
            video={item}
            isPlaying={activeVideo === item.$id}
            onPlay={() => handlePlay(item.$id)}
            activeMenu={activeMenu}
            handleMenuToggle = {handleMenuToggle}
            handleBookmark= {handleBookmark}
            isProfile='false'
            isBookmark='false'
          />

        )}
        ListHeaderComponent={() => (
          <View className="my-6 px-4 space-y-6">
            <View className="justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-pmedium text-sm text-gray-100"> Welcome back</Text>
                <Text className="text-2xl font-psemibold text-white">
                   {user?.username || "Guest"}
                </Text>
              </View>
              <View className="mt-1.5">
                <Image source={images.logoSmall} className="w-9 h-10" resizeMode="contain" />
              </View>
            </View>
            <SearchInput placeholder='Search a video topic...' />
            <View className="w-full flex-1 pt-5 pb-8">
              <Text className="text-lg text-gray-100 font-pregular mb-3">Latest Videos</Text>
              <Trending posts={latestPosts ?? []} setActiveVideo={setActiveVideo} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState title="No videos found!" subtitle="Be the first one to upload a video" />
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );

};

export default Home;