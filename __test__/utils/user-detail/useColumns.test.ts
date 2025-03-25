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

import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { render } from '@/shared-modules/__test__/test-utils';
import { PageLink } from '@/shared-modules/components';

import { RoleFilter } from '@/utils/hooks';
import { useColumns } from '@/utils/hooks/user-detail/useColumns';

jest.mock('@/shared-modules/components/PageLink');
const mockPageLink = jest.fn().mockReturnValue(null);

describe('useColumns', () => {
  const mockRoleFilter: RoleFilter = {
    filteredRecords: [],
    query: {
      name: 'test',
      description: 'Testdescription',
    },
    selectOptions: {},
    setQuery: {
      name: jest.fn(),
      description: jest.fn(),
    },
  };

  beforeEach(() => {
    // Execute before each test
    jest.clearAllMocks();
    // @ts-ignore
    PageLink.mockImplementation(mockPageLink);
  });
  test('Returns column information of type DataTableColumn', () => {
    const columns = useColumns(mockRoleFilter);

    expect(columns).toHaveLength(2);
    // ID column
    expect(columns[0].accessor).toBe('name');
    expect(columns[0].title).toBe('Permissions');
    expect(columns[0].sortable).toBeTruthy();
    expect(columns[0].filtering).toBeTruthy();

    // description column
    expect(columns[1].accessor).toBe('description');
    expect(columns[1].title).toBe('Description');
    expect(columns[1].sortable).toBeTruthy();
    expect(columns[1].filtering).toBeTruthy();
  });

  test('Query is updated by permission role input', async () => {
    const columns = useColumns(mockRoleFilter);
    const column = columns.find((column) => column.accessor === 'name');
    render(column?.filter as ReactElement);

    const nameInput = screen.getByLabelText('Permissions');
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'A');
    expect(mockRoleFilter.setQuery.name).toHaveBeenCalledTimes(2);

    // Click × button
    const xButton = screen.getAllByRole('button')[0];
    await userEvent.click(xButton);
    expect(mockRoleFilter.setQuery.name).toHaveBeenCalledTimes(3);
  });

  test('Query is updated by description input', async () => {
    const columns = useColumns(mockRoleFilter);
    const column = columns.find((column) => column.accessor === 'description');
    render(column?.filter as ReactElement);

    const descriptionInput = screen.getByLabelText('Description');
    await userEvent.clear(descriptionInput);
    await userEvent.type(descriptionInput, 'A');
    expect(mockRoleFilter.setQuery.description).toHaveBeenCalledTimes(2);

    // Click × button
    const xButton = screen.getByRole('button');
    await userEvent.click(xButton);
    expect(mockRoleFilter.setQuery.description).toHaveBeenCalledTimes(3);
  });
});
