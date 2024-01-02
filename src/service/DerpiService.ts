import axios, { AxiosResponse } from 'axios';
import { DerpiImage, DerpiImagesResponse } from '../interfaces/DerpibooruData';
import { getAppSettings, updateAppSettings } from '../utils/LocalStorageHelper';

/**
 * Transforms the array of tags into an URI encoded query string
 */
function buildQuery(tags: string[]): string {
  return encodeURIComponent(tags.join(','));
}

/**
 * Get the download list containing images until the last downloaded image
 * @returns
 */
export default async function getDownloadList(): Promise<DerpiImage[] | void> {
  try {
    console.log('Recovering Derpi Image list.');
    const settings = await getAppSettings();

    if (!settings) {
      throw new Error('Settings was null');
    }

    let page = 1;
    let hasNext = true;
    let endpoint = null;
    let data = null;
    let downloadList = [] as DerpiImage[];
    let returnList = [] as DerpiImage[];
    let query = buildQuery(settings.tags);

    while (hasNext) {
      endpoint = `https://derpibooru.org/api/v1/json/search/images?q=${query}&page=${page}&per_page=50&filter_id=${settings.filterId}`;
      console.log(`Fetching images from ${endpoint}`);
      data = await axios.get(endpoint).then((response: AxiosResponse<DerpiImagesResponse>) => response.data);

      // spread the download list
      downloadList = [...downloadList, ...data.images];

      page += 1;

      // checks if there's need to grab more images on the list
      if (settings.lastImage) {
        // checks if every image on the response array has a bigger id than the last downloaded image,
        //  If not, it means that there's more images to be downloaded.
        if (!data.images.every((i) => settings.lastImage && i.id > settings.lastImage)) {
          hasNext = false;
        }
      }
    }

    console.log('Returning download list by last image.');
    returnList = downloadList.filter((i) => settings.lastImage && i.id >= settings.lastImage && !i.hidden_from_users);

    returnList.sort((a, b) => {
      if (a.id > b.id) {
        return 1;
      }
      if (a.id < b.id) {
        return -1;
      }
      return 0;
    });

    console.log('Updating app settings with last id and last fetch');
    settings.lastFetch = Date.now();
    settings.lastImage = returnList[returnList.length - 1].id;
    await updateAppSettings(settings);

    console.log(`Returning ${returnList.length} items from the download list.`);
    return returnList;
  } catch (error) {
    console.error('Could not recover download list');
  }
}
