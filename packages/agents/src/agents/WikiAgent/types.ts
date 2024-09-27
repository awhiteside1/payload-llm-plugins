type Latest = {
  id: number;
  timestamp: string; // ISO date string
};

type License = {
  url: string;
  title: string;
};

type PageDetail = {
  id: number;
  key: string;
  title: string;
  latest: Latest;
  content_model: string;
  license: License;
  source: string;
};


type Thumbnail = {
  mimetype: string;
  size: number | null;
  width: number;
  height: number;
  duration: number | null;
  url: string;
};

type Page = {
  id: number;
  key: string;
  title: string;
  excerpt: string;
  matched_title: string | null;
  description: string;
  thumbnail: Thumbnail;
};

type Result = {
  pages: Array<Page>;
};


export type {Result, PageDetail}