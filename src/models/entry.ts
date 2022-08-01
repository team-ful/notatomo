import {DefaultObject} from '../db/operator';

export interface EntryModel {
  id: number;

  // 作成者
  owner_user_id: number;

  title: string;

  // shopのID
  shop_id: number;

  // 基本1
  number_of_people: number;

  date: Date;

  body: string;

  is_closed: boolean;
}

class Entry implements EntryModel {
  readonly id: number;
  readonly owner_user_id: number;
  readonly title: string;
  readonly shop_id: number;
  readonly number_of_people: number;
  readonly date: Date;
  readonly body: string;
  readonly is_closed: boolean;

  constructor(init: DefaultObject | EntryModel) {
    this.id = init.id as number;
    this.owner_user_id = init.owner_user_id as number;
    this.title = init.title as string;
    this.shop_id = init.shop_id as number;
    this.number_of_people = init.number_of_people as number;
    this.date = new Date(init.date as Date | string);
    this.body = init.body as string;
    this.is_closed = Boolean(init.is_closed);
  }
}

export default Entry;
