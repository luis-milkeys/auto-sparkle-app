import React, { useEffect, useState } from 'react';
import { Alert, Platform, ToastAndroid, View } from 'react-native';
import { globalStyles } from '../constants/globalStyles';
import { getAppSettings, updateAppSettings } from '../utils/LocalStorageHelper';
import { Button, Icon, Input, Spinner, Text } from '@ui-kitten/components';
import { NavigationContext } from '@react-navigation/native';
import { version } from '../../package.json';

function SettingsScreen() {
  const [imageId, setImageId] = useState('');
  const [filterId, setFilterId] = useState('');
  const [tags, setTags] = useState([] as string[]);
  const [isSavingData, setIsSavingData] = useState(false);
  const [lastFetch, setLastFetch] = useState(0);
  const navigation = React.useContext(NavigationContext);

  const handleDataUpdate = async () => {
    setIsSavingData(true);

    if (imageId === '') {
      Alert.alert('Settings not saved', 'ImageId is required');
      setIsSavingData(false);
      return;
    }

    await updateAppSettings({
      filterId: Number(filterId),
      tags,
      lastImage: Number(imageId),
      lastFetch,
    });

    if (Platform.OS === 'android') {
      ToastAndroid.show('Settings saved', ToastAndroid.LONG);
    }
    setIsSavingData(false);
  };

  useEffect(() => {
    async function getData() {
      const data = await getAppSettings();

      if (data) {
        if (data.lastImage) {
          setImageId(String(data.lastImage));
        }
        setFilterId(String(data.filterId));
        setTags(data.tags);

        if (data.lastFetch) {
          setLastFetch(data.lastFetch);
        }
      }
    }

    navigation?.addListener('focus', getData);
  }, []);

  return (
    <View style={globalStyles.screenContainer}>
      <Text category="h5">
        Auto Sparkle <Text appearance="hint">v{version}</Text>
      </Text>
      <Input
        label="Last Image ID"
        value={imageId}
        onChangeText={(text: string) => setImageId(text)}
        style={{ marginTop: 16 }}
      />
      <Input
        label="Filter ID"
        value={filterId}
        onChangeText={(text: string) => setFilterId(text)}
        style={{ marginTop: 8 }}
      />
      <Input
        label="Tags (Comma Separated)"
        style={{ marginTop: 8 }}
        value={tags.length > 0 ? tags.join(', ') : ''}
        onChangeText={(text: string) => setTags(text.split(', '))}
      />
      <Text style={{ marginTop: 16 }}>
        {lastFetch === 0 ? 'Images never fetched' : `Last fetched at ${new Date(lastFetch).toLocaleString()}`}
      </Text>

      <Button
        style={globalStyles.purpleButton}
        onPress={handleDataUpdate}
        accessoryLeft={(props) => (isSavingData ? <Spinner size="small" /> : <Icon name="save" {...props} />)}
      >
        <Text>{isSavingData ? 'Saving' : 'Save'}</Text>
      </Button>
    </View>
  );
}

export default SettingsScreen;
