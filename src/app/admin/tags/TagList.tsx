'use client';

import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  TextField,
  Tooltip,
} from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import Panel from '@src/components/common/Panel';
import Confirmation from '@src/components/Confirmation';
import { setSnackbar, SnackbarPresets } from '@src/components/global/Snackbar';
import { useTRPC } from '@src/trpc/react';
import { RouterOutputs } from '@src/trpc/shared';

type TagListProps = {
  tags?: RouterOutputs['club']['distinctTags'];
  topTags?: RouterOutputs['club']['topTags'];
};

export default function TagList({ tags: tagsProp, topTags }: TagListProps) {
  const api = useTRPC();

  const tagsQuery = useQuery(
    api.club.distinctTags.queryOptions(undefined, {
      initialData: tagsProp,
      enabled: Boolean(tagsProp),
    }),
  );

  const tags = tagsQuery.data ?? [];

  const changeTags = useMutation(
    api.admin.changeTag.mutationOptions({
      onSettled: () => {
        tagsQuery.refetch();
        setOpenEditDialog(false);
      },
      onSuccess: (data) => {
        setSnackbar(
          SnackbarPresets.savedCustom(
            `Modified the tags for ${data.affected} clubs.`,
          ),
        );
      },
      onError: (error) => {
        setSnackbar(
          SnackbarPresets.errorCustomMessage(
            'An error occurred while updating the tag',
            error.message,
          ),
        );
      },
    }),
  );

  const refreshTags = useMutation(
    api.admin.refreshTags.mutationOptions({
      onSettled: () => {
        tagsQuery.refetch();
        setOpenRegenConfirmation(false);
      },
      onSuccess: () => {
        setSnackbar(SnackbarPresets.savedCustom('Regenerated club tags list!'));
      },
      onError: (error) => {
        setSnackbar(
          SnackbarPresets.errorCustomMessage(
            'An error occurred',
            error.message,
          ),
        );
      },
    }),
  );

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openRegenConfirmation, setOpenRegenConfirmation] = useState(false);

  const [searchTag, setSearchTag] = useState('');

  const [oldTagName, setOldTagName] = useState('');
  const [newTagName, setNewTagName] = useState('');

  const onCloseEditDialog = () => {
    setOpenEditDialog(false);
  };
  const onConfirmDialog = () => {
    changeTags.mutate({ oldTag: oldTagName ?? '', newTag: newTagName });
  };

  const onConfirmConfirmation = () => {
    refreshTags.mutate();
  };

  const willDelete = newTagName === '';
  const willCombine =
    tags.some((tag) => tag.tag === newTagName) && newTagName !== oldTagName;

  const filteredTags = tags.filter((tag) =>
    tag.tag.toLowerCase().includes(searchTag.toLowerCase()),
  );

  const editDialog = (
    <Dialog
      onClose={onCloseEditDialog}
      open={openEditDialog}
      aria-labelledby="rename-dialog-title"
      aria-describedby="rename-dialog-description"
      slotProps={{ paper: { className: 'max-sm:w-full' } }}
    >
      <DialogTitle>Edit {oldTagName}</DialogTitle>
      <DialogContent className="flex flex-col gap-4 pt-2">
        <TextField
          value={newTagName}
          size="small"
          onChange={(e) => {
            setNewTagName(e.target.value);
          }}
          className="w-full sm:min-w-sm"
          placeholder={oldTagName}
          helperText={
            willDelete ? (
              <>
                Remove this tag from all clubs.
                <br />
                This action cannot be undone!
              </>
            ) : willCombine ? (
              <>
                Because this tag already exists, the two tags will be combined.
                <br />
                This action cannot be undone!
              </>
            ) : (
              <>
                New name for tag.
                <br />
                You can copy another tag to combine the two.
              </>
            )
          }
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="clear"
                    onClick={() => {
                      setNewTagName('');
                    }}
                    size="small"
                    edge="end"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onCloseEditDialog}>Cancel</Button>
        <Button
          variant="contained"
          color={willDelete ? 'error' : willCombine ? 'warning' : 'primary'}
          onClick={onConfirmDialog}
          autoFocus={!willDelete}
          loading={changeTags.isPending}
          disabled={newTagName === oldTagName}
        >
          {willDelete ? 'Delete Tag' : willCombine ? 'Combine' : 'Rename'}
        </Button>
      </DialogActions>
    </Dialog>
  );

  const regenConfirmation = (
    <Confirmation
      open={openRegenConfirmation}
      title="Regenerate tags?"
      contentText={
        <>
          This will query all clubs for used tags, then update this public list.
          <br />
          Will also refresh the tag counts.
          <br />
          <br />
          This action cannot be undone!
        </>
      }
      onClose={() => {
        setOpenRegenConfirmation(false);
      }}
      onConfirm={onConfirmConfirmation}
      confirmText="Regenerate"
      confirmColor="primary"
      loading={refreshTags.isPending}
    />
  );

  return (
    <Panel heading="Club Tags">
      <div className="flex flex-row gap-2 flex-wrap justify-between items-start w-fill mx-2 mb-4">
        <div className="text-slate-600 dark:text-slate-400 text-sm">
          {tags.length} unique {tags.length === 1 ? 'tag' : 'tags'} from all
          approved clubs.
          <br />
          This list is public via filters.
        </div>
        <Button
          variant="contained"
          color="inherit"
          className="normal-case whitespace-nowrap shrink-0"
          startIcon={<RefreshIcon />}
          loading={changeTags.isPending}
          loadingPosition="start"
          onClick={() => {
            setOpenRegenConfirmation(true);
          }}
        >
          Regenerate Tags
        </Button>
      </div>
      <TextField
        value={searchTag}
        size="small"
        onChange={(e) => {
          setSearchTag(e.target.value);
        }}
        className="w-full"
        label="Search for tag"
        helperText={
          searchTag !== ''
            ? `${filteredTags.length} ${filteredTags.length === 1 ? 'result' : 'results'}`
            : ''
        }
        slotProps={{
          input: {
            endAdornment: searchTag ? (
              <InputAdornment position="end">
                <IconButton
                  aria-label="clear"
                  onClick={() => {
                    setSearchTag('');
                  }}
                  size="small"
                  edge="end"
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ) : undefined,
          },
        }}
      />
      <List dense>
        {filteredTags.map((tag) => (
          <ListItem
            key={tag.id}
            secondaryAction={
              <>
                <Tooltip title="Edit" disableInteractive>
                  <IconButton
                    aria-label="edit"
                    onClick={() => {
                      setOldTagName(tag.tag);
                      setNewTagName(tag.tag); // Default value
                      setOpenEditDialog(true);
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="View clubs with tag" disableInteractive>
                  <IconButton
                    edge="end"
                    aria-label="show clubs with tag"
                    href={`/?tags=${tag.tag}`}
                    target="_blank"
                  >
                    <OpenInNewIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </>
            }
          >
            <div>
              <ListItemText primary={tag.tag} />
              <span className="flex flex-row gap-2 w-fit">
                <ListItemText
                  secondary={`${tag.count} ${tag.count === 1 ? 'club' : 'clubs'}`}
                />
                {topTags?.some((topTag) => topTag.tag === tag.tag) && (
                  <Tooltip
                    title={
                      <>
                        Shown on the home page
                        <br />
                        Currently the top five tags
                      </>
                    }
                    disableInteractive
                  >
                    <Chip label="Top tag" color="primary" size="small" />
                  </Tooltip>
                )}
              </span>
            </div>
          </ListItem>
        ))}
      </List>
      {editDialog}
      {regenConfirmation}
    </Panel>
  );
}
