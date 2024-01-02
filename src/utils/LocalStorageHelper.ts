import AsyncStorage from '@react-native-async-storage/async-storage';
import { DerpiImage } from '../interfaces/DerpibooruData';

export interface AppSettingsInterface {
  lastFetch: null | number;
  lastImage: null | number;
  tags: string[];
  filterId: number;
}

const appSettingsStorageKey = '@@autoSparkleAppData';
const fetchedImagesKey = '@@autoSparkleImages';
const downloadsQueueKey = '@@autoSparkleQueue';

const defaultAppSettingsData = {
  lastFetch: null,
  lastImage: null,
  tags: ['-safe'],
  filterId: 189978,
};

/**
 * Recovers the app settings object
 */
export async function getAppSettings(): Promise<AppSettingsInterface | null> {
  try {
    const data = await AsyncStorage.getItem(appSettingsStorageKey);

    if (data) {
      return JSON.parse(data);
    }

    await AsyncStorage.setItem(appSettingsStorageKey, JSON.stringify(defaultAppSettingsData));

    return defaultAppSettingsData;
  } catch (error) {
    console.error(`Could not recover local data. Error: ${error}`);
    return null;
  }
}

/**
 * Updates the app settings object
 */
export async function updateAppSettings(data: AppSettingsInterface): Promise<void> {
  try {
    await AsyncStorage.setItem(appSettingsStorageKey, JSON.stringify(data));
  } catch (error) {
    console.error(`Could not update app settings: ${error}`);
  }
}

/**
 * Gets the derpibooru images array saved to local storage as a "cache"
 */
export async function getFetchedImages(): Promise<DerpiImage[]> {
  let images = [] as DerpiImage[];
  try {
    const data = await AsyncStorage.getItem(fetchedImagesKey);
    if (data) {
      images = JSON.parse(data);
    }
  } catch (error) {
    console.error(`getFetchedImages: Could not recover cached images: ${error}`);
  } finally {
    return images;
  }
}

/**
 * Sets the derpibooru images array cache
 */
export async function setFetchedImages(images: DerpiImage[]): Promise<void> {
  try {
    await AsyncStorage.setItem(fetchedImagesKey, JSON.stringify(images));
  } catch (error) {
    console.error(`Could not set fetched images: ${error}`);
  }
}

export async function getImageQueue(): Promise<DerpiImage[] | null> {
  try {
    const queue = await AsyncStorage.getItem(downloadsQueueKey);

    if (!queue) return [];

    return JSON.parse(queue);
  } catch (error) {
    console.log(`getImageQueue: Could not recover the image queue: ${error}`);
    return null;
  }
}

export async function toggleImageInQueue(image: DerpiImage): Promise<DerpiImage[] | null> {
  try {
    const queueStorage = await AsyncStorage.getItem(downloadsQueueKey);

    if (!queueStorage) {
      await AsyncStorage.setItem(downloadsQueueKey, JSON.stringify([image]));
      return [image];
    }

    let queue = JSON.parse(queueStorage) as DerpiImage[];

    if (queue.findIndex((item) => item.id === image.id) > -1) {
      console.log(`Removed image ${image.id} from queue`);
      queue = queue.filter((item) => item.id !== image.id);
    } else {
      console.log(`Added image ${image.id} to queue`);
      queue.push(image);
    }

    AsyncStorage.setItem(downloadsQueueKey, JSON.stringify(queue));
    return queue;
  } catch (error) {
    console.error(`toggleImageInQueue: Could not toggle image in queue: ${error}`);
    return null;
  }
}

export async function searchImageInQueue(image: DerpiImage): Promise<DerpiImage | undefined> {
  try {
    const queue = await getImageQueue();

    if (queue) {
      return queue.find((queueImage) => queueImage.id === image.id);
    }
  } catch (error) {
    console.error(`Could not search image in queue: ${error}`);
  }
}

export async function clearImageQueue(): Promise<void> {
  try {
    await AsyncStorage.setItem(downloadsQueueKey, JSON.stringify([]));
    console.log('clearImageQueue: Queue cleared');
  } catch (error) {
    console.error(`clearImageQueue: Could not clear the queue: ${error}`);
  }
}
