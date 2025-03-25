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

import { screen } from '@testing-library/react';
import { DataTable } from 'mantine-datatable';

import { render } from '@/shared-modules/__test__/test-utils';
import { MessageBox, PageHeader } from '@/shared-modules/components';

import UserList from '@/app/[lng]/user-list/page';
import { dummyAPPUserRecords } from '@/utils/dummy-data/user-list/dummyAPPUserRecords';
import { useUserList } from '@/utils/hooks';

jest.mock('mantine-datatable');
jest.mock('@/utils/hooks', () => ({
  ...jest.requireActual('@/utils/hooks'),
  useUserList: jest.fn(),
}));

jest.mock('@/shared-modules/components', () => ({
  ...jest.requireActual('@/shared-modules/components'),
  PageHeader: jest.fn(),
  MessageBox: jest.fn(),
}));

jest.mock('@/shared-modules/utils/hooks', () => ({
  ...jest.requireActual('@/shared-modules/utils/hooks'),
  useLoading: jest.fn(),
}));

describe('UserList', () => {
  beforeEach(() => {
    // Execute before each test
    jest.clearAllMocks();
    // @ts-ignore
    useUserList.mockImplementation(() => ({
      data: dummyAPPUserRecords,
      errors: [undefined, undefined],
      isValidating: false,
      mutate: jest.fn(),
    }));
  });

  test('The title and breadcrumb list are correctly passed to PageHeader', () => {
    render(<UserList />);
    // @ts-ignore
    const givenProps = PageHeader.mock.lastCall[0]; // The first argument of the last call
    expect(givenProps.pageTitle).toBe('Users');
    expect(givenProps.items).toEqual([{ title: 'User Management' }, { title: 'Users' }]);
  });

  test('The link to open the management console is displayed', () => {
    render(<UserList />);
    // If possible, test if the element can be clicked
    const link = screen.getByText('Management Console');
    expect(link).toBeInTheDocument();
  });

  test('The data is correctly passed to useUserTable', () => {
    render(<UserList />);
    // @ts-ignore
    const givenProps = DataTable.mock.lastCall[0]; // The first argument of the last call
    // table display only 10 records at first.
    expect(givenProps.records.length).toEqual(10);
    expect(dummyAPPUserRecords).toEqual(expect.arrayContaining(givenProps.records));
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
    useUserList.mockImplementation(() => ({
      data: dummyAPPUserRecords,
      errors: dummyErrors,
      isValidating: false,
      mutate: jest.fn(),
    }));
    render(<UserList />);

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
    useUserList.mockImplementation(() => ({
      data: dummyAPPUserRecords,
      errors: dummyErrors,
      isValidating: false,
      mutate: jest.fn(),
    }));
    render(<UserList />);

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
    useUserList.mockImplementation(() => ({
      data: [],
      errors: [undefined, undefined],
      isValidating: false,
      mutate: jest.fn(),
    }));
    render(<UserList />);
    // @ts-ignore
    expect(DataTable.mock.lastCall[0].minHeight).toBe(230);
  });
});
