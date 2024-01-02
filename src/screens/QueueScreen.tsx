import { NavigationContext } from '@react-navigation/native';
import { Button, Icon, Text } from '@ui-kitten/components';
import React, { useEffect, useState } from 'react';
import RNFS from 'react-native-fs';
import { ActivityIndicator, Alert, FlatList, PermissionsAndroid, ToastAndroid, View } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import CompactQueueItem from '../components/CompactQueueItem';
import { globalStyles } from '../constants/globalStyles';
import { DerpiImage } from '../interfaces/DerpibooruData';
import formatBytes from '../utils/formatBytes';
import { clearImageQueue, getImageQueue } from '../utils/LocalStorageHelper';
import axios from 'axios';

export interface DerpiImageQueue extends DerpiImage {
  downloaded?: boolean;
}

function QueueScreen() {
  const [queueItems, setQueueItems] = useState<DerpiImageQueue[]>([]);
  const [queueSize, setQueueSize] = useState<number>(0);
  const [executingDownloads, setExecutingDownloads] = useState<boolean>(false);
  const navigation = React.useContext(NavigationContext);

  useEffect(() => {
    async function getData() {
      const queue = await getImageQueue();

      if (queue) {
        console.log(`Loaded ${queue.length} items from the queue`);
        setQueueItems(queue);
        const totalSize = queue.reduce((previous, current) => previous + current.size, 0);
        setQueueSize(totalSize);
      }
    }

    navigation?.addListener('focus', getData);
  }, []);

  const dispatchQueueClear = async () => {
    await clearImageQueue();

    const queue = await getImageQueue();

    if (queue) setQueueItems(queue);
  };

  /**
   * Executes the downloads using react native file system + axios
   */
  async function executeDownloadsRNFS() {
    try {
      setExecutingDownloads(true);

      let downloadedSize = 0;
      const downloadDir = `${RNFS.DownloadDirectoryPath}/Auto Sparkle`;

      if (!(await RNFS.exists(downloadDir))) {
        await RNFS.mkdir(downloadDir);
      }

      const appDownloadsFolders = {
        default: `${downloadDir}/Image`,
        ML: `${downloadDir}/ML`,
        video: `${downloadDir}/Video`,
      };

      if (!(await RNFS.exists(appDownloadsFolders.default))) {
        await RNFS.mkdir(appDownloadsFolders.default);
      }
      if (!(await RNFS.exists(appDownloadsFolders.video))) {
        await RNFS.mkdir(appDownloadsFolders.video);
      }
      if (!(await RNFS.exists(appDownloadsFolders.ML))) {
        await RNFS.mkdir(appDownloadsFolders.ML);
      }

      for (let i = 0; i < queueItems.length; i++) {
        const image = queueItems[i];

        const filename = image.view_url.split('/')[image.view_url.split('/').length - 1];
        let downloadPath = `${appDownloadsFolders.default}/${filename}`;

        if (image.format === 'webm') {
          downloadPath = `${appDownloadsFolders.video}/${filename}`;
        }

        if (image.tags.includes('ai content')) {
          downloadPath = `${appDownloadsFolders.ML}/${filename}`;
        }

        const imageResponse = await axios.get(image.view_url, {
          responseType: 'arraybuffer',
        });

        await RNFS.writeFile(downloadPath, JSON.stringify(imageResponse.data), 'base64');

        downloadedSize += image.size;
      }

      Alert.alert('Downloads Finished', formatBytes(downloadedSize) + ' of pony fun has been downloaded.');
    } catch (error) {
      Alert.alert('Unknown error (RNFS)', `Unable to download images: ${error}`);
      console.error(error);
    } finally {
      setExecutingDownloads(false);
    }
  }

  /**
   * Executes the downloads using React Native Fetch Blob
   */
  function executeDownloadsRNFB() {
    try {
      setExecutingDownloads(true);
      let downloadedSize = 0;
      const downloadDir = `${RNFetchBlob.fs.dirs.DownloadDir}/Auto Sparkle`;
      const appDownloadsFolders = {
        default: `${downloadDir}/Image`,
        ML: `${downloadDir}/ML`,
        video: `${downloadDir}/Video`,
      };

      let processed = 0;

      for (let i = 0; i < queueItems.length; i++) {
        const image = queueItems[i];
        const filename = image.view_url.split('/')[image.view_url.split('/').length - 1];
        let downloadPath = `${appDownloadsFolders.default}/${filename}`;

        if (image.format === 'webm') {
          downloadPath = `${appDownloadsFolders.video}/${filename}`;
        }

        if (image.tags.includes('ai content')) {
          downloadPath = `${appDownloadsFolders.ML}/${filename}`;
        }

        RNFetchBlob.config({
          fileCache: true,
          path: downloadPath,
        })
          .fetch('GET', image.view_url)
          .then((res) => {
            console.log(`image ${image.id} downloaded to ${res.path()}`);
            const queueTemp = queueItems;
            const currentItemIndex = queueTemp.findIndex((item) => item.id === image.id);
            if (currentItemIndex !== -1) {
              image.downloaded = true;
              queueTemp[currentItemIndex] = image;
              setQueueItems(queueTemp);
            }

            processed += 1;

            if (processed === queueItems.length) {
              Alert.alert('Downloads finished', formatBytes(downloadedSize) + ' of pony fun has been downloaded.');
              ToastAndroid.show('All items downloaded successfully.', ToastAndroid.SHORT);
              setExecutingDownloads(false);
            }
          })
          .catch((error) => {
            console.warn(`Error downloading image: ${error}`);
            ToastAndroid.show('An error occurred.', ToastAndroid.SHORT);
          });

        downloadedSize += image.size;
      }
    } catch (error) {
      Alert.alert('Unknown error', `Unable to download images: ${error}`);
      console.error(error);
    }
  }

  return (
    <View style={globalStyles.screenContainer}>
      <FlatList
        ListHeaderComponent={() => (
          <View style={{ marginBottom: 8 }}>
            <View
              style={{
                flexDirection: 'row',
                gap: 8,
              }}
            >
              <Button
                style={globalStyles.purpleButton}
                onPress={dispatchQueueClear}
                accessoryLeft={(props) => <Icon name="clear-all" {...props} />}
                disabled={executingDownloads}
              >
                <Text>Clear</Text>
              </Button>
              <Button
                style={globalStyles.purpleButton}
                onPress={executeDownloadsRNFB}
                accessoryLeft={
                  executingDownloads ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    (props) => <Icon name="vertical-align-bottom" {...props} />
                  )
                }
                disabled={executingDownloads}
              >
                <Text>Download{executingDownloads ? 'ing' : ''}</Text>
              </Button>
            </View>

            <Text style={{ marginTop: 8 }} category="p1" appearance="hint">
              {queueItems.length} items in queue ({formatBytes(queueSize)})
            </Text>
          </View>
        )}
        ListEmptyComponent={() => (
          <View
            style={{
              alignItems: 'center',
            }}
          >
            <Text category="h4">No images in queue</Text>
          </View>
        )}
        data={queueItems}
        keyExtractor={(item) => String(item.id)}
        renderItem={CompactQueueItem}
      />
    </View>
  );
}

export default QueueScreen;
