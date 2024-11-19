import { Collection } from '@drodil/backstage-plugin-qeta-common';
import { InfoCard } from '@backstage/core-components';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import CardMedia from '@mui/material/CardMedia';
import { MarkdownRenderer } from '../MarkdownRenderer';
import React from 'react';
import { TagsAndEntities } from '../TagsAndEntities/TagsAndEntities';
import DeleteIcon from '@mui/icons-material/Delete';
import { DeleteModal } from '../DeleteModal';
import EditIcon from '@mui/icons-material/Edit';
import { useRouteRef } from '@backstage/core-plugin-api';
import { collectionEditRouteRef } from '../../routes';
import { useTranslation } from '../../hooks';

export const CollectionCard = (props: { collection: Collection }) => {
  const { collection } = props;
  const editCollectionRoute = useRouteRef(collectionEditRouteRef);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const handleDeleteModalOpen = () => setDeleteModalOpen(true);
  const handleDeleteModalClose = () => setDeleteModalOpen(false);
  const { t } = useTranslation();
  return (
    <InfoCard>
      {collection.headerImage && (
        <CardMedia
          component="img"
          height="200"
          src={collection.headerImage}
          alt={collection.title}
        />
      )}
      <CardContent>
        <Grid container>
          <Grid item xs={12}>
            {collection.description && (
              <MarkdownRenderer content={collection.description} />
            )}
          </Grid>
          <Grid item xs={12}>
            <TagsAndEntities entity={collection} />
          </Grid>
          <Grid container item xs={12}>
            {collection.canDelete && (
              <Grid item>
                <Button
                  variant="outlined"
                  size="small"
                  color="secondary"
                  onClick={handleDeleteModalOpen}
                  startIcon={<DeleteIcon />}
                >
                  {t('deleteModal.deleteButton')}
                </Button>
                <DeleteModal
                  open={deleteModalOpen}
                  onClose={handleDeleteModalClose}
                  entity={collection}
                />
              </Grid>
            )}
            {collection.canEdit && (
              <Grid item>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<EditIcon />}
                  href={editCollectionRoute({
                    id: collection.id.toString(10),
                  })}
                >
                  {t('questionPage.editButton')}
                </Button>
              </Grid>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </InfoCard>
  );
};
