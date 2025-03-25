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
import { useTranslations } from 'next-intl';

import { MessageBox, PageHeader, CustomDataTable, ExternalLink } from '@/shared-modules/components';
import { useLoading } from '@/shared-modules/utils/hooks';

import { useUserFilter, useUserList } from '@/utils/hooks';
import { useColumns } from '@/utils/user-list';

/**
 * User list page
 *
 * @returns Page content
 */
const UserList = () => {
  const t = useTranslations();

  const mswInitializing = false;
  const breadcrumbs = [{ title: t('User Management') }, { title: t('Users') }];

  // Custom hook for fetching user list data
  const { data: formattedData, mutate, errors, isValidating } = useUserList();

  const loading = useLoading(isValidating || mswInitializing);

  /** Custom hook for filter */
  const userFilter = useUserFilter(formattedData);
  /** Column settings */
  const columns = useColumns(userFilter);

  return (
    <Stack gap='xl'>
      <Group justify='space-between' align='end'>
        <PageHeader pageTitle={t('Users')} items={breadcrumbs} mutate={mutate} loading={loading} />
        {/* Link to Keycloak management console */}
        <ExternalLink
          title='Keycloak'
          url={`${process.env.NEXT_PUBLIC_URL_IDP}/admin/${process.env.NEXT_PUBLIC_IDP_REALMS}/console/#/${process.env.NEXT_PUBLIC_IDP_REALMS}/users`}
        >
          {t('Management Console')}
        </ExternalLink>
      </Group>
      {errors.map((error, index) =>
        error ? (
          <MessageBox type='error' title={error.message} message={error.response?.data.error || ''} key={index} />
        ) : null
      )}
      <CustomDataTable
        records={userFilter.filteredRecords}
        columns={columns}
        loading={loading}
        defaultSortColumn='username'
      />
    </Stack>
  );
};

export default UserList;
