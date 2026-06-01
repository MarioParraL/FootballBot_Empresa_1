import { ObjectId } from "mongodb";

export type Article = {
  id: string;
  title: string;
  url: string;
  summary: string;
  date: string;
  category: string;
};

export type ArticleDB = {
  _id?: ObjectId;
  title: string;
  url: string;
  summary: string;
  date: string;
  category: string;
};
