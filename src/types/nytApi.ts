export interface NYTMultimedia {
  rank: number;
  subtype: string;
  caption: string | null;
  credit: string | null;
  type: string;
  url: string;
  height: number;
  width: number;
  legacy?: {
    xlarge?: string;
    xlargewidth?: number;
    xlargeheight?: number;
    thumbnail?: string;
    thumbnailwidth?: number;
    thumbnailheight?: number;
    widewidth?: number;
    wideheight?: number;
    wide?: string;
  };
  subType?: string;
  crop_name?: string;
}

export interface NYTHeadline {
  main: string;
  kicker: string | null;
  content_kicker: string | null;
  print_headline: string | null;
  name: string | null;
  seo: string | null;
  sub: string | null;
}

export interface NYTKeyword {
  name: string;
  value: string;
  rank: number;
  major: string;
}

export interface NYTByline {
  original: string;
  person?: {
    firstname: string;
    middlename: string | null;
    lastname: string;
    qualifier: string | null;
    title: string | null;
    role: string;
    organization: string;
    rank: number;
  }[];
  organization: string | null;
}

export interface NYTDoc {
  abstract: string;
  web_url: string;
  snippet: string;
  lead_paragraph: string;
  print_section: string | null;
  print_page: string | null;
  source: string;
  multimedia: NYTMultimedia[];
  headline: NYTHeadline;
  keywords: NYTKeyword[];
  pub_date: string;
  document_type: string;
  news_desk: string;
  section_name: string;
  subsection_name: string | null;
  byline: NYTByline;
  type_of_material: string;
  _id: string;
  word_count: number;
  uri: string;
}

export interface NYTMeta {
  hits: number;
  offset: number;
  time: number;
}

export interface NYTResponse {
  docs: NYTDoc[];
  meta: NYTMeta;
}

export interface NYTApiResponse {
  status: string;
  copyright: string;
  response: NYTResponse;
}
