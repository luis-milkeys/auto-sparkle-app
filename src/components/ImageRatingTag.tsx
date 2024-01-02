import { Text } from '@ui-kitten/components';
import React from 'react';
import { globalStyles } from '../constants/globalStyles';

interface Props {
  tags: string[];
}

export default function ImageRatingTag({ tags }: Props) {
  const foundTag = tags.find(
    (tag) =>
      tag === 'safe' ||
      tag === 'questionable' ||
      tag === 'suggestive' ||
      tag === 'explicit' ||
      tag === 'semi-grimdark' ||
      tag === 'grimdark' ||
      tag === 'grotesque'
  );

  if (foundTag === 'safe') {
    return <Text style={globalStyles.badgeSuccess}>S</Text>;
  }

  if (foundTag === 'questionable') {
    return <Text style={globalStyles.badge}>Q</Text>;
  }

  if (foundTag === 'suggestive') {
    return <Text style={globalStyles.badge}>S</Text>;
  }

  if (foundTag === 'explicit') {
    return <Text style={globalStyles.badgeSparkle}>E</Text>;
  }

  if (foundTag === 'semi-grimdark') {
    return <Text style={globalStyles.badgeDanger}>SG</Text>;
  }

  if (foundTag === 'grimdark') {
    return <Text style={globalStyles.badgeDanger}>G</Text>;
  }

  if (foundTag === 'grotesque') {
    return <Text style={globalStyles.badgeDanger}>GR</Text>;
  }

  return <Text>?</Text>;
}
