import { Answer, Question } from '../../entities';

export type AnswersToTestDto = Record<Question['id'], { answer: string } | { answerId: Answer['id'] }>;
