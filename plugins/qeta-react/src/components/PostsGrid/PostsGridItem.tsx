import {
  PostResponse,
  PostType,
  QetaSignal,
  removeMarkdownFormatting,
  truncate,
} from '@drodil/backstage-plugin-qeta-common';
import React, { useEffect, useState } from 'react';
import { useSignal } from '@backstage/plugin-signals-react';
import { useApi, useRouteRef } from '@backstage/core-plugin-api';
import { articleRouteRef, questionRouteRef, userRouteRef } from '../../routes';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import CardMedia from '@mui/material/CardMedia';
import DOMPurify from 'dompurify';
import { useNavigate } from 'react-router-dom';
import { TagsAndEntities } from '../TagsAndEntities/TagsAndEntities';
import { Link } from '@backstage/core-components';
import { RelativeTimeWithTooltip } from '../RelativeTimeWithTooltip';
import { useTranslation } from '../../hooks';
import { useEntityAuthor } from '../../hooks/useEntityAuthor';
import { qetaApiRef } from '../../api';
import VerticalAlignTopIcon from '@mui/icons-material/VerticalAlignTop';
import VerticalAlignBottomIcon from '@mui/icons-material/VerticalAlignBottom';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Stack from '@mui/material/Stack';

export interface PostsGridItemProps {
  post: PostResponse;
  entity?: string;
  type?: PostType;
  allowRanking?: boolean;
  onRankUpdate?: () => void;
  collectionId?: number;
}

export const PostsGridItem = (props: PostsGridItemProps) => {
  const { post, entity, allowRanking, onRankUpdate, collectionId } = props;
  const [views, setViews] = useState(post.views);
  const qetaApi = useApi(qetaApiRef);
  const { t } = useTranslation();

  const { lastSignal } = useSignal<QetaSignal>(`qeta:post_${post.id}`);

  useEffect(() => {
    if (lastSignal?.type === 'post_stats') {
      setViews(lastSignal.views);
    }
  }, [lastSignal]);

  const questionRoute = useRouteRef(questionRouteRef);
  const articleRoute = useRouteRef(articleRouteRef);
  const userRoute = useRouteRef(userRouteRef);
  const { name, initials, user } = useEntityAuthor(post);
  const navigate = useNavigate();

  const route = post.type === 'question' ? questionRoute : articleRoute;
  const href = entity
    ? `${route({
        id: post.id.toString(10),
      })}?entity=${entity}`
    : route({ id: post.id.toString(10) });

  const rank = (direction: 'top' | 'bottom' | 'up' | 'down') => {
    if (!collectionId) {
      return;
    }
    qetaApi.rankPostInCollection(collectionId, post.id, direction).then(res => {
      if (res) {
        onRankUpdate?.();
      }
    });
  };

  return (
    <Card style={{ height: '100%' }}>
      <CardActionArea onClick={() => navigate(href)}>
        {post.headerImage && (
          <CardMedia
            component="img"
            height="140"
            image={post.headerImage}
            alt={post.title}
          />
        )}
        <CardContent style={{ paddingBottom: '0.5rem' }}>
          <Typography gutterBottom variant="h6" component="div">
            {post.title}
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            {DOMPurify.sanitize(
              truncate(removeMarkdownFormatting(post.content), 400),
            )}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardContent style={{ paddingTop: '0.5rem' }}>
        <TagsAndEntities entity={post} />
        <Box style={{ paddingLeft: '0.2rem', paddingTop: '0.5rem' }}>
          <Typography variant="caption">
            <Avatar
              src={user?.spec?.profile?.picture}
              alt={name}
              variant="rounded"
              sx={{
                display: 'inline-flex !important',
                marginRight: '0.25rem',
                fontSize: '1rem',
                maxWidth: '1rem',
                maxHeight: '1rem',
              }}
            >
              {initials}
            </Avatar>
            {post.author === 'anonymous' ? (
              t('common.anonymousAuthor')
            ) : (
              <Link to={`${userRoute()}/${post.author}`}>{name}</Link>
            )}{' '}
            <Link to={href} className="qetaPostListItemQuestionBtn">
              <RelativeTimeWithTooltip value={post.created} />
            </Link>
            {' · '}
            {t('common.views', { count: views })}
          </Typography>
        </Box>
        {allowRanking && (
          <Stack
            direction="row"
            spacing={0}
            style={{
              paddingRight: '0.2rem',
              paddingTop: '0.5rem',
              float: 'right',
            }}
          >
            <Tooltip title={t('ranking.top')}>
              <IconButton size="small" onClick={() => rank('top')}>
                <VerticalAlignTopIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={t('ranking.up')}>
              <IconButton size="small" onClick={() => rank('up')}>
                <KeyboardArrowUpIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={t('ranking.down')}>
              <IconButton size="small" onClick={() => rank('down')}>
                <KeyboardArrowDownIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={t('ranking.bottom')}>
              <IconButton size="small" onClick={() => rank('bottom')}>
                <VerticalAlignBottomIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};
