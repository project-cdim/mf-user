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

import { useTranslations } from 'next-intl';

import { IconWithInfo } from '@/shared-modules/components';

/**
 * Converts the enable status of a user to an icon component.
 *
 * @param isEnabled - The enable status of the user.
 * @returns The icon component based on the enable status.
 */
export const EnableToIcon = ({ isEnabled }: { isEnabled: boolean }) => {
  const t = useTranslations();

  if (isEnabled) return <IconWithInfo type='check' label={t('User is enabled')} />;
  else return <IconWithInfo type='ban' label={t('User is disabled')} />;
};
