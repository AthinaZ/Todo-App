import { IsNotEmpty } from 'class-validator';

export class UpdateTodoDto {
  todo: string;
  completed: boolean;
  category: {
    color: string;
    label: string;
  };

  @IsNotEmpty()
  priority: number;
}
