export interface Content {
  id?: number;
  title: string;
  istemplate: boolean;
  isfeatured: boolean;
  content_html: string;
  content_txt: string;
  content_summary: string;
  file: any;
  fileContentType: string;
  content_metadata?: string;
  processing_metadata?: string;
  processing_status?: any;
  embedding_status?: any;
  embedding_metadata?: string;
  description: string;
  url: string;
  authors: string;
  datepublished: number;
  poststartdatetime: number;
  postenddatetime: number;
  preview_image_small: any;
  preview_image_smallContentType: string;
  preview_image_medium: any;
  preview_image_mediumContentType: string;
  preview_image_large: any;
  preview_image_largeContentType: string;
  content_contentclass?: any;
  content_community?: any;
  content_parent?: any;
  content_contentpoststatus?: any;
  content_contentstatus?: any;
  content_forum?: any;
  content_project?: any;
  content_poststarttimezone_timezone?: any;
  content_postendtimezone_timezone?: any;
  status: string;
  createdby: string;
  createddatetime: number;
  lastmodifiedby: string;
  lastmodifieddatetime: number;
  domain?: any;
}
