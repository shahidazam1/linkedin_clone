export interface UploadToS3Props {
  file: Express.Multer.File;
  key: string;
  type?: string;
  subType?: string;
  typeId?: string;
}
