import { FlatList, ImageBackground, TouchableOpacity, View, Modal, Image } from 'react-native';
import React, { useState, useCallback, useEffect } from 'react';
import * as Animatable from 'react-native-animatable';
import { icons } from '../constants';
import VideoScreen from './VideoScreen';

const zoomIn = { 0: { scale: 0.9 }, 1: { scale: 1.05 } };
const zoomOut = { 0: { scale: 1.05 }, 1: { scale: 0.9 } };

const TrendingItem = ({ activeItem, item, setActiveVideo }) => {
  const [play, setPlay] = useState(false);

  // When play is true, stop the main feed video
  useEffect(() => {
    if (play) {
      setActiveVideo(null);
    }
  }, [play]);

  return (
    <>
      <Animatable.View
        className="mr-5"
        animation={activeItem === item.$id ? zoomIn : zoomOut}
        duration={500}
      >
        <TouchableOpacity
          className="relative justify-center items-center"
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
        >
          <ImageBackground
            source={{ uri: item.thumbnail }}
            className="w-52 h-72 rounded-[33px] my-5 overflow-hidden shadow-lg shadow-black/40"
            resizeMode="cover"
          />
          <Image source={icons.play} className="w-12 h-12 absolute" resizeMode="contain" />
        </TouchableOpacity>
      </Animatable.View>

      {play && (
        <Modal visible={play} animationType="slide" transparent={true}>
          <VideoScreen 
          videoSource={item.video} 
          onClose={() => setPlay(false)}
         />
        </Modal>
      )}
    </>
  );
};

const Trending = ({ posts, setActiveVideo }) => {
  const [activeItem, setActiveItem] = useState(posts[0]?.$id);

  const viewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveItem(viewableItems[0].item?.$id);
    }
  }, []);

  return (
    <FlatList
      data={posts}
      renderItem={({ item }) => (
        <TrendingItem activeItem={activeItem} item={item} setActiveVideo={setActiveVideo} />
      )}
      horizontal
      onViewableItemsChanged={viewableItemsChanged}
      viewabilityConfig={{ itemVisiblePercentThreshold: 70 }}
      contentOffset={{ x: 100 }}
    />
  );
};

export default Trending;
