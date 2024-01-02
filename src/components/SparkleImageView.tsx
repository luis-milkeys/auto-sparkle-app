import { Text } from '@ui-kitten/components';
import React, { useEffect, useState } from 'react';
import { Image, Linking, ListRenderItemInfo, StyleSheet, TouchableOpacity, View } from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { appPallette, cardColor } from '../constants/colors';
import { DerpiImage } from '../interfaces/DerpibooruData';
import formatBytes from '../utils/formatBytes';
import { globalStyles } from '../constants/globalStyles';
import { searchImageInQueue, toggleImageInQueue } from '../utils/LocalStorageHelper';
import FileFormatIcon from './FileFormatIcon';
import ImageRatingTag from './ImageRatingTag';

const styles = StyleSheet.create({
  centeredRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    flexShrink: 1,
    borderRadius: 4,
    borderColor: appPallette.border,
    borderWidth: 2,
    marginBottom: 8,
    backgroundColor: cardColor,
  },
  header: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    fontWeight: 'bold',
  },
  imageContainer: {
    height: 256,
  },
  footer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

interface Props {
  data: ListRenderItemInfo<DerpiImage>;
}

function SparkleImageView({ data }: Props) {
  const [isInQueue, setIsInQueue] = useState(false);
  const image = data.item;

  const handleImagePreview = (imageId: number) => {
    Linking.openURL('https://derpibooru.org/' + imageId);
  };

  const handleToggleInQueue = async (image: DerpiImage) => {
    const updatedQueue = await toggleImageInQueue(image);

    setIsInQueue(!isInQueue);

    if (updatedQueue) {
      console.log(`Queue updated with ${updatedQueue.length} items`);
    }
  };

  useEffect(() => {
    async function findInQueue() {
      const queueSearch = await searchImageInQueue(image);

      if (queueSearch) setIsInQueue(true);
    }

    findInQueue();
  }, []);

  return (
    <View key={image.id} style={styles.container}>
      <View style={styles.header}>
        <Text style={{ fontWeight: 'bold' }}>{image.id}</Text>
        <View style={{ ...styles.centeredRow, gap: 8 }}>
          {image.tags.includes('ai content') ? (
            <Text style={globalStyles.badgeSparkle}>
              <Icon name="auto-awesome" /> AI
            </Text>
          ) : (
            <></>
          )}
          <Text style={globalStyles.badge}>
            {<FileFormatIcon format={image.format} />} {image.format.toLocaleUpperCase()}
            {image.format === 'webm' ? ` (${image.duration.toFixed(0)}s)` : ''}
          </Text>
          <Text style={globalStyles.badge}>{formatBytes(image.size)}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.imageContainer}
        onLongPress={() => handleImagePreview(image.id)}
        onPress={() => handleToggleInQueue(image)}
      >
        {image.format === 'webm' ? (
          <Video
            source={{ uri: image.representations.medium || image.representations.small }}
            style={{ height: '100%', width: '100%' }}
            resizeMode="contain"
            muted
          />
        ) : (
          <Image
            source={{ uri: image.representations.medium || image.representations.small }}
            style={{ height: '100%', width: '100%' }}
            resizeMode="contain"
          />
        )}
      </TouchableOpacity>
      <View style={styles.footer}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ gap: 8, flexDirection: 'row', alignItems: 'center', marginRight: 16 }}>
            <View style={{ flexDirection: 'row' }}>
              <Icon name="keyboard-arrow-up" size={18} color={appPallette.green} />
              <Text style={{ color: appPallette.green, fontSize: 12 }}>{image.upvotes}</Text>
            </View>
            <Text style={image.upvotes >= image.downvotes ? globalStyles.badgeSuccess : globalStyles.badgeDanger}>
              {image.upvotes - image.downvotes}
            </Text>
            <View style={{ flexDirection: 'row' }}>
              <Icon name="keyboard-arrow-down" size={18} color={appPallette.red} />
              <Text style={{ color: appPallette.red, fontSize: 12 }}>{image.downvotes}</Text>
            </View>
          </View>

          <ImageRatingTag tags={image.tags} />
        </View>
        {isInQueue && (
          <Text style={globalStyles.badgeSparkle}>
            <Icon name="clear-all" /> In Queue
          </Text>
        )}
      </View>
    </View>
  );
}

export default SparkleImageView;
