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
import { useTranslations } from 'next-intl';

import { APPUser } from '@/types';
import { isAllStringIncluded, isAnyValueSelected, isSelected } from '@/shared-modules/utils';
export type UserEnabled = 'enabled' | 'disabled';

/**
 * Checks if the values in the array are of type UserEnabled.
 * @param values - The array of values to check.
 * @returns A boolean indicating if all values are of type UserEnabled.
 */
export function isUserEnableds(values: unknown[]): values is UserEnabled[] {
  return values.every((value) => value === 'disabled' || value === 'enabled');
}

// Omit 'id' and 'enabled' from APPUser, and re-add 'enabled' as type UserEnabled[]
type AppUserQuery = Omit<APPUser, 'id' | 'enabled'> & {
  enabled: UserEnabled[];
};

type APPUserSetQuery = {
  username: Dispatch<SetStateAction<string>>;
  lastName: Dispatch<SetStateAction<string>>;
  firstName: Dispatch<SetStateAction<string>>;
  enabled: Dispatch<SetStateAction<UserEnabled[]>>;
  roles: Dispatch<SetStateAction<string[]>>;
};

export type UserFilter = {
  /** Filtered records */
  filteredRecords: APPUser[];
  /** Filter values */
  query: AppUserQuery;
  /** Set functions */
  setQuery: APPUserSetQuery;
  /** MultiSelect options */
  selectOptions: { enabled: { value: UserEnabled; label: string }[]; role: string[] };
};

type UserFilterHook = (
  records: APPUser[] // All records
) => UserFilter;

/**
 * Custom hook for user list filter
 *
 * @param records All records
 * @returns Filtered records, filter information
 */
export const useUserFilter: UserFilterHook = (records) => {
  const DVOUNCE_WAIT_TIME = 200;

  const t = useTranslations();

  const [usernameQuery, setUsernameQuery] = useState('');
  const [debouncedUsernameQuery] = useDebouncedValue(usernameQuery, DVOUNCE_WAIT_TIME);
  const [lastNameQuery, setLastNameQuery] = useState('');
  const [firstNameQuery, setFirstNameQuery] = useState('');
  const [debouncedLastNameQuery] = useDebouncedValue(lastNameQuery, DVOUNCE_WAIT_TIME);
  const [debouncedFirstNameQuery] = useDebouncedValue(firstNameQuery, DVOUNCE_WAIT_TIME);
  const [enabledQuery, setEnabledQuery] = useState<UserEnabled[]>([]);
  const [rolesQuery, setRolesQuery] = useState<string[]>([]);
  const roleOptions = Array.from(new Set(records.map((record) => record.roles).flat()));
  const enabledOptions: { value: UserEnabled; label: string }[] = [
    { value: 'enabled', label: t('Enabled') },
    { value: 'disabled', label: t('Disabled') },
  ];

  const filteredRecords = useMemo(() => {
    return records.filter(
      (record) =>
        isAllStringIncluded(record.username, debouncedUsernameQuery) &&
        isAllStringIncluded(record.lastName, debouncedLastNameQuery) &&
        isAllStringIncluded(record.firstName, debouncedFirstNameQuery) &&
        isSelected(record.enabled ? 'enabled' : 'disabled', enabledQuery) &&
        isAnyValueSelected(record.roles, rolesQuery)
    );
  }, [records, debouncedUsernameQuery, debouncedLastNameQuery, debouncedFirstNameQuery, rolesQuery, enabledQuery]);

  return {
    filteredRecords,
    query: {
      username: usernameQuery,
      lastName: lastNameQuery,
      firstName: firstNameQuery,
      enabled: enabledQuery,
      roles: rolesQuery,
    },
    setQuery: {
      username: setUsernameQuery,
      lastName: setLastNameQuery,
      firstName: setFirstNameQuery,
      enabled: setEnabledQuery,
      roles: setRolesQuery,
    },
    selectOptions: { enabled: enabledOptions, role: roleOptions },
  };
};
