import { useVideoPlayer, VideoView } from 'expo-video';
import { StyleSheet, View } from 'react-native';

export default function VideoScreen({ videoSource }) {
  const player = useVideoPlayer(videoSource, player => {
    player.loop = true;
    player.play();
  });

  return (
    <View style={styles.videoContainer}>
      <VideoView style={styles.video} player={player} allowsFullscreen />
    </View>
  );
}

const styles = StyleSheet.create({
  videoContainer: {
    width: '100%', 
    height: '100%', 
    borderRadius: 15, // Match thumbnail rounded corners
    overflow: 'hidden',
  },
  video: {
    width: '100%',
    height: '100%',
  },
});
