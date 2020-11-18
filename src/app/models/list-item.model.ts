export class ListItem {
    item: string;
    isFinished: boolean;
  
    constructor(item: string) {
      this.item = item;
      this.isFinished = false;
    }
  }