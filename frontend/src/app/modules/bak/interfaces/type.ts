type Producer = {
  id: string;
  name: string;
  created_at: Date;
};
type Type = {
  id: string;
  name: string;
  created_at: Date;
};

export interface Product {
  id: string;
  name: string;
  article_number?: string;

  created_at: Date;

  type: Type;
  producer: Producer;
}
