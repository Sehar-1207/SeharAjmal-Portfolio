export interface Certificate {
  id: string; // Transformed from MongoDB's _id on the server
  title: string;
  issuer: string;
  date: string;
  description?: string;
  image_url: string;
}

export interface ICertificateInput {
  title: string;
  issuer: string;
  date: string;
  description?: string;
  image_url: string;
}