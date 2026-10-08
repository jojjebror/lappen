import type { Theme } from './app.ts'

export const LIST_PARAM = 'listId'

export const paths = {
  home: '/',
  list: (id: string) => `/list/${id}`,
  often: '/often',
  settings: '/settings',
}

export const routePatterns = {
  list: `list/:${LIST_PARAM}`,
  often: 'often',
  settings: 'settings',
}

export const ICON_SIZE = 18
export const NAV_ICON_SIZE = 22
export const SMALL_ICON_SIZE = 14
export const LOGO_SIZES = { wordmark: 36 }
export const HAPTIC_VIBRATE_MS = 10
export const UNDO_MS = 4000
export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'
export const MOTION = { easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' }
export const SPLASH = { id: 'splash', showMs: 2000, fadeMs: 300, logoPx: 112 }

export const NAV_LABELS = { main: 'Huvudmeny', lists: 'Listor', often: 'Ofta köpt', settings: 'Inställningar' }
export const THEME_TOGGLE_LABELS: Record<Theme, string> = { light: 'Byt till mörkt läge', dark: 'Byt till ljust läge' }
export const THEME_LABELS: Record<Theme, string> = { light: 'Ljust', dark: 'Mörkt' }

export const LABELS = {
  yourLists: 'Era listor',
  newList: 'Ny lista',
  create: 'Skapa',
  back: 'Listor',
  share: 'Dela listan',
  addItem: 'Lägg till vara',
  add: 'Lägg till',
  clearChecked: 'Rensa avbockade',
  undo: 'Ångra',
  checked: (name: string) => `${name} i korgen`,
  notFound: 'Sidan finns inte.',
  goHome: 'Till era listor',
  noLists: 'Inga listor än. Skapa en och dela den med den du handlar med.',
  oftenHint: (list: string) => `Det ni lägger till oftast. Tryck på plus för att lägga till på ${list}.`,
  oftenEmpty: 'Här hamnar det ni lägger till ofta. Börja med att skapa en lista.',
  oftenAdd: (name: string) => `Lägg till ${name}`,
  appearance: 'Utseende',
  about: 'Om Lappen',
}
