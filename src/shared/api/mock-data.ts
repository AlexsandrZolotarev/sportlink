export interface RawAuthor { id: number; name: string; avatar: string; }
export interface RawStats  { likes: number; comments: number; views: number; }

export interface RawArticle {
  id: number;
  author: RawAuthor;
  publishedAt: string;
  images: string[];
  sport: string;
  sportName: string;
  tags: string[];
  title: string;
  description: string;
  stats: RawStats;
  liked: boolean;
  commentsOpen: boolean;
}

export interface RawSport { id: string; name: string; count: number; }
export interface RawTag   { id: string; name: string; count: number; }

export const MOCK_SPORTS: RawSport[] = [
  { id: 'all',        name: '\u0412\u0441\u0435',         count: 56 },
  { id: 'hockey',     name: '\u0425\u043e\u043a\u043a\u0435\u0439',    count: 23 },
  { id: 'football',   name: '\u0424\u0443\u0442\u0431\u043e\u043b',   count: 67 },
  { id: 'basketball', name: '\u0411\u0430\u0441\u043a\u0435\u0442\u0431\u043e\u043b', count: 14 },
  { id: 'swimming',   name: '\u041f\u043b\u0430\u0432\u0430\u043d\u0438\u0435',   count: 8  },
];

export const MOCK_TAGS: RawTag[] = [
  { id: 'training',   name: '\u0422\u0440\u0435\u043d\u0438\u0440\u043e\u0432\u043a\u0430',    count: 23 },
  { id: 'competition',name: '\u0421\u043e\u0440\u0435\u0432\u043d\u043e\u0432\u0430\u043d\u0438\u0435', count: 18 },
  { id: 'youth',      name: '\u042e\u043d\u0438\u043e\u0440\u044b',     count: 11 },
  { id: 'equipment',  name: '\u042d\u043a\u0438\u043f\u0438\u0440\u043e\u0432\u043a\u0430',  count: 7  },
  { id: 'nutrition',  name: '\u041f\u0438\u0442\u0430\u043d\u0438\u0435',   count: 5  },
];

const DESC  = '\u041c\u044b, \u043a\u043e\u043c\u0430\u043d\u0434\u0430 \u041d\u0425\u041b-\u0446\u0435\u043d\u0442\u0440, \u2014 \u043f\u0440\u043e\u0444\u0435\u0441\u0441\u0438\u043e\u043d\u0430\u043b\u044b \u0441 \u0431\u043e\u043b\u044c\u0448\u0438\u043c \u0442\u0440\u0435\u043d\u0435\u0440\u0441\u043a\u0438\u043c \u043e\u043f\u044b\u0442\u043e\u043c.';
const TITLE = '\u0417\u0430\u0433\u043e\u043b\u043e\u0432\u043e\u043a\u0417\u0430\u0433\u043e\u043b\u043e\u0432\u043e\u043a \u0417\u0430\u0433\u043e\u043b\u043e\u0432\u043e\u043a\u0417\u0430\u0433\u043e \u043b\u043e\u0432\u043e\u043a';

const HOCKEY_IMGS = [
  'https://images.unsplash.com/photo-1580748141549-71748dbe0bdc?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1515703407324-5f753afd8be8?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=600&h=400&fit=crop',
];

const FOOTBALL_IMGS = [
  'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=600&h=400&fit=crop',
];

const BASKETBALL_IMGS = [
  'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&h=400&fit=crop',
];

function buildArticles(): RawArticle[] {
  const articles: RawArticle[] = [];
  for (let i = 1; i <= 24; i++) {
    const mod = i % 3;
    const isHockey = mod !== 0;
    const sport = isHockey ? 'hockey' : (i % 6 === 0 ? 'basketball' : 'football');
    const sportNames: Record<string, string> = {
      hockey: '\u0425\u043e\u043a\u043a\u0435\u0439', football: '\u0424\u0443\u0442\u0431\u043e\u043b', basketball: '\u0411\u0430\u0441\u043a\u0435\u0442\u0431\u043e\u043b',
    };
    const imgMap: Record<string, string[]> = {
      hockey: HOCKEY_IMGS, football: FOOTBALL_IMGS, basketball: BASKETBALL_IMGS,
    };
    const tags = i % 5 === 0 ? ['training', 'youth'] : i % 2 === 0 ? ['training'] : ['competition'];
    articles.push({
      id: i,
      author: { id: 1, name: 'SportClick', avatar: '' },
      publishedAt: '2024-08-20T16:50:00.000Z',
      images: imgMap[sport],
      sport,
      sportName: sportNames[sport],
      tags,
      title: TITLE,
      description: DESC,
      stats: { likes: 321, comments: 5, views: 321 },
      liked: i % 4 === 0,
      commentsOpen: true,
    });
  }
  return articles;
}

export const MOCK_ARTICLES: RawArticle[] = buildArticles();
