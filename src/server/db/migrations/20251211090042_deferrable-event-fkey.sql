-- Custom SQL migration file, put your code below! --
ALTER TABLE user_metadata_to_events ALTER CONSTRAINT user_metadata_to_events_event_id_events_id_fk
DEFERRABLE INITIALLY DEFERRED;
