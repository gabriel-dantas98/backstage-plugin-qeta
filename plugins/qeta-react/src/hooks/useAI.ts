import { useApi } from '@backstage/core-plugin-api';
import { qetaApiRef } from '../api';
import React, { useCallback, useEffect } from 'react';
import {
  AIQuery,
  AIStatusResponse,
} from '@drodil/backstage-plugin-qeta-common';

let cache: AIStatusResponse | undefined = undefined;

export const useAI = () => {
  const qetaApi = useApi(qetaApiRef);
  const [isAIEnabled, setIsAIEnabled] = React.useState<boolean | undefined>(
    cache?.enabled,
  );
  const [isExistingQuestionsEnabled, setIsExistingQuestionsEnabled] =
    React.useState<boolean | undefined>(cache?.existingQuestions);
  const [isNewQuestionsEnabled, setIsNewQuestionsEnabled] = React.useState<
    boolean | undefined
  >(cache?.newQuestions);
  const [isArticleSummaryEnabled, setIsArticleSummaryEnabled] = React.useState<
    boolean | undefined
  >(cache?.articleSummaries);

  useEffect(() => {
    if (cache?.enabled !== undefined) {
      return;
    }
    qetaApi.isAIEnabled().then(resp => {
      setIsAIEnabled(resp.enabled);
      setIsExistingQuestionsEnabled(resp.existingQuestions);
      setIsNewQuestionsEnabled(resp.newQuestions);
      setIsArticleSummaryEnabled(resp.articleSummaries);
      cache = resp;
    });
  }, [qetaApi]);

  const answerExistingQuestion = useCallback(
    async (questionId: number, options?: AIQuery) => {
      if (isExistingQuestionsEnabled === false) {
        return null;
      }
      const ret = await qetaApi.getAIAnswerForQuestion(questionId, options);
      if (ret === null) {
        if (cache) {
          cache.existingQuestions = false;
        }
        setIsExistingQuestionsEnabled(false);
      }
      return ret;
    },
    [isExistingQuestionsEnabled, qetaApi],
  );

  const answerDraftQuestion = useCallback(
    async (draft: { title: string; content: string }) => {
      if (isNewQuestionsEnabled === false) {
        return null;
      }
      const ret = await qetaApi.getAIAnswerForDraft(draft.title, draft.content);
      if (ret === null) {
        if (cache) {
          cache.newQuestions = false;
        }
        setIsNewQuestionsEnabled(false);
      }
      return ret;
    },
    [isNewQuestionsEnabled, qetaApi],
  );

  const summarizeArticle = useCallback(
    async (articleId: number, options?: AIQuery) => {
      if (isArticleSummaryEnabled === false) {
        return null;
      }
      const ret = await qetaApi.getAISummaryForArticle(articleId, options);
      if (ret === null) {
        if (cache) {
          cache.articleSummaries = false;
        }
        setIsArticleSummaryEnabled(false);
      }
      return ret;
    },
    [isArticleSummaryEnabled, qetaApi],
  );

  return {
    isAIEnabled,
    isArticleSummaryEnabled,
    isExistingQuestionsEnabled,
    isNewQuestionsEnabled,
    answerExistingQuestion,
    answerDraftQuestion,
    summarizeArticle,
  };
};
