export const LIST_PARAM = 'listId'

export const paths = {
  home: '/',
  list: (id: string) => `/list/${id}`,
}

export const routePatterns = {
  list: `/list/:${LIST_PARAM}`,
}

export const LABELS = {
  newList: 'New list',
  create: 'Create',
  back: 'Lists',
  share: 'Share',
  addItem: 'Add item',
  clearChecked: 'Clear crossed off',
  notFound: 'This page does not exist.',
  goHome: 'Go to your lists',
  noLists: 'No lists yet. Create one and share it with whoever you shop with.',
}
