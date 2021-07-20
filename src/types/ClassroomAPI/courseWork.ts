/* eslint-disable */
export type CourseWork = {
  courseId?: string;
  id?: string;
  title?: string;
  description?: string;
  materials?: Array<any>;
  state?: CourseWorkState;
  alternateLink?: string;
  creationTime?: string;
  updateTime?: string;
  dueDate?: string;
  dueTime?: string;
  scheduledTime?: string;
  maxPoints?: number;
  workType?: string;
  associatedWithDeveloper?: boolean;
  assigneeMode?: string;
  individualStudentsOptions?: any;
  submissionModificationMode?: string;
  creatorUserId?: string;
  topicId?: string;
  assignment?: any;
  multipleChoiceQuestion?: any;
};

export enum CourseWorkState {
  published = "PUBLISHED",
  draft = "DRAFT",
  deleted = "DELETED",
}
