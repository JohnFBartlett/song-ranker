import { Song } from "../data/models/song";

export const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const filterSongsByName = (list: Array<Song>) => {
  const comparisonSet = new Set()
  const newList = []

  for (const item of list) {
    if (!comparisonSet.has(item.name)) {
      newList.push(item);
      comparisonSet.add(item.name);
    }
  }

  return newList;
}