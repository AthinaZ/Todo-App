import { ITodo } from './Todo';

export interface IUser {
  id: number;
  username: string;
  password: string;
  name: string;
  todos: ITodo[];
}
