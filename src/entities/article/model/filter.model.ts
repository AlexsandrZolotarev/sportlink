export interface SportType {
  id: string;
  name: string;
  count: number;
}

export interface Tag {
  id: string;
  name: string;
  count: number;
}

export interface ActiveFilters {
  search: string;
  sport: string;
  tags: string[];
}
