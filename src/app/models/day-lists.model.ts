import { List } from "./list.model";

export interface DayLists {
    day: string;
    lists: List[];
  }
  
  export const newDayLists:DayLists = {
    day: null,
    lists: null
  };
  