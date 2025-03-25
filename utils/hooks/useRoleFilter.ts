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

import { Dispatch, SetStateAction, useMemo, useState } from 'react';

import { useDebouncedValue } from '@mantine/hooks';

import { APIRole, APIRoles } from '@/types';
import { isAllStringIncluded } from '@/shared-modules/utils';
type AppRoleQuery = Pick<APIRole, 'name' | 'description'>;
type APPRoleSetQuery = {
  name: Dispatch<SetStateAction<string>>;
  description: Dispatch<SetStateAction<string>>;
};

export type RoleFilter = {
  /** Filtered records */
  filteredRecords: APIRoles;
  /** Filter values */
  query: AppRoleQuery;
  /** Set functions */
  setQuery: APPRoleSetQuery;
  /** MultiSelect options */
  selectOptions: Record<string, never>;
};

/**
 * Custom hook for filtering the list of authority roles
 *
 * @param records All records
 * @returns Filtered records, filter information
 */
export const useRoleFilter = (records: APIRoles) => {
  const DVOUNCE_WAIT_TIME = 200;

  const [nameQuery, setNameQuery] = useState('');
  const [debouncedNameQuery] = useDebouncedValue(nameQuery, DVOUNCE_WAIT_TIME);
  const [descriptionQuery, setDescriptionQuery] = useState('');
  const [debouncedDescriptionQuery] = useDebouncedValue(descriptionQuery, DVOUNCE_WAIT_TIME);

  const filteredRecords = useMemo(() => {
    return records.filter(
      (record) =>
        isAllStringIncluded(record.name, debouncedNameQuery) &&
        isAllStringIncluded(record.description, debouncedDescriptionQuery)
    );
  }, [records, debouncedNameQuery, debouncedDescriptionQuery]);

  return {
    filteredRecords,
    query: {
      name: nameQuery,
      description: descriptionQuery,
    },
    setQuery: {
      name: setNameQuery,
      description: setDescriptionQuery,
    },
    selectOptions: {},
  };
};
