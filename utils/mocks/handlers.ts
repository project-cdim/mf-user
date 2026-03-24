/*
 * Copyright 2025-2026 NEC Corporation.
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

import { HttpResponse, http } from 'msw';

import { ASSIGNABLE_ROLES } from '@/shared-modules/constant';

import { dummyAPIUsers } from '@/utils/dummy-data/user-list/dummyAPIUsers';
import { dummyAttachedRoles, dummyInheritedRoles } from '@/utils/dummy-data/user-detail/dummyRoles';
import { dummyAPIRoles } from '@/utils/dummy-data/user-detail/dummyAPIRoles';

const idpUrl = process.env.NEXT_PUBLIC_URL_IDP;
const idpRealms = process.env.NEXT_PUBLIC_IDP_REALMS;

// ===== IDP (Keycloak) Handlers =====
// Endpoints for user list and user detail pages:
// - GET /admin/realms/:realm/roles/:role/users (for useUserList)
// - GET /admin/realms/:realm/users/:userid (for useUserDetail)
// - GET /admin/realms/:realm/users/:userid/role-mappings (for useUserDetail)
// - GET /admin/realms/:realm/roles-by-id/:roleid/composites (for useUserDetail)
const idpHandlers = [
  // Get users by role (for user list page)
  http.get(`${idpUrl}/admin/realms/${idpRealms}/roles/:role/users`, ({ params }) => {
    const { role } = params;

    // Filter users based on the role
    // For mock purposes, distribute users across different roles
    if (role === ASSIGNABLE_ROLES[0]) {
      // cdim-administrator - return first 3 users
      return HttpResponse.json(dummyAPIUsers.slice(0, 3));
    } else if (role === ASSIGNABLE_ROLES[1]) {
      // cdim-operator - return users 2-5 (some overlap for testing multi-role)
      return HttpResponse.json(dummyAPIUsers.slice(2, 6));
    } else if (role === ASSIGNABLE_ROLES[2]) {
      // cdim-viewer - return users 4-7
      return HttpResponse.json(dummyAPIUsers.slice(4, 8));
    }

    // Unknown role
    return HttpResponse.json([]);
  }),

  // Get user detail information (for user detail page)
  http.get(`${idpUrl}/admin/realms/${idpRealms}/users/:userid`, ({ params }) => {
    const { userid } = params;

    // Find user by ID
    const user = dummyAPIUsers.find((u) => u.id === userid);

    if (user) {
      return HttpResponse.json(user);
    }

    // User not found
    return new HttpResponse(null, { status: 404 });
  }),

  // Get user role mappings (for user detail page)
  http.get(`${idpUrl}/admin/realms/${idpRealms}/users/:userid/role-mappings`, ({ params }) => {
    const { userid } = params;

    // Check if user exists
    const user = dummyAPIUsers.find((u) => u.id === userid);

    if (user) {
      return HttpResponse.json(dummyAttachedRoles);
    }

    // User not found
    return new HttpResponse(null, { status: 404 });
  }),

  // Get composite roles by role ID (for user detail page)
  http.get(`${idpUrl}/admin/realms/${idpRealms}/roles-by-id/:roleid/composites`, ({ params }) => {
    const { roleid } = params;

    // Map role IDs to their composite roles
    // For role-0001 (cdim-administrator), return first set of inherited roles
    if (roleid === 'role-0001') {
      return HttpResponse.json(dummyInheritedRoles[0] ?? []);
    }
    // For role-0002 (cdim-operator), return second set of inherited roles
    if (roleid === 'role-0002') {
      return HttpResponse.json(dummyInheritedRoles[1] ?? []);
    }
    // For other composite roles from inherited roles
    const inheritedRole = dummyInheritedRoles.flat().find((r) => r.id === roleid);
    if (inheritedRole && inheritedRole.composite) {
      // Return mock composite roles for nested composite roles
      return HttpResponse.json(dummyAPIRoles);
    }

    // Role not found or no composite roles
    return HttpResponse.json([]);
  }),
];

// Default export for backward compatibility
export const handlers = [...idpHandlers];

/**
 * Create handlers based on configuration
 * @returns Array of enabled MSW request handlers
 */
export const createHandlers = () => {
  // Import config dynamically to avoid issues during module initialization
  const { getMSWMockConfig } = require('./config');
  const config = getMSWMockConfig();
  const handlers = [];

  if (config.idp) handlers.push(...idpHandlers);

  return handlers;
};
