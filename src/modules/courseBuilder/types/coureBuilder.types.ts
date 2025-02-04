export enum BuilderTemplateIDSEnum {
  Heading = 'headingTemplate',
  Text = 'textTemplate',
  Comment = 'commentTemplate',
  Image = 'imageTemplate',
  Divider = 'dividerTemplate',
  File = 'fileTemplate',
}

export enum BuilderBlockTypeEnum {
  Text = 'text',
  Heading = 'heading',
  Comment = 'comment',
  Divider = 'divider',
  Image = 'image',
  File = 'file',
}

export interface BuilderTemplate {
  id: BuilderTemplateIDSEnum;
  name: string;
}

export interface BaseCourseItem {
  id: string;
}

export interface HeadingCourseItem extends BaseCourseItem {
  data: {
    type: BuilderBlockTypeEnum.Heading;
    text: string;
  };
}

export interface DividerCourseItem extends BaseCourseItem {
  data: {
    type: BuilderBlockTypeEnum.Divider;
  };
}

export interface TextCourseItem extends BaseCourseItem {
  data: {
    type: BuilderBlockTypeEnum.Text;
    text: string;
  };
}

export interface ImageCourseItem extends BaseCourseItem {
  data: {
    type: BuilderBlockTypeEnum.Image;
    fileId: string;
    description: string;
  };
}

export interface CommentCourseItem extends BaseCourseItem {
  data: {
    type: BuilderBlockTypeEnum.Comment;
    text: string;
    author: string;
  };
}

export interface FileCourseItem extends BaseCourseItem {
  data: {
    type: BuilderBlockTypeEnum.File;
    fileId: string;
  };
}

export type CourseItem =
  | HeadingCourseItem
  | TextCourseItem
  | CommentCourseItem
  | ImageCourseItem
  | DividerCourseItem
  | FileCourseItem;
