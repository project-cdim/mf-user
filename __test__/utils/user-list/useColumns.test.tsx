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

import { ReactElement } from 'react';

import { MultiSelect } from '@mantine/core';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { render } from '@/shared-modules/__test__/test-utils';

import { APPUser } from '@/types';

import { dummyAPPUserRecords } from '@/utils/dummy-data/user-list/dummyAPPUserRecords';
import { UserFilter } from '@/utils/hooks/useUserFilter';
import { useColumns } from '@/utils/hooks/user-list/useColumns';

jest.mock('@/shared-modules/components/PageLink');
jest.mock('@mantine/core', () => ({
  __esModule: true,
  ...jest.requireActual('@mantine/core'),
  MultiSelect: jest.fn(),
}));
jest.mock('@/components/icons/EnableToIcon', () => ({
  EnableToIcon: ({ isEnabled }: { isEnabled: boolean }) => {
    if (isEnabled) return <>Enabled</>;
    else return <>Disabled</>;
  },
}));

describe('useColumns', () => {
  const mockUserFilter: UserFilter = {
    filteredRecords: dummyAPPUserRecords,
    query: {
      username: '123',
      lastName: 'TestLastName',
      firstName: 'TestFirstName',
      enabled: ['enabled'],
      roles: ['role1', 'role2'],
    },
    selectOptions: {
      enabled: [
        { value: 'enabled', label: 'Enabled' },
        { value: 'disabled', label: 'Disabled' },
      ],
      role: ['role1', 'role2', 'role3'],
    },
    setQuery: {
      username: jest.fn(),
      lastName: jest.fn(),
      firstName: jest.fn(),
      enabled: jest.fn(),
      roles: jest.fn(),
    },
  };
  const dummyAPPUser: APPUser = {
    id: '0000aaaa-aaaa-aaaa',
    username: 'user00',
    lastName: 'lastname',
    firstName: 'firstname',
    enabled: true,
    roles: ['role1', 'role2'],
  };
  const dummyAPPUser2: APPUser = {
    id: '0000aaaa-aaaa-aaaa',
    username: 'user00',
    lastName: 'lastname',
    firstName: 'firstname',
    enabled: false,
    roles: ['role1', 'role2'],
  };

  beforeEach(() => {
    // Execute before each test
    jest.clearAllMocks();
  });
  test('Returns column information of type DataTableColumn', () => {
    const columns = useColumns(mockUserFilter);

    expect(columns).toHaveLength(4);
    // ID column
    expect(columns[0].accessor).toBe('username');
    expect(columns[0].title).toBe('Username');
    expect(columns[0].sortable).toBeTruthy();
    expect(columns[0].filtering).toBeTruthy();

    // lastName column
    expect(columns[1].accessor).toBe('lastName');
    expect(columns[1].title).toBe('Last Name');
    expect(columns[1].sortable).toBeTruthy();
    expect(columns[1].filtering).toBeTruthy();

    // firstName column
    expect(columns[2].accessor).toBe('firstName');
    expect(columns[2].title).toBe('First Name');
    expect(columns[2].sortable).toBeTruthy();
    expect(columns[2].filtering).toBeTruthy();

    // roles column
    expect(columns[3].accessor).toBe('roles');
    expect(columns[3].title).toBe('Role');
    expect(columns[3].sortable).toBeTruthy();
    expect(columns[3].filtering).toBeTruthy();
  });

  test('Query is updated by username input', async () => {
    const columns = useColumns(mockUserFilter);
    const column = columns.find((column) => column.accessor === 'username');
    render(column?.filter as ReactElement);

    const usernameInput = screen.getByLabelText('Username');
    await userEvent.clear(usernameInput);
    await userEvent.type(usernameInput, 'A');
    expect(mockUserFilter.setQuery.username).toHaveBeenCalledTimes(2);

    // Click × button
    const xButton = screen.getAllByRole('button')[0];
    await userEvent.click(xButton);
    expect(mockUserFilter.setQuery.username).toHaveBeenCalledTimes(3);
  });

  test('Query is updated by Active Status MultiSelect input', () => {
    const columns = useColumns(mockUserFilter);
    const column = columns.find((column) => column.accessor === 'username');
    if (!column || column.filter === undefined) {
      throw new Error('undefined');
    }
    render(column?.filter as ReactElement);
    // @ts-ignore
    MultiSelect.mock.lastCall[0].onChange(['enabled']);
    expect(mockUserFilter.setQuery.enabled).toHaveBeenCalledTimes(1);
  });

  test('Query is updated by lastName input', async () => {
    const columns = useColumns(mockUserFilter);
    const column = columns.find((column) => column.accessor === 'lastName');
    render(column?.filter as ReactElement);

    const lastNameInput = screen.getByLabelText('Last Name');
    await userEvent.clear(lastNameInput);
    await userEvent.type(lastNameInput, 'A');
    expect(mockUserFilter.setQuery.lastName).toHaveBeenCalledTimes(2);

    // Click × button
    const xButton = screen.getByRole('button');
    await userEvent.click(xButton);
    expect(mockUserFilter.setQuery.lastName).toHaveBeenCalledTimes(3);
  });

  test('Query is updated by firstName input', async () => {
    const columns = useColumns(mockUserFilter);
    const column = columns.find((column) => column.accessor === 'firstName');
    render(column?.filter as ReactElement);

    const firstNameInput = screen.getByLabelText('First Name');
    await userEvent.clear(firstNameInput);
    await userEvent.type(firstNameInput, 'A');
    expect(mockUserFilter.setQuery.firstName).toHaveBeenCalledTimes(2);

    // Click × button
    const xButton = screen.getByRole('button');
    await userEvent.click(xButton);
    expect(mockUserFilter.setQuery.firstName).toHaveBeenCalledTimes(3);
  });

  test('Role is rendered', async () => {
    const columns = useColumns(mockUserFilter);
    const rolesColumn = columns.find((column) => column.accessor === 'roles');
    if (!rolesColumn || !rolesColumn.render) {
      throw new Error('undefined');
    }
    render(rolesColumn.render(dummyAPPUser, 0) as ReactElement);

    dummyAPPUser.roles.forEach((role) => {
      expect(screen.getByText(role)).toBeInTheDocument();
    });
  });

  test('Active Status is rendered', async () => {
    const columns = useColumns(mockUserFilter);
    const usernamesColumn = columns.find((column) => column.accessor === 'username');
    if (!usernamesColumn || !usernamesColumn.render) {
      throw new Error('undefined');
    }
    render(usernamesColumn.render(dummyAPPUser, 0) as ReactElement);
    expect(screen.getByText('Enabled')).toBeInTheDocument();
    render(usernamesColumn.render(dummyAPPUser2, 0) as ReactElement);
    expect(screen.getByText('Disabled')).toBeInTheDocument();
  });
});
