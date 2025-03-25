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

import { useEffect, useMemo, useState } from 'react';

import useSWRImmutable from 'swr/immutable';
import useSWRInfinite from 'swr/infinite';

import { ASSIGNABLE_ROLES } from '@/shared-modules/constant';

import { APIRole, APIRoleMappings, APIRoles, APIUser } from '@/types';

/**
 * Custom hook for DataTable
 *
 * Manages values such as DataTable records and pagination
 * @param data All records
 * @returns Props for DataTable
 */
export const useUserDetail = (userId: string) => {
  const [assignedRoles, filteredInheritedRoles, rolesErrors, rolesIsValidating, rolesMutate] = useRoles(userId);

  // Get user detailed information
  const {
    data: userData,
    mutate: userMutate,
    error: userError,
    isValidating: userValidating,
  } = useSWRImmutable<APIUser>(
    `${process.env.NEXT_PUBLIC_URL_IDP}/admin/realms/${process.env.NEXT_PUBLIC_IDP_REALMS}/users/${userId}`
  );
  /** Function called when reload is pressed */
  const mutate = () => {
    userMutate();
    rolesMutate();
  };

  return {
    userData,
    assignedRoles,
    inheritedRoles: filteredInheritedRoles,
    errors: [userError, ...rolesErrors],
    userValidating,
    rolesValidating: rolesIsValidating,
    mutate: mutate,
  };
};

const useRoles = (
  userId: string
): [
  assignedRoles: APIRoles,
  filteredRoles: APIRoles,
  rolesErrors: (object | undefined)[],
  rolesIsValidating: boolean,
  rolesMutate: () => void
] => {
  // List of composite role IDs used for recursive acquisition of permission roles
  const [compositeRolesID, setcompositeRolesID] = useState<string[]>([]);

  // Get user assigned roles
  const [assignedRoles, assignedRolesErrors, assignedRolesIsValidating, assignedRolesMutate] = useAssignedRoles(userId);

  const getKey = (pageIndex: number) => {
    // In case of reaching the last page
    if (compositeRolesID.length === 0 || compositeRolesID.length === pageIndex - 1) return null;

    // Get the roles inherited by each role
    const targetRole = compositeRolesID[pageIndex];
    return `${process.env.NEXT_PUBLIC_URL_IDP}/admin/realms/${process.env.NEXT_PUBLIC_IDP_REALMS}/roles-by-id/${targetRole}/composites`;
  };

  // Get permission roles for user assigned roles and composite permission roles
  const {
    data: inheritedRoles = [],
    mutate: inheritedRolesMutate,
    error: inheritedRolesError,
    isValidating: inheritedRolesValidating,
    setSize,
  } = useSWRInfinite<APIRole>(getKey, {
    initialSize: compositeRolesID.length,
    // Disable to not mutate automatically
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  // If the number of pages to be acquired changes, it will continue to be acquired at the initial acquisition page number unless explicitly changed
  useEffect(() => {
    setSize(compositeRolesID.length);
  }, [compositeRolesID, setSize]);

  // Extract composite roles from user assigned roles and permission roles, and set the ID of the roles to be acquired
  useEffect(() => {
    const additionalComposite = [
      ...new Set(
        [...assignedRoles, ...inheritedRoles.flat()]
          ?.filter((role) => role.composite)
          .filter((r) => !r.clientRole)
          .filter((role) => compositeRolesID.every((r) => r !== role.id))
          .map((role) => role.id)
      ),
    ];

    if (additionalComposite.length) {
      setcompositeRolesID((prev) => [...new Set([...prev, ...additionalComposite])]);
    }
  }, [assignedRoles, inheritedRoles, compositeRolesID]);

  // List of roles to display in the permission role table
  const filteredInheritedRoles = useMemo(() => {
    const rolesWithoutSettingRoles = inheritedRoles
      .flat()
      .filter((role) => ASSIGNABLE_ROLES.every((assignedRole) => role.name !== assignedRole));
    const uniqueRoles: APIRoles = [];
    // Remove client roles (Keycloak internal roles) and remove duplicates as permission roles contain duplicate data
    rolesWithoutSettingRoles
      .filter((role) => !role.clientRole)
      .forEach((role) => {
        if (uniqueRoles.every((r) => r.name !== role.name)) uniqueRoles.push(role);
      });
    return uniqueRoles;
  }, [inheritedRoles]);

  const rolesErrors = [...assignedRolesErrors, inheritedRolesError];
  const rolesIsValidating = assignedRolesIsValidating || inheritedRolesValidating;
  const rolesMutate = () => {
    assignedRolesMutate();
    inheritedRolesMutate();
  };

  return [assignedRoles, filteredInheritedRoles, rolesErrors, rolesIsValidating, rolesMutate];
};

const useAssignedRoles = (
  userId: string
): [
  assignedRoles: APIRoles,
  assignedRolesErrors: (object | undefined)[],
  assignedRolesIsValidating: boolean,
  assignedRolesMutate: () => void
] => {
  // Function to sort by role name
  const compareFn = (a: APIRole, b: APIRole) => {
    const SORT_ORDERS = {
      SORT_B_BEFORE_A: -1,
      SORT_A_BEFORE_B: 1,
      KEEP_ORIGINAL_ORDER: 0,
    } as const;
    if (a.name < b.name) {
      return SORT_ORDERS.SORT_B_BEFORE_A;
    }
    if (a.name > b.name) {
      return SORT_ORDERS.SORT_A_BEFORE_B;
    }
    return SORT_ORDERS.KEEP_ORIGINAL_ORDER;
  };

  // Get roles directly assigned to the user
  const {
    data: attachedRoles,
    mutate: attachedRolesMutate,
    error: attachedRolesError,
    isValidating: attachedRolesValidating,
  } = useSWRImmutable<APIRoleMappings>(
    `${process.env.NEXT_PUBLIC_URL_IDP}/admin/realms/${process.env.NEXT_PUBLIC_IDP_REALMS}/users/${userId}/role-mappings`
  );

  const assignedRoles = useMemo(() => {
    const uniqueRoles: APIRoles = [];
    attachedRoles?.realmMappings
      .sort(compareFn)
      // Narrow down to only the roles corresponding to the user assigned roles
      .filter((role) => ASSIGNABLE_ROLES.some((roleName: string) => role.name === roleName))
      .forEach((role) => {
        if (uniqueRoles.every((r) => r.name !== role.name)) uniqueRoles.push(role);
      });
    return uniqueRoles;
  }, [attachedRoles]);

  const assignedRolesErrors = [attachedRolesError];
  const assignedRolesIsValidating = attachedRolesValidating;
  const assignedRolesMutate = () => {
    attachedRolesMutate();
  };

  return [assignedRoles, assignedRolesErrors, assignedRolesIsValidating, assignedRolesMutate];
};
