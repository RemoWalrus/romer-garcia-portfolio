alter table public.reverb_gallery add column if not exists alt_text text;

update public.metadata
set meta_value = replace(meta_value, 'https://romer-garcia-portfolio.lovable.app', 'https://romergarcia.com')
where meta_value like '%romer-garcia-portfolio.lovable.app%';

-- Descriptive alt text derived from each asset's caption and tagged characters.
with named as (
  select g.id,
         g.caption,
         (
           select string_agg(initcap(c), ', ' order by c)
           from unnest(g.character_ids) as c
         ) as who
  from public.reverb_gallery g
)
update public.reverb_gallery g
set alt_text = coalesce(
  nullif(trim(
    coalesce(n.who, 'The Reverb Collective') ||
    case when n.caption is not null and n.caption <> ''
      then ' — ' || n.caption else '' end ||
    ' — artwork from Reverb, a multimedia franchise in the Paradoxxia universe.'
  ), ''),
  'Reverb Collective artwork from the Paradoxxia universe.'
)
from named n
where n.id = g.id and (g.alt_text is null or g.alt_text = '');