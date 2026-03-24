/*
 * Copyright 2026 NEC Corporation.
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

import { getMSWMockConfig, isMSWEnabled } from '@/utils/mocks/config';

describe('getMSWMockConfig', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  test('returns all false when no env vars set', () => {
    delete process.env.NEXT_PUBLIC_MSW_MOCK_IDP;

    const cfg = getMSWMockConfig();
    Object.values(cfg).forEach((v) => expect(v).toBe(false));
  });

  test('parses true strings to booleans per-key', () => {
    process.env.NEXT_PUBLIC_MSW_MOCK_IDP = 'true';

    const cfg = getMSWMockConfig();
    expect(cfg.idp).toBe(true);
  });
});

describe('isMSWEnabled', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  test('returns true when NODE_ENV is development', () => {
    (process.env as any).NODE_ENV = 'development';
    expect(isMSWEnabled()).toBe(true);
  });

  test('returns true when NEXT_PUBLIC_USE_MSW is "true"', () => {
    (process.env as any).NODE_ENV = 'production';
    process.env.NEXT_PUBLIC_USE_MSW = 'true';
    expect(isMSWEnabled()).toBe(true);
  });

  test('returns false otherwise', () => {
    (process.env as any).NODE_ENV = 'production';
    delete process.env.NEXT_PUBLIC_USE_MSW;
    expect(isMSWEnabled()).toBe(false);
  });
});
