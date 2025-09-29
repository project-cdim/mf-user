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

import { DataTableColumn } from 'mantine-datatable';
import { useTranslations } from 'next-intl';
import { LongSentences, TextInputForTableFilter } from '@/shared-modules/components';
import { APIRole } from '@/types';

import { RoleFilter } from '@/utils/hooks/useRoleFilter';

type UseColumns = (roleFilter: RoleFilter) => DataTableColumn<Pick<APIRole, 'name' | 'description'>>[];

/**
 * * Construct columns for the list of permission roles
 *
 * @param roleFilter Filter information
 * @returns Column information
 */
export const useColumns: UseColumns = (roleFilter) => {
  const t = useTranslations();

  /** Generate default column information */
  const defaultCol: DataTableColumn<Pick<APIRole, 'name' | 'description'>>[] = [
    {
      accessor: 'name',
      title: t('Permissions'),
      sortable: true,
      filter: (
        <TextInputForTableFilter
          label={t('Permissions')}
          value={roleFilter.query.name}
          setValue={roleFilter.setQuery.name}
        />
      ),
      filtering: roleFilter.query.name !== '',
      noWrap: true,
    },
    {
      accessor: 'description',
      title: t('Description'),
      sortable: true,
      filter: (
        <TextInputForTableFilter
          label={t('Description')}
          value={roleFilter.query.description}
          setValue={roleFilter.setQuery.description}
        />
      ),
      filtering: roleFilter.query.description !== '',
      render: ({ description }) => <LongSentences text={description} />,
    },
  ];
  return defaultCol;
};
