import Icon from 'react-native-vector-icons/MaterialIcons';

export default function FileFormatIcon({ format }: { format: string }): JSX.Element {
  switch (format.toLocaleLowerCase()) {
    case 'png':
      return <Icon name="image" />;
    case 'jpg':
      return <Icon name="image" />;
    case 'webm':
      return <Icon name="movie" />;
    case 'gif':
      return <Icon name="gif" />;
    default:
      return <Icon name="note" />;
  }
}
