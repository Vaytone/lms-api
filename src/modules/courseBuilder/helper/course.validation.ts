import * as yup from 'yup';
import { CreateCourseDTO } from '../dto/create-course.dto';
import {
  BuilderBlockTypeEnum,
  CommentCourseItem,
  CourseItem,
  FileCourseItem,
  HeadingCourseItem,
  ImageCourseItem,
  TextCourseItem,
} from '../types/coureBuilder.types';
import { convert } from 'html-to-text';

export const COURSE_VALIDATION = {
  minTitle: 5,
  maxTitle: 100,
  minDescription: 50,
  maxDescription: 800,
  maxBlockTitle: 150,
};

export const BUILDER_ITEM_VALIDATION = {
  minHeading: 1,
  maxHeading: 150,
  minText: 1,
  maxText: 5000,
  minComment: 1,
  maxComment: 300,
  minAuthor: 1,
  maxAuthor: 100,
  maxImageDescription: 200,
  maxFileDescription: 200,
};

export const courseBaseSchema = yup.object({
  title: yup.string().required().min(COURSE_VALIDATION.minTitle).max(COURSE_VALIDATION.maxTitle),
  description: yup.string().required().min(COURSE_VALIDATION.minDescription).max(COURSE_VALIDATION.maxDescription),
});

export const headingContentSchema = yup.object({
  text: yup.string().required().min(BUILDER_ITEM_VALIDATION.minHeading).max(BUILDER_ITEM_VALIDATION.maxHeading),
});

export const commentContentSchema = yup.object({
  text: yup.string().required().min(BUILDER_ITEM_VALIDATION.minComment).max(BUILDER_ITEM_VALIDATION.maxComment),
  author: yup.string().max(BUILDER_ITEM_VALIDATION.maxAuthor),
});

export const fileContentSchema = yup.object({
  fileId: yup.string().required(),
});

export const imageContentSchema = yup.object({
  fileId: yup.string().required(),
  description: yup.string().optional().max(BUILDER_ITEM_VALIDATION.maxImageDescription),
});

export const textContentSchema = yup.object({
  text: yup.string().required(),
  clearText: yup.string().required().min(BUILDER_ITEM_VALIDATION.minText).max(BUILDER_ITEM_VALIDATION.maxText),
});

export const courseBlockSchema = yup.object({
  title: yup.string().optional().max(COURSE_VALIDATION.maxBlockTitle),
});

const validateMainInfo = async (data: { title: string; description: string }) => {
  try {
    await courseBaseSchema.validate(data);
    return true;
  } catch {
    return false;
  }
};

const validateHeadingBlock = async (data: HeadingCourseItem) => {
  try {
    await headingContentSchema.validate(data.data);
    return true;
  } catch {
    return false;
  }
};

const validateCommentBlock = async (data: CommentCourseItem) => {
  try {
    await commentContentSchema.validate(data.data);
    return true;
  } catch {
    return false;
  }
};

const validateFileBlock = async (data: FileCourseItem) => {
  try {
    await fileContentSchema.validate(data.data);
    return true;
  } catch {
    return false;
  }
};

const validateImageBlock = async (data: ImageCourseItem) => {
  try {
    await imageContentSchema.validate(data.data);
    return true;
  } catch {
    return false;
  }
};

const validateTextBlock = async (data: TextCourseItem) => {
  try {
    await textContentSchema.validate({
      ...data.data,
      clearText: convert(data.data.text)
        .replace(/[\n\r\t]/gm, '')
        .trim(),
    });
    return true;
  } catch (e) {
    return false;
  }
};

const validateCourseItem = async (data: CourseItem) => {
  switch (data.data.type) {
    case BuilderBlockTypeEnum.Heading:
      return validateHeadingBlock(data as HeadingCourseItem);
    case BuilderBlockTypeEnum.Comment:
      return validateCommentBlock(data as CommentCourseItem);
    case BuilderBlockTypeEnum.File:
      return validateFileBlock(data as FileCourseItem);
    case BuilderBlockTypeEnum.Image:
      return validateImageBlock(data as ImageCourseItem);
    case BuilderBlockTypeEnum.Text:
      return validateTextBlock(data as TextCourseItem);
    default:
      return true;
  }
};

const validateCourseBlock = async (data: { title: string }) => {
  try {
    await courseBlockSchema.validate(data);
    return true;
  } catch {
    return false;
  }
};

export const validateCourseForm = async (data: CreateCourseDTO) => {
  const isMainVaid = await validateMainInfo(data.main);
  const itemValidationResults = await Promise.all(
    data.items.map(async (item) => {
      return validateCourseItem(item);
    }),
  );

  const blockValidationResults = await Promise.all(
    Object.values(data.blocksInfo).map(async (item) => {
      return validateCourseBlock(item);
    }),
  );

  return isMainVaid && !blockValidationResults.includes(false) && !itemValidationResults.includes(false);
};
