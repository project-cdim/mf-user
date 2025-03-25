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

import { HttpResponse, http } from 'msw';

import { dummyAPIUsers } from '@/utils/dummy-data/user-list/dummyAPIUsers';

export const handlers = [
  // handle for fetching user data
  http.get(`${process.env.NEXT_PUBLIC_URL_BE_USER_MANAGER}/groups/00000000-0000-0000-0000-000000000000/members`, () => {
    return HttpResponse.json(dummyAPIUsers, { status: 200 });
  }),
];
