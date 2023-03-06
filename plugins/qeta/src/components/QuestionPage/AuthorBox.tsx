import { Avatar, Box, Grid, Link, Typography } from '@material-ui/core';
import { formatEntityName } from '../../utils/utils';
import React, { useEffect } from 'react';
import { useStyles } from '../../utils/hooks';
// @ts-ignore
import RelativeTime from 'react-relative-time';
import { AnswerResponse, QuestionResponse } from '../../api';
import { useApi } from '@backstage/core-plugin-api';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { UserEntity } from '@backstage/catalog-model';

export const AuthorBox = (props: {
  entity: QuestionResponse | AnswerResponse;
}) => {
  const { entity } = props;
  const catalogApi = useApi(catalogApiRef);
  const [user, setUser] = React.useState<UserEntity | null>(null);
  const styles = useStyles();
  useEffect(() => {
    catalogApi
      .getEntityByRef(entity.author)
      .catch(_ => setUser(null))
      .then(data => (data ? setUser(data as UserEntity) : setUser(null)));
  }, [catalogApi, entity]);

  const name = formatEntityName(entity.author);
  const initials = (name ?? '')
    .split(' ')
    .map(p => p[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <Box className={styles.questionCardAuthor}>
      <Grid container alignItems="center">
        <Grid item xs={12} style={{ paddingBottom: 0 }}>
          <Typography variant="caption">
            Posted <RelativeTime value={entity.created} />
          </Typography>
        </Grid>
        {entity.updated && (
          <Grid item xs={12} style={{ paddingBottom: 0, paddingTop: 0 }}>
            <Typography variant="caption">
              Updated <RelativeTime value={entity.updated} />
            </Typography>
          </Grid>
        )}
        <Grid item xs={2}>
          <Avatar
            src={user?.spec.profile?.picture}
            className="avatar"
            alt={name}
            variant="rounded"
          >
            {initials}
          </Avatar>
        </Grid>
        <Grid item xs={10} style={{ paddingTop: 0 }}>
          <Link href={`/qeta/users/${entity.author}`}>{name}</Link>
        </Grid>
      </Grid>
    </Box>
  );
};
