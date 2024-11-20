import { ContentHeader } from '@backstage/core-components';
import {
  AskQuestionButton,
  FollowedCollectionsList,
  FollowedEntitiesList,
  FollowedTagsList,
  ImpactCard,
  PostsCard,
  SuggestionsCard,
  useIdentityApi,
  useTranslation,
} from '@drodil/backstage-plugin-qeta-react';
import React from 'react';
import Grid from '@mui/material/Grid';

export const HomePage = () => {
  const { t } = useTranslation();
  const {
    value: user,
    loading: loadingUser,
    error: userError,
  } = useIdentityApi(api => api.getBackstageIdentity(), []);

  return (
    <Grid container spacing={4}>
      <Grid item md={12} lg={8} xl={9}>
        <ContentHeader title={t('homePage.title')}>
          <AskQuestionButton />
        </ContentHeader>
        <Grid container>
          <Grid item xs={12}>
            <SuggestionsCard />
          </Grid>
          {user && !loadingUser && !userError && (
            <Grid item xs={12}>
              <PostsCard
                type="own"
                title={t('highlights.own.title')}
                options={{ author: user.userEntityRef }}
                postType="question"
              />
            </Grid>
          )}
          <Grid item xs={12}>
            <PostsCard
              type="own"
              title={t('highlights.unanswered.title')}
              options={{ noAnswers: true, random: true, type: 'question' }}
              postType="question"
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item lg={4} xl={3}>
        <ImpactCard />
        <FollowedTagsList />
        <FollowedEntitiesList />
        <FollowedCollectionsList />
      </Grid>
    </Grid>
  );
};
