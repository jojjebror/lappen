export const APP_NAME = 'Lappen';
export const THEME_COLOR = '#f7f5f0';

export const COLLECTIONS = {
	lists: 'lists',
	items: 'items',
	history: 'history'
} as const;

export const ROUTES = {
	home: '/',
	list: (id: string) => `/list/${id}`
} as const;

export const SPA_FALLBACK = 'index.html';
export const MAX_SUGGESTIONS = 5;
export const DEFAULT_LIST_NAME = 'Shopping';
