import { AllTags } from '@/systems/dashboard/AllTags';
import { TagPill } from '@/systems/dashboard/TagPill';
type Tag = {
    tag : string;
    count: number;
    id: number;
}

type TagListProps ={
    tags: Tag[];
    allTags: Tag[];

}
export const TagList = ({tags, allTags}: TagListProps) => {
    return (
        <div className="pointer-events-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-x-2 gap-y-2 text-white">
                        {tags.map((tag) => (
                          <TagPill
                            name={tag.tag}
                            count={tag.count}
                            key={tag.tag}
                            className="drop-shadow-[0_0_4px_rgb(0_0_0_/_0.4)]"
                          />
                        ))}
                        <AllTags options={allTags} />
                      </div>
    )
}