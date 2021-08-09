import { MongoClient } from 'mongodb';
import { AsyncSetup } from './AsyncSetup';

const url = 'mongodb://localhost:27017';
export const Client = new MongoClient(url);

export const ClientSetup = new AsyncSetup().registerSetup(Client.connect()).executeAsyncSetup();
