import { ListItem } from "./list-item.model";

export interface List {
  id: string;
  title: string;
  createdDate: Date;
  isFinished: boolean;
  items: ListItem[];
  owner:string;
 }

export const newList:List = {
  id: null,
  title:'',
  createdDate: new Date(),
  isFinished: false,
  items: [],
  owner: null
}

