import { FlatList, Text, View } from 'react-native'
import React, { useEffect} from 'react'
import { useFocusEffect, useLocalSearchParams } from 'expo-router'
import { SafeAreaView } from 
'react-native-safe-area-context'
import { useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import SearchInput from '../../components/SearchInput'
import EmptyState from '../../components/EmptyState'
import { searchPosts} from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import VideoCard from '../../components/VideoCard'


const Search = () => {

   const {query} = useLocalSearchParams();
  const { data: posts, refetch } = useAppwrite(() => searchPosts(query));

  const [activeVideo, setActiveVideo] = useState(null); 

  useEffect(() => {
    refetch();
  }, [query])
  
  const handlePlay = (videoId) => {
    setActiveVideo((prev) => (prev === videoId ? null : videoId)); // Stop previous video
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
           />
        )}
        ListHeaderComponent={() => (
              <View className="my-6 px-4 mt-6 ">
                <Text className="font-pmedium text-sm text-gray-100"> Search Results for</Text>
                <Text className="text-2xl mb-10 font-psemibold text-white">{query}</Text>
                <SearchInput  className='my-5'initialQuery = {query} />
                
              </View>
        )}

        ListEmptyComponent={() => (
          <EmptyState title="No videos found!" subtitle= "No search result found for above query!" />
        )}
      />
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );

};

export default Search;