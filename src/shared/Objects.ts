export interface IVersionList {
  value: IVersionListItem[]
}

export interface IVersionListItem {
  Title: string;
  SingleID: string;
  Created: Date;
  VersionName: string;
  AttachmentFiles: IAttachmentFile[];
}

export interface IAttachmentFile {
  ServerRelativeUrl: string;
}

export interface ISingleList {
  value: ISingleListItem[]
}

export interface ISingleListItem {
  Title: string;
  SingleTitle: string;
  AuthorID: string;
  Created: Date;
  Description: string;
  CollectionID: string;
}

export interface ICollectionList {
  value: ICollectionListItem[]
}

export interface ICollectionListItem {
  Title: string;
  CollectionTitle: string;
  OwnerID: string;
}

export interface ITriggerList {
  value: ITriggerListItem[]
}

export interface ITriggerListItem {
  Title: string;
  Trigger: string;
  Triggerdescription: string;
}

export interface IGenreList {
  value: IGenreListItem[]
}

export interface IGenreListItem {
  ID: string;
  Title: string;
  Genre: string;
  GenreDescription: string;
}
export interface ITagList {
  value: ITagListItem[]
}

export interface ITagListItem {
  Title: string;
  Tag: string;
  Tagdescription: string;
}

export interface IWritingList {
  value: IWritingListItem[]
}

export interface IWritingListItem {
  Title: string;
  Writingtitle: string;
  Owner: string;
  WorkType: string; //Collection or single
  Visibility: string;
  Writingtype: string; // Poetry, non-fiction, Script, fiction or other
  Writingstate: string; //finished, in review, rough draft
  Description: string;

  FirstPosted: Date;
  LastUpdated: Date;

  Views: number;
  FeedbackReceived: number;

  Triggers: string;
  Genres: string;
  Tags: string;
  Reference: string; //Collections-> singlesID & Singles -> versionID
}

export interface IIDListItem {
  Title: string;
  ID: number;
}

export interface IIDList {
  value: IIDListItem[]
}

export interface ICommentList {
  value: ICommentListItem[]
}

export interface ICommentListItem {
  Title: string;
  Comment: string;
  Created: string;
  UserID: string;
}

export interface IQuestionList {
  value: IQuestionListItem[]
}

export interface IQuestionListItem {
  Title: string;
  Question: string;
}

export interface IAnswerList {
  value: IAnswerListItem[]
}

export interface IAnswerListItem {
  Title: string;
  QuestionID: string;
  Answer: string;
  UserID: string;
}

export interface IFormalList {
  value: IFormalListItem[]
}

export interface IFormalListItem {
  Title: string;
  FormalType: string;
  Content: string;
  FeedbackerID: string;
  created: string;
}

export interface IFeedbackSettingsList {
  value: IFeedbackSettingsListItem[]
}
export interface IFeedbackSettingsListItem {
  Title: string;
  AllowAllFeedback: boolean;
  AllowVisibleFeedback: boolean;
  AllowComments: boolean;
  AllowFormalFeedback: boolean;
  AllowQuestions: boolean;
  AllowInline: boolean;
  VersionID: string;
}