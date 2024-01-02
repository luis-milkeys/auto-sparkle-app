import React from 'react';
import { Image, ListRenderItemInfo, StyleSheet, View } from 'react-native';
import { Text } from '@ui-kitten/components';

import { appPallette, cardColor } from '../constants/colors';
import { globalStyles } from '../constants/globalStyles';
import formatBytes from '../utils/formatBytes';
import FileFormatIcon from './FileFormatIcon';
import { DerpiImageQueue } from '../screens/QueueScreen';
import Icon from 'react-native-vector-icons/MaterialIcons';

const styles = StyleSheet.create({
  container: {
    padding: 8,
    borderRadius: 16,
    backgroundColor: cardColor,
    marginBottom: 8,
    flexDirection: 'row',
    gap: 8,
  },
  imageContainer: {
    height: 64,
    width: 64,
  },
  downloadedCheck: { position: 'absolute', top: 16, right: 16 },
});

function CompactQueueItem(renderData: ListRenderItemInfo<DerpiImageQueue>) {
  const image = renderData.item;
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: image.representations.thumb_small }}
          style={{ height: '100%', width: '100%', borderRadius: 8, borderColor: appPallette.border, borderWidth: 2 }}
        />
      </View>
      <View>
        <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>{image.id}</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Text style={globalStyles.badge}>
            {<FileFormatIcon format={image.format} />} {image.format.toLocaleUpperCase()}
          </Text>
          <Text style={globalStyles.badge}>{formatBytes(image.size)}</Text>
        </View>
      </View>
      <View style={styles.downloadedCheck}>{image.downloaded && <Icon name="done" size={20} color="green" />}</View>
    </View>
  );
}

export default CompactQueueItem;
