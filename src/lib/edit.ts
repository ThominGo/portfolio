// Visual Editor Directus : attributs data-directus posés uniquement en mode aperçu (npm run preview:cms).
// En production (site statique public) la fonction renvoie un objet vide : aucun attribut dans le HTML.
export const EDITING = import.meta.env.PUBLIC_VISUAL_EDITING === 'true';

export function attr(collection: string, id: number | undefined, fields: string, mode: 'popover' | 'drawer' | 'modal' = 'popover') {
  if (!EDITING || !id) return {};
  return { 'data-directus': `collection:${collection};item:${id};fields:${fields};mode:${mode}` };
}
