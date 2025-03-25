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

import { dummyAPPUserRecords } from '@/utils/dummy-data/user-list/dummyAPPUserRecords';
import { useUserFilter } from '@/utils/hooks/useUserFilter';

describe('useUserFilter custom hook', () => {
  test('correctly returns the initial value', () => {
    const view = renderHook(() => useUserFilter(dummyAPPUserRecords));
    expect(view.result.current.filteredRecords).toEqual(dummyAPPUserRecords);
    expect(view.result.current.query).toEqual({
      username: '',
      lastName: '',
      firstName: '',
      enabled: [],
      roles: [],
    });

    // No need to test the initial value of the setQuery function as it will be tested for its functionality

    expect(view.result.current.selectOptions).toEqual({
      // No enabled specified → display both
      enabled: [
        {
          label: 'Enabled',
          value: 'enabled',
        },
        {
          label: 'Disabled',
          value: 'disabled',
        },
      ],
      // No role specified → display all
      role: ['cdim-administrator', 'cdim-operator', 'cdim-custom-role'],
    });
  });

  test('setQuery.username() works correctly', async () => {
    const view = renderHook(() => useUserFilter(dummyAPPUserRecords));
    jest.useFakeTimers();
    const { username: setUsernameQuery } = view.result.current.setQuery;
    // ANCHOR "1"→4 items
    act(() => {
      setUsernameQuery('1');
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(view.result.current.query.username).toBe('1');
    expect(view.result.current.filteredRecords).toHaveLength(4); // user01, user10, user11, user12
    // ANCHOR "user0"→9 items
    act(() => {
      setUsernameQuery('user0');
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(view.result.current.query.username).toBe('user0');
    expect(view.result.current.filteredRecords).toHaveLength(9); // user01 ～ user09
    jest.useRealTimers();
  });
  test('setQuery.lastName() works correctly', async () => {
    const view = renderHook(() => useUserFilter(dummyAPPUserRecords));
    jest.useFakeTimers();
    const { lastName: setLastNameQuery } = view.result.current.setQuery;
    act(() => {
      setLastNameQuery('Kikin');
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(view.result.current.query.lastName).toBe('Kikin');
    expect(view.result.current.filteredRecords).toHaveLength(4);
    jest.useRealTimers();
  });
  test('setQuery.firstName() works correctly', async () => {
    const view = renderHook(() => useUserFilter(dummyAPPUserRecords));
    jest.useFakeTimers();
    const { firstName: setFirstNameQuery } = view.result.current.setQuery;
    act(() => {
      setFirstNameQuery('Hanako');
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(view.result.current.query.firstName).toBe('Hanako');
    expect(view.result.current.filteredRecords).toHaveLength(2);
    jest.useRealTimers();
  });
  test('Combination of setQuery.lastName() + setQuery.firstName() works correctly', async () => {
    const view = renderHook(() => useUserFilter(dummyAPPUserRecords));
    jest.useFakeTimers();
    const { lastName: setLastNameQuery, firstName: setFirstNameQuery } = view.result.current.setQuery;
    act(() => {
      setLastNameQuery('InfrastructureDynamic');
      setFirstNameQuery('Hanako');
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(view.result.current.query.lastName).toBe('InfrastructureDynamic');
    expect(view.result.current.query.firstName).toBe('Hanako');
    expect(view.result.current.filteredRecords).toHaveLength(1);
    jest.useRealTimers();
  });
  test('setQuery.enabled() works correctly', async () => {
    const view = renderHook(() => useUserFilter(dummyAPPUserRecords));
    jest.useFakeTimers();
    const { enabled: setEnabledQuery } = view.result.current.setQuery;
    // ANCHOR enabled
    act(() => {
      setEnabledQuery(['enabled']);
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(view.result.current.query.enabled).toEqual(['enabled']);
    expect(view.result.current.filteredRecords).toHaveLength(11);
    // ANCHOR disabled
    act(() => {
      setEnabledQuery(['disabled']);
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(view.result.current.query.enabled).toEqual(['disabled']);
    expect(view.result.current.filteredRecords).toHaveLength(1);
    // ANCHOR enabled + disabled
    act(() => {
      setEnabledQuery(['enabled', 'disabled']);
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(view.result.current.query.enabled).toEqual(['enabled', 'disabled']);
    expect(view.result.current.filteredRecords).toHaveLength(12);
    // ANCHOR (empty array)
    act(() => {
      setEnabledQuery([]);
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(view.result.current.query.enabled).toEqual([]);
    expect(view.result.current.filteredRecords).toHaveLength(12);
    jest.useRealTimers();
  });
  test('setQuery.roles() works correctly', async () => {
    const view = renderHook(() => useUserFilter(dummyAPPUserRecords));
    jest.useFakeTimers();
    const { roles: setRolesQuery } = view.result.current.setQuery;
    // ANCHOR Specify one cdim-administrator, 'cdim-operator', 'cdim-custom-role'],
    act(() => {
      setRolesQuery(['cdim-administrator']);
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(view.result.current.query.roles).toEqual(['cdim-administrator']);
    expect(view.result.current.filteredRecords).toHaveLength(3);

    // ANCHOR Specify two in combination cdim-operator, cdim-custom-role → OR search
    act(() => {
      setRolesQuery(['cdim-operator', 'cdim-custom-role']);
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(view.result.current.query.roles).toEqual(['cdim-operator', 'cdim-custom-role']);
    expect(view.result.current.filteredRecords).toHaveLength(8);

    // ANCHOR Specify all cdim-administrator, cdim-operator, cdim-custom-role → OR search
    act(() => {
      setRolesQuery(['cdim-administrator', 'cdim-operator', 'cdim-custom-role']);
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(view.result.current.query.roles).toEqual(['cdim-administrator', 'cdim-operator', 'cdim-custom-role']);
    expect(view.result.current.filteredRecords).toHaveLength(9); // Excludes those without roles

    // ANCHOR (empty array)
    act(() => {
      setRolesQuery([]);
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(view.result.current.query.roles).toEqual([]);
    expect(view.result.current.filteredRecords).toHaveLength(12);

    jest.useRealTimers();
  });
});
