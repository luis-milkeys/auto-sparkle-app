import { Text } from '@ui-kitten/components';
import React from 'react';
import { View } from 'react-native';
import { globalStyles } from '../constants/globalStyles';

function PlaceholderText() {
  return (
    <View style={globalStyles.screenContainer}>
      <Text>Placeholder Element</Text>
    </View>
  );
}

export default PlaceholderText;
