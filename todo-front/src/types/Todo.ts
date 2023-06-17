import { IUser } from './User';

export interface ITodo {
  id: number;
  todo: string;
  completed: boolean;
  priority: number;
  createBy: number;
  user: IUser;
  category: {
    color: string;
    label: string;
  };
}
