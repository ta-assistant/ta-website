export type StudentSubmission = {
  courseId: string;
  courseWorkId: string;
  id: string;
  userId: string;
  creationTime: string;
  updateTime: string;
  state: "NEW" | "CREATED" | "TURNED_IN" | "RETURNED" | "RECLAIMED_BY_STUDENT";
  late: boolean;
  draftGrade: number;
  assignedGrade: number;
  alternateLink: string;
  courseWorkType:
    | "ASSIGNMENT"
    | "SHORT_ANSWER_QUESTION"
    | "MULTIPLE_CHOICE_QUESTION";
  associatedWithDeveloper: boolean;
};

export type SubmissionUpdateMask = {
  draftGrade?: number;
  assignedGrade?: number;
};
