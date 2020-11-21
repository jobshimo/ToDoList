import { ListItem } from "./list-item.model";

export interface List {
  id: string;
  title: string;
  createdDate: Date;
  isFinished: boolean;
  items: ListItem[];
  owner:string;
  finishedData:Date;
 }

export const newList:List = {
  id: null,
  title:'',
  createdDate: new Date(),
  isFinished: false,
  items: [],
  owner: null,
  finishedData: null
}

