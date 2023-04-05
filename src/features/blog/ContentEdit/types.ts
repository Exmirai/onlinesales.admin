import { ImageData } from "@components/FileDropdown";

export interface ContentDetails {
  id: string | null;
  type: string;
  title: string;
  description: string;
  body: string;
  coverImageUrl: string;
  coverImagePending: ImageData;
  coverImageAlt: string;
  slug: string;
  author: string;
  language: string;
  allowComments: boolean;
  tags: string[];
  categories: string[];
  createdAt: string | null;
  updatedAt: string | null;
  files: File[] | null;
}

export interface TypeDefaultValues {
  type: string;
  defaultValues: ContentDetails;
}

export interface ContentEditorAutoSave {
  id: string;
  savedData: ContentDetails;
  latestAutoSave: Date;
}

export interface ContentEditData {
  data: ContentEditorAutoSave[];
}

export enum ContentEditRestoreState {
  Idle = 1,
  Requested,
  Rejected,
  Accepted,
}
