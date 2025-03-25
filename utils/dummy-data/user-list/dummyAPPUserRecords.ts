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

import { APPUser } from '@/types';

// dummy data
export const dummyAPPUserRecords: APPUser[] = [
  {
    id: '22c8b4ba-b154-45f7-98d9-a4fe198623a1',
    lastName: 'last',
    firstName: 'first01',
    username: 'user01',
    enabled: true,
    roles: ['cdim-administrator'],
  },
  {
    id: '22c8b4ba-b154-45f7-98d9-a4fe198623a2',
    lastName: 'Kikin',
    firstName: 'Taro',
    username: 'user02',
    enabled: false,
    roles: ['cdim-administrator', 'cdim-operator'],
  },
  {
    id: '22c8b4ba-b154-45f7-98d9-a4fe198623a3',
    lastName: 'last',
    firstName: 'first03',
    username: 'user03',
    enabled: true,
    roles: ['cdim-operator', 'cdim-custom-role'],
  },
  {
    id: '22c8b4ba-b154-45f7-98d9-a4fe198623a4',
    lastName: 'Kikin',
    firstName: 'Hanako',
    username: 'user04',
    enabled: true,
    roles: [],
  },
  {
    id: '22c8b4ba-b154-45f7-98d9-a4fe198623a5',
    lastName: 'last',
    firstName: 'first05',
    username: 'user05',
    enabled: true,
    roles: ['cdim-operator', 'cdim-custom-role'],
  },
  {
    id: '22c8b4ba-b154-45f7-98d9-a4fe198623a6',
    lastName: 'last',
    firstName: 'first06',
    username: 'user06',
    enabled: true,
    roles: ['cdim-operator'],
  },
  {
    id: '22c8b4ba-b154-45f7-98d9-a4fe198623a7',
    lastName: 'Kikin',
    firstName: 'Jiro',
    username: 'user07',
    enabled: true,
    roles: ['cdim-administrator', 'cdim-operator'],
  },
  {
    id: '22c8b4ba-b154-45f7-98d9-a4fe198623a8',
    lastName: 'last',
    firstName: 'first08',
    username: 'user08',
    enabled: true,
    roles: ['cdim-operator', 'cdim-custom-role'],
  },
  {
    id: '22c8b4ba-b154-45f7-98d9-a4fe198623a9',
    lastName: 'Kikin',
    firstName: 'Yoshiko',
    username: 'user09',
    enabled: true,
    roles: [],
  },
  {
    id: '22c8b4ba-b154-45f7-98d9-a4fe19862310',
    lastName: 'last',
    firstName: 'first10',
    username: 'user10',
    enabled: true,
    roles: ['cdim-operator', 'cdim-custom-role'],
  },
  {
    id: '22c8b4ba-b154-45f7-98d9-a4fe19862311',
    lastName: 'InfrastructureDynamic',
    firstName: 'Hanako',
    username: 'user11',
    enabled: true,
    roles: [],
  },
  {
    id: '22c8b4ba-b154-45f7-98d9-a4fe19862312',
    lastName: 'last',
    firstName: 'first12',
    username: 'user12',
    enabled: true,
    roles: ['cdim-custom-role'],
  },
];
