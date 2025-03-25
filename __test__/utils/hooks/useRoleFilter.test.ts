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

import { act, renderHook } from '@testing-library/react';

import { dummyAPIRoles } from '@/utils/dummy-data/user-detail/dummyAPIRoles';
import { useRoleFilter } from '@/utils/hooks/useRoleFilter';

describe('useRoleFilter custom hook', () => {
  test('Correctly returns the initial value', () => {
    const view = renderHook(() => useRoleFilter(dummyAPIRoles));
    expect(view.result.current.filteredRecords).toEqual(dummyAPIRoles);
    expect(view.result.current.query).toEqual({
      name: '',
      description: '',
    });

    // No need to test setQuery function as an initial value because it will be tested for its operation
    expect(view.result.current.selectOptions).toEqual({});
  });

  test('setQuery.name() works correctly', async () => {
    const view = renderHook(() => useRoleFilter(dummyAPIRoles));
    jest.useFakeTimers();
    const { name: setNameQuery } = view.result.current.setQuery;
    // ANCHOR "view-users-0[1-6]"→6 items
    act(() => {
      setNameQuery('view-users-0');
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(view.result.current.query.name).toBe('view-users-0');
    expect(view.result.current.filteredRecords).toHaveLength(6); // view-users-0[1-6]
    // ANCHOR "view-users-03"→1 item
    act(() => {
      setNameQuery('users-03');
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(view.result.current.query.name).toBe('users-03');
    expect(view.result.current.filteredRecords).toHaveLength(1);
    jest.useRealTimers();
  });
  test('setQuery.description() works correctly', async () => {
    const view = renderHook(() => useRoleFilter(dummyAPIRoles));
    jest.useFakeTimers();
    const { description: setDescriptionQuery } = view.result.current.setQuery;
    act(() => {
      setDescriptionQuery('role_view-realm');
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(view.result.current.query.description).toBe('role_view-realm');
    expect(view.result.current.filteredRecords).toHaveLength(6);
    jest.useRealTimers();
  });
});
