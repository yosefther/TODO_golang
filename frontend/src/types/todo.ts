// These names and the numeric completion flag match the Go model's JSON.
export interface Todo {
  Id: number;
  Item: string;
  Completed: 0 | 1;
}

export interface AddTodoRequest {
  Item: string;
}

export interface MutationResponse {
  message: string;
}
