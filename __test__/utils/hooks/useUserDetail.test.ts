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
import useSWRImmutable from 'swr/immutable';
import useSWRInfinite from 'swr/infinite';

import { APIUser } from '@/types';

import {
  assignedRoles,
  dummyAttachedRoles,
  dummyInheritedRoles,
  filteredInheritedRoles,
} from '@/utils/dummy-data/user-detail/dummyRoles';
import { useUserDetail } from '@/utils/hooks';

// Dummy data
const dummyUser: APIUser = {
  id: 'user-test001',
  username: 'test001',
  firstName: 'firstName-test001',
  lastName: 'lastName-test001',
  emailVerified: false,
  createdTimestamp: 1706060023219,
  enabled: false,
  totp: false,
  email: 'dummy@test.com',
  disableableCredentialTypes: [],
  requiredActions: ['UPDATE_PASSWORD'],
  notBefore: 0,
};

const getDummyData = (url: string) => {
  // User assigned roles
  if (url.endsWith('role-mappings')) return dummyAttachedRoles;
  // User information
  return dummyUser;
};

const mockMutate = jest.fn();

jest.mock('swr/immutable', () => ({
  __esModule: true,
  ...jest.requireActual('swr/immutable'),
  default: jest.fn(),
}));

jest.mock('swr/infinite', () => ({
  __esModule: true,
  ...jest.requireActual('swr/infinite'),
  default: jest.fn(),
}));

describe('useUserDetail', () => {
  beforeEach(() => {
    // @ts-ignore
    mockMutate.mockReset();
    // @ts-ignore
    useSWRInfinite.mockReset();
    // @ts-ignore
    useSWRImmutable.mockReset();
    // @ts-ignore
    useSWRInfinite.mockImplementation((key: string) => ({
      data: key ? dummyInheritedRoles : undefined,
      isValidating: false,
      error: null,
      mutate: mockMutate,
      setSize: jest.fn(),
    }));
    // @ts-ignore
    useSWRImmutable.mockImplementation((key: string) => ({
      data: key ? getDummyData(key) : undefined,
      error: null,
      isValidating: false,
      mutate: mockMutate,
    }));
  });

  test('Can get user information and parsed role information', () => {
    const { result } = renderHook(() => useUserDetail('test-id'));
    expect(result.current.userData).toEqual(dummyUser);
    expect(result.current.assignedRoles).toEqual(assignedRoles);
    expect(result.current.inheritedRoles).toEqual(filteredInheritedRoles);
    expect(result.current.errors).toHaveLength(3);
    result.current.errors.forEach((error) => expect(error).toBeNull());
    expect(result.current.userValidating).toBeFalsy();
    expect(result.current.rolesValidating).toBeFalsy();

    result.current.mutate();
    expect(mockMutate).toHaveBeenCalledTimes(3);
  });

  test('Can get user information and parsed role information (when SWR returns default values)', () => {
    // @ts-ignore
    useSWRInfinite.mockReturnValue({
      data: undefined,
      isValidating: false,
      error: null,
      mutate: mockMutate,
      setSize: jest.fn(),
    });
    // @ts-ignore
    useSWRImmutable.mockReturnValue({
      data: undefined,
      error: null,
      isValidating: false,
      mutate: mockMutate,
    });

    const { result } = renderHook(() => useUserDetail('test-id'));

    expect(result.current.userData).toBeUndefined();
    expect(result.current.assignedRoles).toEqual([]);
    expect(result.current.inheritedRoles).toEqual([]);
    expect(result.current.errors).toHaveLength(3);
    result.current.errors.forEach((error) => expect(error).toBeNull());
    expect(result.current.userValidating).toBeFalsy();
    expect(result.current.rolesValidating).toBeFalsy();

    result.current.mutate();
    expect(mockMutate).toHaveBeenCalledTimes(3);
  });

  test('SWR error information is returned', () => {
    // @ts-ignore
    useSWRInfinite.mockReturnValue({
      data: undefined,
      isValidating: false,
      error: { message: 'error1' },
      mutate: mockMutate,
      setSize: jest.fn(),
    });
    // @ts-ignore
    useSWRImmutable.mockReset();
    // @ts-ignore
    useSWRImmutable.mockImplementation(() => ({
      data: undefined,
      error: { message: 'error2' },
      isValidating: false,
      mutate: mockMutate,
    }));

    const { result } = renderHook(() => useUserDetail('test-id'));

    expect(result.current.errors).toHaveLength(3);
    expect(result.current.errors[0].message).toBe('error2');
    expect(result.current.errors[1].message).toBe('error2');
    expect(result.current.errors[2].message).toBe('error1');
    expect(result.current.userValidating).toBeFalsy();
    expect(result.current.rolesValidating).toBeFalsy();
  });

  test('Return of getKey is correct', () => {
    renderHook(() => useUserDetail('test-id'));
    // @ts-ignore
    const getKeyFn = useSWRInfinite.mock.lastCall[0]; // The first argument of the last call
    const resultGetKey = getKeyFn(0);
    expect(resultGetKey).toContain('/composites');
    // If the dummy data changes, change the number appropriately
    const numberOfCompositeRoles = 4;
    const resultGetKey2 = getKeyFn(numberOfCompositeRoles + 1);
    expect(resultGetKey2).toBeNull();
  });
});
