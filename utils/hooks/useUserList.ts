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

import { useMemo } from 'react';

import useSWRInfinite from 'swr/infinite';

import { ASSIGNABLE_ROLES } from '@/shared-modules/constant';
import { fetcher } from '@/shared-modules/utils';

import { APIUsers, APPUser } from '@/types';

/**
 * Custom hook for DataTable
 *
 * Manages values such as DataTable records and pagination
 * @param data All records
 * @returns Props for DataTable
 */
export const useUserList = () => {
  const getKey = (pageIndex: number) => {
    // In case of reaching the last page

    if (ASSIGNABLE_ROLES.length === pageIndex - 1) return null;

    // Get the user list for each role
    const targetRole = ASSIGNABLE_ROLES[pageIndex];
    return `${process.env.NEXT_PUBLIC_URL_IDP}/admin/realms/${process.env.NEXT_PUBLIC_IDP_REALMS}/roles/${targetRole}/users`;
  };

  const defaultVal = useMemo(() => [], []);
  // Get the user list
  const {
    data: usersData = defaultVal,
    error: usersDataError,
    isValidating: usersDataIsValidating,
    mutate: usersDataMutate,
  } = useSWRInfinite<APIUsers>(getKey, fetcher, {
    initialSize: ASSIGNABLE_ROLES.length,
    // Disable to not mutate automatically
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const parsedUsersData = useMemo(() => {
    const usernameToUserData: { [key in string]: APPUser } = {};
    usersData.forEach((users, idx) => {
      const roleName = ASSIGNABLE_ROLES[idx];
      users.forEach((user) => {
        if (!usernameToUserData[user.username]) {
          usernameToUserData[user.username] = {
            ...{ ...user, lastName: user.lastName || '', firstName: user.firstName || '' },
            roles: [roleName],
          };
        } else {
          usernameToUserData[user.username].roles.push(roleName);
        }
      });
    });
    return Object.values(usernameToUserData);
  }, [usersData]);

  return {
    data: parsedUsersData,
    errors: [usersDataError],
    isValidating: usersDataIsValidating,
    mutate: () => {
      usersDataMutate();
    },
  };
};
