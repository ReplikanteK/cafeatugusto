export interface GuidePoint { title: string; detail: string; }
export interface GuideTableData { headers: string[]; rows: string[][]; }
export interface Guide {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  readingTime: string;
  targetMetric: string;
  table: GuideTableData;
  keyTakeaways: GuidePoint[];
}
