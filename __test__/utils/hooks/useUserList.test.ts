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

import { renderHook } from '@testing-library/react';
import useSWRInfinite from 'swr/infinite';

import { ASSIGNABLE_ROLES } from '@/shared-modules/constant';

import { dummyUsers, parsedUsers } from '@/utils/dummy-data/user-list/dummyAPIUsers';
import { useUserList } from '@/utils/hooks';

const mockMutate = jest.fn();

jest.mock('swr/infinite', () => ({
  __esModule: true,
  ...jest.requireActual('swr/infinite'),
  default: jest.fn(),
}));

// Mocking useLuigiClient will not cover the case when it's undefined
jest.mock('@luigi-project/client', () => ({
  getToken: jest.fn().mockReturnValue('testTokenString'),
  addInitListener: jest.fn().mockImplementation((callback) => {
    callback();
  }),
}));

describe('useUserList', () => {
  beforeEach(() => {
    // Execute before each test
    // @ts-ignore
    mockMutate.mockReset();
    // @ts-ignore
    useSWRInfinite.mockReset();
    // @ts-ignore
    useSWRInfinite.mockReturnValue({
      data: dummyUsers,
      isValidating: false,
      error: null,
      mutate: mockMutate,
    });
  });

  test('Can get the list of parsed users', () => {
    const { result } = renderHook(() => useUserList());

    expect(result.current.data).toEqual(parsedUsers);
    expect(result.current.errors).toHaveLength(1);
    result.current.errors.forEach((error) => expect(error).toBeNull());
    expect(result.current.isValidating).toBeFalsy();

    result.current.mutate();
    expect(mockMutate).toHaveBeenCalledTimes(1);
  });

  test('Can get the list of parsed users (when SWR returns default value)', () => {
    // @ts-ignore
    useSWRInfinite.mockReturnValue({
      data: undefined,
      isValidating: false,
      error: null,
      mutate: mockMutate,
    });
    const { result } = renderHook(() => useUserList());

    expect(result.current.data).toEqual([]);
    expect(result.current.errors).toHaveLength(1);
    result.current.errors.forEach((error) => expect(error).toBeNull());
    expect(result.current.isValidating).toBeFalsy();

    result.current.mutate();
    expect(mockMutate).toHaveBeenCalledTimes(1);
  });

  test('SWR error information is returned', () => {
    // @ts-ignore
    useSWRInfinite.mockReturnValue({
      data: dummyUsers,
      isValidating: false,
      error: { message: 'error1' },
      mutate: jest.fn(),
    });

    const { result } = renderHook(() => useUserList());

    expect(result.current.data).toEqual(parsedUsers);
    expect(result.current.errors).toHaveLength(1);
    expect(result.current.errors[0].message).toBe('error1');
    expect(result.current.isValidating).toBeFalsy();
  });

  test('Return of getKey is correct', () => {
    renderHook(() => useUserList());
    // @ts-ignore
    const getKeyFn = useSWRInfinite.mock.lastCall[0]; // The first argument of the last call
    const resultGetKey = getKeyFn(0);
    expect(resultGetKey).toContain(ASSIGNABLE_ROLES[0]);
    // When getKey returns null, it's the behavior after getting all data
    const resultGetKey2 = getKeyFn(ASSIGNABLE_ROLES.length + 1);
    expect(resultGetKey2).toBeNull();
  });
});
