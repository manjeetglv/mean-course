export class Post {
  _id: string;
  title: string;
  content: string;
  image: File;
  imagePath?: string;
  creator?: string;
  constructor() {}
}
