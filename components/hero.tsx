/**
 * Copyright 2020 Vercel Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import cn from 'classnames';
import styleUtils from './utils.module.css';
import styles from './hero.module.css';
import {  SITE_NAME, SITE_DESCRIPTION, SITE_PRESENTS, DATE } from '@lib/constants';

export default function Hero() {
  return (
    <div className={styles.wrapper}>
      <h3
        className={cn(
          styleUtils.appear,
          styleUtils['appear-third'],
          styles.presents
        )}
      >
        {SITE_PRESENTS}
      </h3>
      <h1 className={cn(styleUtils.appear, styleUtils['appear-third'], styles.hero)}>
        {SITE_NAME}
      </h1>
      <h2
        className={cn(
          styleUtils.appear,
          styleUtils['appear-third'],
          styles.description
        )}
      >
        <span>jamstack</span>
        <span className={styles.spacer}>.</span>
        <span>wordpress</span>
        <span className={styles.spacer}>.</span>
        <span>api</span>
        <span className={styles.spacer}>.</span>
        <span>headless</span>
      </h2>
      <div className={cn(styleUtils.appear, styleUtils['appear-fourth'], styles.date)}>
        <p>{DATE}</p>
      </div>
    </div>
  );
}
