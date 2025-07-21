export type BlogPost = {
  _id: string;
  title: string;
  content: string;
  author?: { _id: string; username: string; email: string } | null; // Make author optional
  createdAt: string;
};

export type User = {
  _id: string;
  username: string;
  email: string;
};