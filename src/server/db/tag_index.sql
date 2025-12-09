CREATE INDEX tag_idx on used_tags
USING bm25 (tag,count)
WITH (
  key_field='tag',
  text_fields='{"_pg_search_0":{"tokenizer":{"type":"ngram"}}}'
);
