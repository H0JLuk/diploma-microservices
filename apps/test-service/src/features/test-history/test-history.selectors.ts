export const getTestFieldsForStudent = {
  id: true,
  name: true,
  isRandomAnswers: true,
  duration: true,
  subject: true,
  startTime: true,
  endTime: true,
  hidden: true,
  subjectId: true,
  creatorId: true,
  questions: {
    select: {
      id: true,
      category: true,
      text: true,
      type: true,
      image: true,
      categoryId: true,
      answers: {
        select: {
          id: true,
          image: true,
          text: true,
          isRight: false,
          questionId: true,
        },
      },
    },
  },
} as const;
