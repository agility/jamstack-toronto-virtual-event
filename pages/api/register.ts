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

import { NextApiRequest, NextApiResponse } from 'next';
import { nanoid } from 'nanoid';
import { ConfUser } from '@lib/types';
import validator from 'validator';
import { SAMPLE_TICKET_NUMBER, COOKIE } from '@lib/constants';
import cookie from 'cookie';
import ms from 'ms';
//import redis, { emailToId } from '@lib/redis';
import { cosmosConfig, emailToId, generateRandomNumber } from '../../cosmos.config'
import { CosmosClient } from '@azure/cosmos'

type ErrorResponse = {
  error: {
    code: string;
    message: string;
  };
};

export default async function register(
  req: NextApiRequest,
  res: NextApiResponse<ConfUser | ErrorResponse>
) {
  if (req.method !== 'POST') {
    return res.status(501).json({
      error: {
        code: 'method_unknown',
        message: 'This endpoint only responds to POST'
      }
    });
  }

  const email: string = ((req.body.email as string) || '').trim().toLowerCase();
  if (!validator.isEmail(email)) {
    return res.status(400).json({
      error: {
        code: 'bad_email',
        message: 'Invalid email'
      }
    });
  }

  let id;
  let ticketNumber: number;
  let createdAt: number;
  let statusCode: number;
  let name: string | undefined = undefined;
  let username: string | undefined = undefined;
  if (cosmosConfig) {

    const { endpoint, key, databaseId, containerId } = cosmosConfig;

    const client = new CosmosClient({ endpoint: endpoint as string, key: key as string });

    const database = client.database(databaseId as string);
    const container = database.container(containerId as string);

    id = emailToId(email);
    //const existingTicketNumberString = await redis.hget(`id:${id}`, 'ticketNumber');
    let existingTicketNumber = null;
    let item = null;

    const querySpec = {
      query: `SELECT * from c where c.email = @email`,
      parameters: [{
        name: '@email',
        value: email
      }]
    }
    const { resources: items } = await container.items.query(querySpec).fetchAll();
    
    if(items.length > 0) {
      item = items[0];
      existingTicketNumber = item?.ticketNumber;
    }

    console.log(item);

    if (existingTicketNumber) {
      console.log(item);
      name = item.name;
      username = item.username;
      ticketNumber = item.ticketNumber;
      createdAt = parseInt(item.createdAt, 10);
      statusCode = 200;
    } else {
      ticketNumber = parseInt(generateRandomNumber())
      createdAt = Date.now();

      const newItem = {
        id,
        email,
        ticketNumber,
        createdAt
      }

      const { resource: createdItem } = await container.items.create(newItem);
      
      statusCode = 201;
    }
  } else {
    id = nanoid();
    ticketNumber = SAMPLE_TICKET_NUMBER;
    createdAt = Date.now();
    statusCode = 200;
  }

  // Save `key` in a httpOnly cookie
  res.setHeader(
    'Set-Cookie',
    cookie.serialize(COOKIE, id, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      path: '/api',
      expires: new Date(Date.now() + ms('7 days'))
    })
  );

  return res.status(statusCode).json({
    id,
    email,
    ticketNumber,
    createdAt,
    name,
    username
  });
}
