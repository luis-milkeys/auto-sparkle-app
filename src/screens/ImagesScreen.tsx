import { Button, Icon, Spinner, Text } from '@ui-kitten/components';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, useWindowDimensions } from 'react-native';
import { Alert, View } from 'react-native';
import SparkleImageView from '../components/SparkleImageView';
import { autoSparkleColorDark } from '../constants/colors';
import { globalStyles } from '../constants/globalStyles';
import { DerpiImage } from '../interfaces/DerpibooruData';
import getDownloadList from '../service/DerpiService';
import { getColumnsForAspectRatio } from '../utils/getColumnsForAspectRatio';
import { clearImageQueue, getAppSettings, getFetchedImages, setFetchedImages } from '../utils/LocalStorageHelper';

function ImagesScreen() {
  const [lastFetchTs, setLastFetchTs] = useState(0);
  const [lastFetchedImage, setLastFetchedImage] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const [imageList, setImageList] = useState([] as DerpiImage[]);
  const [isLoadingCache, setIsLoadingCache] = useState(true);
  const { width, height } = useWindowDimensions();
  const columnsForAspectRatio = getColumnsForAspectRatio(width, height);

  const forceImagesFetch = async () => {
    setIsFetching(true);
    console.log('Fetching images');

    if (lastFetchedImage === 0) {
      Alert.alert('Images not fetched', 'Last image was not set');
      setIsFetching(false);
      return;
    }

    const images = await getDownloadList();

    if (!images) {
      Alert.alert('Error', 'Unable to recover image list');
      setIsFetching(false);
    } else {
      setImageList(images);
      await setFetchedImages(images);
      setLastFetchTs(Date.now());
      setIsFetching(false);
      await clearImageQueue();
    }
  };

  useEffect(() => {
    async function getData() {
      const settings = await getAppSettings();
      const images = await getFetchedImages();

      if (settings) {
        if (settings.lastFetch) setLastFetchTs(settings.lastFetch);
        if (settings.lastImage) setLastFetchedImage(settings.lastImage);
      }

      setImageList(images);
      setIsLoadingCache(false);
      console.log(`ImagesScreen: Loaded ${images.length} images from local storage cache`);
    }

    getData();
  }, []);

  return (
    <View style={globalStyles.screenContainer}>
      {isLoadingCache ? (
        <View
          style={{
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ActivityIndicator color={autoSparkleColorDark} size="large" />
        </View>
      ) : (
        <FlatList
          ListHeaderComponent={() => (
            <>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Text>{lastFetchTs === 0 ? 'Never fetched' : new Date(lastFetchTs).toLocaleString('pt')}</Text>
                <Button
                  style={isFetching ? { marginTop: 8 } : globalStyles.purpleButton}
                  onPress={forceImagesFetch}
                  accessoryLeft={(props) => (isFetching ? <Spinner size="small" /> : <Icon name="sync" {...props} />)}
                  disabled={isFetching}
                >
                  <Text>{isFetching ? 'Fetching' : 'Fetch Images'}</Text>
                </Button>
              </View>
              <Text style={{ marginBottom: 8, fontSize: 12, marginTop: 8 }} category="p1" appearance="hint">
                Loaded {imageList.length} images
              </Text>
            </>
          )}
          ListEmptyComponent={() => (
            <View
              style={{
                alignItems: 'center',
              }}
            >
              <Text category="h4">No images</Text>
              <Text category="p1">Hit "Fetch" to update.</Text>
            </View>
          )}
          data={imageList}
          renderItem={(data) => <SparkleImageView data={data} />}
          keyExtractor={(item) => String(item.id)}
          numColumns={columnsForAspectRatio > 1 ? columnsForAspectRatio : undefined}
          columnWrapperStyle={columnsForAspectRatio > 1 ? { gap: 8 } : undefined}
        />
      )}
    </View>
  );
}

export default ImagesScreen;
