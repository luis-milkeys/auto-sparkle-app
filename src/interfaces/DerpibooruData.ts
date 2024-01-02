export interface DerpiImage {
  comment_count: number;
  tag_count: number;
  created_at: string;
  width: number;
  sha512_hash: string;
  height: number;
  first_seen_at: string;
  id: number;
  tags: string[];
  view_url: string;
  wilson_score: number;
  format: string;
  description: string;
  tag_ids: number[];
  mime_type: string;
  spoilered: boolean;
  uploader_id: number;
  name: string;
  updated_at: string;
  representations: {
    full: string;
    large: string;
    medium: string;
    small: string;
    tall: string;
    thumb: string;
    thumb_small: string;
    thumb_tiny: string;
  };
  intensities: { ne: number; nw: number; se: number; sw: number };
  thumbnails_generated: boolean;
  uploader: string;
  aspect_ratio: number;
  animated: boolean;
  faves: number;
  upvotes: number;
  size: number;
  score: number;
  duration: number;
  deletion_reason: null | string;
  downvotes: number;
  orig_sha512_hash: string;
  processed: boolean;
  hidden_from_users: boolean;
  duplicate_of: null | number;
  source_url: string;
}

export interface DerpiImagesResponse {
  images: DerpiImage[];
  interactions: any[];
  total: number;
}
