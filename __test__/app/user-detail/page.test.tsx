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

import React from 'react';

import { act, screen } from '@testing-library/react';
import { DataTable } from 'mantine-datatable';
import { SWRConfig } from 'swr';

import { render } from '@/shared-modules/__test__/test-utils';
import { MessageBox, PageHeader } from '@/shared-modules/components';
import { useQuery } from '@/shared-modules/utils/hooks';

import UserDetail from '@/app/[lng]/user-detail/page';
import { dummyAPIUsers } from '@/utils/dummy-data/user-list/dummyAPIUsers';
import { useUserDetail } from '@/utils/hooks';

const dummySettingRoles = [
  { name: 'cdim-administrator', description: 'Admin' },
  { name: 'cdim-custom', description: 'Custom' },
];

const dummyInheritedRoles = [
  { name: 'cdim-view-user', description: 'to be able to view users' },
  { name: 'cdim-manage-user', description: 'to be able to manage users' },
  { name: 'cdim-view-custom', description: 'to be able to view custom' },
  { name: 'cdim-manage-custom', description: 'to be able to manage custom' },
];

jest.mock('mantine-datatable');
jest.mock('swr', () => ({
  ...jest.requireActual('swr'),
  SWRConfig: jest.fn(),
}));
jest.mock('@/shared-modules/components', () => ({
  ...jest.requireActual('@/shared-modules/components'),
  PageHeader: jest.fn(),
  MessageBox: jest.fn(),
}));
jest.mock('@/shared-modules/utils/hooks', () => ({
  __esModule: true,
  ...jest.requireActual('@/shared-modules/utils/hooks'),
  useQuery: jest.fn(),
}));

jest.mock('@/utils/hooks', () => ({
  __esModule: true,
  ...jest.requireActual('@/utils/hooks'),
  useUserDetail: jest.fn(),
}));

describe('User Detail', () => {
  beforeEach(() => {
    // Execute before each test
    jest.clearAllMocks();
    // @ts-ignore
    useUserDetail.mockReturnValue({
      userData: dummyAPIUsers[0],
      assignedRoles: dummySettingRoles,
      inheritedRoles: dummyInheritedRoles,
      errors: [undefined, undefined, undefined, undefined],
      userValidating: false,
      rolesValidating: false,
      mutate: () => void {},
    });
    // @ts-ignore
    useQuery.mockReturnValue({ id: dummyAPIUsers[0].id });
    // @ts-ignore
    SWRConfig.mockImplementation(({ children }) => <div data-testid='swr-config'>{children}</div>);
  });

  test('SWRConfig is processed correctly', async () => {
    jest.useFakeTimers();
    const mockRevalidate = jest.fn();
    render(<UserDetail />);
    // @ts-ignore
    const givenProps = SWRConfig.mock.lastCall[0].value;
    const error404 = { response: { status: 404 } };
    givenProps.onErrorRetry(error404, null, null, mockRevalidate, { retryCount: 1 });
    expect(mockRevalidate).toHaveBeenCalledTimes(0);
    const status200 = { response: { status: 200 } };
    givenProps.onErrorRetry(status200, null, null, mockRevalidate, { retryCount: 11 });
    expect(mockRevalidate).toHaveBeenCalledTimes(0);
    givenProps.onErrorRetry(status200, null, null, mockRevalidate, { retryCount: 0 });
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(mockRevalidate).toHaveBeenCalledTimes(1);
    jest.useRealTimers();
  });

  test('Correct title and breadcrumb list are passed to PageHeader', () => {
    render(<UserDetail />);
    // @ts-ignore
    const givenProps = PageHeader.mock.lastCall[0]; // The first argument of the last call
    expect(givenProps.pageTitle).toBe('User Details');
    expect(givenProps.items).toEqual([
      { title: 'User Management' },
      { title: 'Users', href: '/cdim/user-list' },
      { title: `User Details <${dummyAPIUsers[0].id}>` },
    ]);
  });

  test('Correct title and breadcrumb list are passed to PageHeader (ID is not in the query)', () => {
    // @ts-ignore
    useQuery.mockReturnValue({ id: undefined });
    render(<UserDetail />);
    // @ts-ignore
    const givenProps = PageHeader.mock.lastCall[0]; // The first argument of the last call
    expect(givenProps.pageTitle).toBe('User Details');
    expect(givenProps.items).toEqual([
      { title: 'User Management' },
      { title: 'Users', href: '/cdim/user-list' },
      { title: `User Details <undefined>` },
    ]);
  });

  test('The link to open the management console is displayed', () => {
    render(<UserDetail />);
    // If there is time, test if the element can be clicked
    const link = screen.getByText('Management Console');
    expect(link).toBeInTheDocument();
  });

  test('The username card is displayed', () => {
    render(<UserDetail />);
    const username = screen.getByText('Username').nextSibling;
    expect(username).toHaveTextContent(dummyAPIUsers[0].username);
  });

  test('User information is not displayed when user data cannot be obtained', () => {
    // @ts-ignore
    useUserDetail.mockReturnValue({
      userData: undefined,
      assignedRoles: [],
      inheritedRoles: [],
      errors: [undefined, undefined, undefined, undefined],
      userValidating: false,
      rolesValidating: false,
      mutate: () => void {},
    });
    render(<UserDetail />);
    const username = screen.getByText('Username').nextSibling;
    expect(username).not.toHaveTextContent(dummyAPIUsers[0].username);
  });

  test('Summary data table is displayed (Active)', () => {
    render(<UserDetail />);

    const id = screen.getByText('ID').nextSibling;
    expect(id).toHaveTextContent(dummyAPIUsers[0].id);
    const lastName = screen.getByText('Last Name').nextSibling;
    expect(lastName).toHaveTextContent(dummyAPIUsers[0].lastName || '');
    const firstName = screen.getByText('First Name').nextSibling;
    expect(firstName).toHaveTextContent(dummyAPIUsers[0].firstName || '');
    const email = screen.getByText('Email').nextSibling;
    expect(email).toHaveTextContent(dummyAPIUsers[0].email);
    const createdAt = screen.getByText('Created').nextSibling;
    expect(createdAt).toHaveTextContent(new Date(dummyAPIUsers[0].createdTimestamp).toLocaleString());
    const enabled = screen.getByText('Active Status').nextSibling;
    expect(enabled).toHaveTextContent(dummyAPIUsers[0].enabled ? 'Enabled' : 'Disabled');
  });

  test('Summary data table is displayed (Inactive)', () => {
    // @ts-ignore
    useUserDetail.mockReturnValue({
      userData: dummyAPIUsers[1],
      assignedRoles: dummySettingRoles,
      inheritedRoles: dummyInheritedRoles,
      errors: [undefined, undefined, undefined, undefined],
      userValidating: false,
      rolesValidating: false,
      mutate: () => void {},
    });
    render(<UserDetail />);

    const id = screen.getByText('ID').nextSibling;
    expect(id).toHaveTextContent(dummyAPIUsers[1].id);
    const lastName = screen.getByText('Last Name').nextSibling;
    expect(lastName).toHaveTextContent(dummyAPIUsers[1].lastName || '');
    const firstName = screen.getByText('First Name').nextSibling;
    expect(firstName).toHaveTextContent(dummyAPIUsers[1].firstName || '');
    const email = screen.getByText('Email').nextSibling;
    expect(email).toHaveTextContent(dummyAPIUsers[1].email);
    const createdAt = screen.getByText('Created').nextSibling;
    expect(createdAt).toHaveTextContent(new Date(dummyAPIUsers[1].createdTimestamp).toLocaleString());
    const enabled = screen.getByText('Active Status').nextSibling;
    expect(enabled).toHaveTextContent(dummyAPIUsers[1].enabled ? 'Enabled' : 'Disabled');
  });

  test('When an error is returned, two messages are displayed', async () => {
    const dummyErrors = [
      {
        message: 'The first error occurred',
        response: {
          data: {
            error: 'First error message',
          },
        },
      },
      {
        message: 'The second error occurred',
        response: {
          data: {
            error: 'Second error message',
          },
        },
      },
      // undefined,
    ];
    // @ts-ignore
    useUserDetail.mockReturnValue({
      userData: dummyAPIUsers[0],
      assignedRoles: dummySettingRoles,
      inheritedRoles: dummyInheritedRoles,
      errors: dummyErrors,
      userValidating: false,
      rolesValidating: false,
      mutate: () => void {},
    });
    render(<UserDetail />);

    // MessageBox is called twice
    expect(MessageBox).toHaveBeenCalledTimes(2);
    // Each error content is passed to MessageBox
    // @ts-ignore
    MessageBox.mock.calls.forEach((item, index) => {
      expect(item[0].type).toBe('error');
      expect(item[0].title).toBe(dummyErrors[index].message);
      expect(item[0].message).toBe(dummyErrors[index].response.data.error);
    });
  });

  test('Only the title is displayed when there is no response data for the error', async () => {
    const dummyErrors = [
      {
        message: 'The first error occurred',
      },
    ];
    // @ts-ignore
    useUserDetail.mockReturnValue({
      userData: dummyAPIUsers[0],
      assignedRoles: dummySettingRoles,
      inheritedRoles: dummyInheritedRoles,
      errors: dummyErrors,
      userValidating: false,
      rolesValidating: false,
      mutate: () => void {},
    });
    render(<UserDetail />);

    // MessageBox is called once
    expect(MessageBox).toHaveBeenCalledTimes(1);
    // Each error content is passed to MessageBox
    // @ts-ignore
    MessageBox.mock.calls.forEach((item, index) => {
      expect(item[0].type).toBe('error');
      expect(item[0].title).toBe(dummyErrors[index].message);
      expect(item[0].message).toBe('');
    });
  });

  test('When the number of records is zero, the height of the DataTable is fixed', () => {
    // @ts-ignore
    useUserDetail.mockReturnValue({
      userData: dummyAPIUsers[0],
      assignedRoles: dummySettingRoles,
      inheritedRoles: [],
      errors: [undefined, undefined, undefined, undefined],
      userValidating: false,
      rolesValidating: false,
      mutate: () => void {},
    });
    render(<UserDetail />);
    // @ts-ignore
    expect(DataTable.mock.lastCall[0].minHeight).toBe(230);
  });
});
