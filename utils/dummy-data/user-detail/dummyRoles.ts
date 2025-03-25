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

import { APIRoleMappings, APIRoles } from '@/types';

export const dummyAttachedRoles: APIRoleMappings = {
  realmMappings: [
    // There are two 'cdim-operator' for duplicate removal
    // For name sorting, 'ope' is placed at the beginning instead of 'admin'
    {
      id: 'role-0002',
      name: 'cdim-operator',
      description: 'DC Operator',
      composite: true,
      clientRole: false,
      containerId: 'container-0001',
    },
    {
      id: 'role-0002',
      name: 'cdim-operator',
      description: 'DC Operator',
      composite: true,
      clientRole: false,
      containerId: 'container-0001',
    },
    {
      id: 'role-0001',
      name: 'cdim-administrator',
      description: 'DC Manager',
      composite: true,
      clientRole: false,
      containerId: 'container-0001',
    },
    {
      id: 'role-0003',
      name: 'keycloak-role',
      description: 'use only in keycloak',
      composite: false,
      clientRole: true,
      containerId: 'container-xxxx',
    },
  ],
};

export const dummyInheritedRoles: APIRoles[] = [
  [
    {
      id: '3e0f2245-f947-4346-84d4-b141ec860baa',
      name: 'manage-users',
      description: '${role_manage-users}',
      composite: false,
      clientRole: true,
      containerId: 'b8027ef1-4e3e-49bd-bc35-4519bf8dfe9d',
    },
    {
      id: '4f53c5c4-9269-4dc8-abae-075cf61527cd',
      name: 'manage-realm',
      description: '${role_manage-realm}',
      composite: false,
      clientRole: true,
      containerId: 'b8027ef1-4e3e-49bd-bc35-4519bf8dfe9d',
    },
  ],
  [
    {
      id: '46e87d1d-51e0-4115-bb14-e3e91f701d09',
      name: 'cdim-manage-layout',
      description: 'Layout Design Management Authority',
      composite: false,
      clientRole: false,
      containerId: 'c3f648df-e65a-4458-a610-b757a276403b',
    },
    {
      id: 'd737ed2d-5671-432c-9972-280c3792967f',
      name: 'cdim-manage-user',
      description: 'User Management Authority',
      composite: true,
      clientRole: false,
      containerId: 'c3f648df-e65a-4458-a610-b757a276403b',
    },
    {
      id: 'd3052a19-8977-48c1-ba22-f83c1d969227',
      name: 'cdim-manage-resource',
      description: 'Resource Management Authority',
      composite: false,
      clientRole: false,
      containerId: 'c3f648df-e65a-4458-a610-b757a276403b',
    },
    {
      id: 'role-0002',
      name: 'cdim-operator',
      description: 'DC Operator',
      composite: true,
      clientRole: false,
      containerId: 'c3f648df-e65a-4458-a610-b757a276403b',
    },
  ],
  [
    {
      id: '56dbbc8e-fe0d-48cf-93d5-1b2eb4aaa1d2',
      name: 'cdim-view-resource',
      description: 'Resource Management Viewing Authority',
      composite: false,
      clientRole: false,
      containerId: 'c3f648df-e65a-4458-a610-b757a276403b',
    },
    {
      id: '052e88fc-2df3-4fdc-84b6-413be328fa34',
      name: 'cdim-view-layout',
      description: 'Layout Design Management Viewing Authority',
      composite: false,
      clientRole: false,
      containerId: 'c3f648df-e65a-4458-a610-b757a276403b',
    },
    {
      id: '3e38f2d7-37eb-4dfd-b153-0e2cf9d70672',
      name: 'cdim-view-user',
      description: 'User Management Viewing Authority',
      composite: true,
      clientRole: false,
      containerId: 'c3f648df-e65a-4458-a610-b757a276403b',
    },
  ],
  [
    {
      id: '8a5d1451-89d1-4174-9b6c-7377243512a1',
      name: 'view-realm',
      description: '${role_view-realm}',
      composite: false,
      clientRole: true,
      containerId: 'b8027ef1-4e3e-49bd-bc35-4519bf8dfe9d',
    },
    {
      id: '315f7a5c-2dd8-4e85-94f6-6efeddd1b9e5',
      name: 'view-users',
      description: '${role_view-users}',
      composite: true,
      clientRole: true,
      containerId: 'b8027ef1-4e3e-49bd-bc35-4519bf8dfe9d',
    },
  ],
];

export const assignedRoles: APIRoles = [
  {
    id: 'role-0001',
    name: 'cdim-administrator',
    description: 'DC Manager',
    composite: true,
    clientRole: false,
    containerId: 'container-0001',
  },
  {
    id: 'role-0002',
    name: 'cdim-operator',
    description: 'DC Operator',
    composite: true,
    clientRole: false,
    containerId: 'container-0001',
  },
];

export const filteredInheritedRoles: APIRoles = [
  {
    id: '46e87d1d-51e0-4115-bb14-e3e91f701d09',
    name: 'cdim-manage-layout',
    description: 'Layout Design Management Authority',
    composite: false,
    clientRole: false,
    containerId: 'c3f648df-e65a-4458-a610-b757a276403b',
  },
  {
    id: 'd737ed2d-5671-432c-9972-280c3792967f',
    name: 'cdim-manage-user',
    description: 'User Management Authority',
    composite: true,
    clientRole: false,
    containerId: 'c3f648df-e65a-4458-a610-b757a276403b',
  },
  {
    id: 'd3052a19-8977-48c1-ba22-f83c1d969227',
    name: 'cdim-manage-resource',
    description: 'Resource Management Authority',
    composite: false,
    clientRole: false,
    containerId: 'c3f648df-e65a-4458-a610-b757a276403b',
  },
  {
    id: '56dbbc8e-fe0d-48cf-93d5-1b2eb4aaa1d2',
    name: 'cdim-view-resource',
    description: 'Resource Management Viewing Authority',
    composite: false,
    clientRole: false,
    containerId: 'c3f648df-e65a-4458-a610-b757a276403b',
  },
  {
    id: '052e88fc-2df3-4fdc-84b6-413be328fa34',
    name: 'cdim-view-layout',
    description: 'Layout Design Management Viewing Authority',
    composite: false,
    clientRole: false,
    containerId: 'c3f648df-e65a-4458-a610-b757a276403b',
  },
  {
    id: '3e38f2d7-37eb-4dfd-b153-0e2cf9d70672',
    name: 'cdim-view-user',
    description: 'User Management Viewing Authority',
    composite: true,
    clientRole: false,
    containerId: 'c3f648df-e65a-4458-a610-b757a276403b',
  },
];
