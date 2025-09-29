/*
 * Copyright 2025 NEC Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

'use client';

import { Group, Stack } from '@mantine/core';
import { DataTableColumn } from 'mantine-datatable';
import { useTranslations } from 'next-intl';
import {
  TextInputForTableFilter,
  MultiSelectForTableFilter,
  PageLink,
  LongSentences,
} from '@/shared-modules/components';

import { APPUser } from '@/types';

import { EnableToIcon } from '@/components/icons/EnableToIcon';

import { UserFilter, isUserEnableds } from '@/utils/hooks/useUserFilter';

type UseColumns = (userFilter: UserFilter) => DataTableColumn<APPUser>[];

/**
 * * Construct columns for the user list
 *
 * @param userFilter Filter information
 * @returns Column information
 */
export const useColumns: UseColumns = (userFilter) => {
  const EMPTY = 0;
  const t = useTranslations();
  /** Generate default column information */
  const defaultCol: DataTableColumn<APPUser>[] = [
    {
      accessor: 'username',
      title: t('Username'),
      sortable: true,
      filter: (
        <>
          <TextInputForTableFilter
            label={t('Username')}
            value={userFilter.query.username}
            setValue={userFilter.setQuery.username}
          />
          <MultiSelectForTableFilter
            label={t('Active Status')}
            options={userFilter.selectOptions.enabled}
            value={userFilter.query.enabled}
            setValue={(value: string[]) => {
              isUserEnableds(value) && userFilter.setQuery.enabled(value);
            }}
          />
        </>
      ),
      filtering: userFilter.query.username !== '' || userFilter.query.enabled.length > EMPTY,
      render: ({ id, enabled, username }) => {
        return (
          <Group gap={5} wrap='nowrap'>
            <EnableToIcon isEnabled={enabled} />
            <PageLink title={t('User Details')} path='/cdim/user-detail' query={{ id }}>
              <LongSentences text={username} />
            </PageLink>
          </Group>
        );
      },
    },
    {
      accessor: 'lastName',
      title: t('Last Name'),
      sortable: true,
      filter: (
        <TextInputForTableFilter
          label={t('Last Name')}
          value={userFilter.query.lastName}
          setValue={userFilter.setQuery.lastName}
        />
      ),
      filtering: userFilter.query.lastName !== '',
      render: ({ lastName }) => <LongSentences text={lastName} />,
    },
    {
      accessor: 'firstName',
      title: t('First Name'),
      sortable: true,
      filter: (
        <TextInputForTableFilter
          label={t('First Name')}
          value={userFilter.query.firstName}
          setValue={userFilter.setQuery.firstName}
        />
      ),
      filtering: userFilter.query.firstName !== '',
      render: ({ firstName }) => <LongSentences text={firstName} />,
    },
    {
      accessor: 'roles',
      title: t('Role'),
      sortable: true,
      render: ({ roles }) => (
        <Stack gap={0}>
          {roles.sort().map((roleId: string) => (
            <LongSentences key={roleId} text={roleId} />
          ))}
        </Stack>
      ),
      filter: (
        <MultiSelectForTableFilter
          label={t('Role')}
          options={userFilter.selectOptions.role}
          value={userFilter.query.roles}
          setValue={userFilter.setQuery.roles}
        />
      ),
      filtering: userFilter.query.roles.length > EMPTY,
    },
  ];
  return defaultCol;
};
