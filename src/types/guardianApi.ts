export interface GuardianFields {
  trailText: string;
  byline: string;
  thumbnail: string;
}

export interface GuardianResult {
  id: string;
  type: string;
  sectionId: string;
  sectionName: string;
  webPublicationDate: string;
  webTitle: string;
  webUrl: string;
  apiUrl: string;
  fields: GuardianFields;
  isHosted: boolean;
  pillarId: string;
  pillarName: string;
}

export interface GuardianResponse {
  status: string;
  userTier: string;
  total: number;
  startIndex: number;
  pageSize: number;
  currentPage: number;
  pages: number;
  orderBy: string;
  results: GuardianResult[];
}

export interface GuardianApiResponse {
  response: GuardianResponse;
}
