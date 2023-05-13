import { TestHistory, User } from '../entities';

export type UserId = User['id'];
export type TestHistoryId = TestHistory['id'];
export type EmptyObject = Record<string, never>;
