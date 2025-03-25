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

import { Group, Stack, Text, Title } from '@mantine/core';
import { AxiosError } from 'axios';
import { useLocale, useTranslations } from 'next-intl';
import { SWRConfig, type SWRConfiguration } from 'swr';

import {
  CardLoading,
  IconWithInfo,
  MessageBox,
  PageHeader,
  CustomDataTable,
  HorizontalTable,
  ExternalLink,
} from '@/shared-modules/components';
import { STATUS_CODE } from '@/shared-modules/constant';
import { fetcher } from '@/shared-modules/utils';
import { useLoading, useQuery } from '@/shared-modules/utils/hooks';

import { APIRoles, APIUser } from '@/types';

import { EnableToIcon } from '@/components/icons/EnableToIcon';

import { useUserDetail, useRoleFilter } from '@/utils/hooks';
import { useColumns } from '@/utils/hooks/user-detail/useColumns';

const UserDetail = () => {
  const SWR_OPTIONS: SWRConfiguration = {
    fetcher: fetcher,
    onErrorRetry: (error: AxiosError, key, config, revalidate, { retryCount }) => {
      // Do not retry on 404.
      if (error.response?.status === STATUS_CODE.NOT_FOUND) return;

      // Retry up to 10 times

      if (retryCount >= 10) return;

      // Determine the interval between retries using the Exponential backoff algorithm

      const retryInterval = 2 ** retryCount * 1000;
      setTimeout(() => revalidate({ retryCount }), retryInterval);
    },
  };

  return (
    <SWRConfig value={SWR_OPTIONS}>
      <UserDetailMain />
    </SWRConfig>
  );
};

/**
 * User detail page
 *
 * @returns Page content
 */
const UserDetailMain = () => {
  const t = useTranslations();
  const query = useQuery();
  const items = [
    { title: t('User Management') },
    { title: t('Users'), href: '/cdim/user-list' },
    { title: `${t('User Details')} <${query.id}>` },
  ];

  const { userData, assignedRoles, inheritedRoles, errors, userValidating, rolesValidating, mutate } = useUserDetail(
    (query.id as string) || ''
  );

  const userLoading = useLoading(userValidating);
  const rolesLoading = useLoading(rolesValidating);
  const loading = useLoading(userValidating || rolesValidating);
  return (
    <>
      <Stack gap='xl'>
        <Group justify='space-between' align='end'>
          <PageHeader pageTitle={t('User Details')} items={items} mutate={mutate} loading={loading} />
          {/* Link to Keycloak management console */}
          <ExternalLink
            title='Keycloak'
            url={`${process.env.NEXT_PUBLIC_URL_IDP}/admin/${process.env.NEXT_PUBLIC_IDP_REALMS}/console/#/${process.env.NEXT_PUBLIC_IDP_REALMS}/users/${query.id}/settings`}
          >
            {t('Management Console')}
          </ExternalLink>
        </Group>

        {errors.map((error, index) =>
          error ? (
            <MessageBox type='error' title={error.message} message={error.response?.data.error || ''} key={index} />
          ) : null
        )}
        <Summary userData={userData} loading={userLoading} />
        <Role assignedRoles={assignedRoles} inheritedRoles={inheritedRoles} loading={rolesLoading} />
      </Stack>
    </>
  );
};

const Summary = (props: { userData: APIUser | undefined; loading: boolean }) => {
  const MAX_CARD_WIDTH = '32em';
  const t = useTranslations();
  /** Get language settings */
  const currentLanguage = useLocale();

  let username = undefined;
  let userId = undefined;
  let lastName = undefined;
  let firstName = undefined;
  let email = undefined;
  let createdTimestamp = undefined;
  let enabled = undefined;
  if (props.userData) {
    username = props.userData.username;
    userId = props.userData.id;
    lastName = props.userData.lastName;
    firstName = props.userData.firstName;
    email = props.userData.email;
    createdTimestamp = props.userData.createdTimestamp;
    enabled = props.userData.enabled;
  }

  // To match the number of hooks during rendering, always call
  const enableIcon = <EnableToIcon isEnabled={enabled ?? false} />;
  const tableData = [
    {
      columnName: t('ID'),
      value: userId,
    },
    {
      columnName: t('Last Name'),
      value: lastName,
    },
    {
      columnName: t('First Name'),
      value: firstName,
    },
    {
      columnName: t('Email'),
      value: email,
    },
    {
      columnName: t('Created'),
      value: createdTimestamp !== undefined && new Date(createdTimestamp).toLocaleString(currentLanguage),
    },
    {
      columnName: t('Active Status'),
      value: props.userData && (
        <Group gap={5}>
          {enableIcon}
          {enabled ? t('Enabled') : t('Disabled')}
        </Group>
      ),
    },
  ];

  return (
    <Stack>
      <CardLoading withBorder maw={MAX_CARD_WIDTH} loading={props.loading}>
        <Text fz='sm'>{t('Username')}</Text>
        <Text fz='lg' fw={500}>
          {username}
        </Text>
      </CardLoading>
      <HorizontalTable tableData={tableData} loading={props.loading} maw={MAX_CARD_WIDTH} />
    </Stack>
  );
};

const Role = (props: { assignedRoles: APIRoles; inheritedRoles: APIRoles; loading: boolean }) => {
  const t = useTranslations();

  /** Records to display */
  const roleFilter = useRoleFilter(props.inheritedRoles);

  /** Column settings */
  const columns = useColumns(roleFilter);

  return (
    <Stack>
      <Title size='1.0rem'>{t('Role')}</Title>
      <CardLoading withBorder maw={'32em'} loading={props.loading}>
        <Text fz='sm'>{t('Assigned Role')}</Text>
        {props.assignedRoles.map((role) => {
          return (
            role.name !== 'default-roles-cdim' && (
              <Group key={role.name}>
                <Text key={role.name} fz='lg' fw={500}>
                  {role.name}
                </Text>
                <IconWithInfo type='info' label={role.description} />
              </Group>
            )
          );
        })}
      </CardLoading>
      <CustomDataTable
        records={roleFilter.filteredRecords}
        columns={columns}
        loading={props.loading}
        defaultSortColumn='name'
      />
    </Stack>
  );
};

export default UserDetail;
