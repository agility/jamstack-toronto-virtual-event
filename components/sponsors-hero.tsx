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
 import styles from './sponsors-hero.module.css';
 import { Sponsor } from '@lib/types';

 type Props = {
  sponsors?: Sponsor[];
};

 export default function SponsorsHero({sponsors}: Props) {
   return (
     <div className={cn(styles.sponsorsHero, {
        [styleUtils.appear]: true,
        [styleUtils['appear-fifth']]: true
     })}>
       <p>Sponsors:</p>

       <ul className={styles.sponsorsList}>
        {sponsors?.map(sponsor => (
          <SponsorItem key={sponsor.name} sponsor={sponsor} />
        ))}
       </ul>

       <p className={styles.sponsorOutreach}>Interested in <a href="https://cdn.aglty.io/lhmgzmfh/click_deploy_prospectus_pdf.pdf" target="_blank">sponsorship</a>?</p>
     </div>
   );
 }

function SponsorItem({ sponsor }: { sponsor: Sponsor }) {
  return(
    <li>
      <img src={sponsor.logo.url + `?w=300`} alt={sponsor.name} />
    </li>
  )
}