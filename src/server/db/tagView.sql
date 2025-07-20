select
    UNNEST(tags) as tag,
    COUNT(tags) as count
from
    club
group by UNNEST(tags)
order by count desc
