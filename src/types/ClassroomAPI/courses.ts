/* eslint-disable */
export enum CourseState {
  active = "ACTIVE",
  archived = "ARCHIVED",
  provisioned = "PROVISIONED",
  declined = "DECLINED",
  suspended = "SUSPENDED",
}
export type Course = {
  id?: string;
  name?: string;
  section?: string;
  descriptionHeading?: string;
  description?: string;
  room?: string;
  ownerId?: string;
  creationTime?: string;
  updateTime?: string;
  enrollmentCode?: string;
  courseState?: CourseState;
  alternateLink?: string;
  teacherGroupEmail?: string;
  courseGroupEmail?: string;
  teacherFolder?: any;
  courseMaterialSets?: any;
  guardiansEnabled?: boolean;
  calendarId?: string;
};
