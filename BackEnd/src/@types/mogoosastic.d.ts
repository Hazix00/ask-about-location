/* eslint-disable @typescript-eslint/no-explicit-any */

import { ApiResponse, Client, RequestParams } from '@elastic/elasticsearch';
import { BulkResponse, CountResponse, RefreshResponse, SearchResponse } from '@elastic/elasticsearch/api/types';
import { RequestBody } from '@elastic/elasticsearch/lib/Transport';
import { EventEmitter } from 'events';
import { Document, Model, PopulateOptions, QueryOptions, Schema } from 'mongoose';

declare interface FilterFn {
  (doc: Document): boolean;
}
declare interface TransformFn {
  (doc: Document): boolean;
}
declare interface CreateMappingCallbackFn {
  (err: any | null | undefined, inputMapping: any | null | undefined): void;
}
declare interface TruncateCallbackFn {
  (err: any | null | undefined): void;
}
declare interface SearchCallbackFn<T> {
  (err: null | undefined, resp: ApiResponse<SearchResponse<T>>): void;
  (err: any, resp: null | undefined): void;
}
declare interface CountCallbackFn {
  (err: null | undefined, resp: ApiResponse<CountResponse>): void;
  (err: any, resp: null | undefined): void;
}
declare interface FlushCallbackFn {
  (err: null | undefined, resp: ApiResponse<BulkResponse>): void;
  (err: any, resp: null | undefined): void;
}
declare interface RefreshCallbackFn {
  (err: null | undefined, resp: ApiResponse<RefreshResponse>): void;
  (err: any, resp: null | undefined): void;
}

declare interface MongoosasticOptions {
  index: string;
  type?: string;
  esClient?: Client;
  hosts?: string[];
  host?: string;
  port?: number;
  auth?: string;
  protocol?: 'http' | 'https';
  hydrate?: boolean;
  hydrateOptions?: QueryOptions;
  bulk?: {
    size: number,
    delay: number,
  };
  filter?: FilterFn;
  transform?: TransformFn;
  populate?: PopulateOptions[];
  indexAutomatically?: boolean;
  customProperties?: any;
  saveOnSynchronize?: boolean;
}

declare module 'mongoosastic' {
  const Mongoosastic: (schema: Schema, Options?: Partial<MongoosasticOptions>) => void;
  export = Mongoosastic;
}

declare module 'mongoose' {
  export function model<T extends Document>(name: string, schema?: Schema<T>, collection?: string, skipInit?: boolean): MongoosasticModel<T>;
  export interface MongoosasticModel<T extends Document> extends Model<T> {
    createMapping(cb: CreateMappingCallback);
    createMapping(settings: any, cb: CreateMappingCallback);
    getMapping(): { properties: Record };
    getCleanTree(): Record;
    esTruncate(options: any, cb: TruncateCallbackFn): Record;
    search(query: RequestParams.Search<RequestBody>, options: any, cb: SearchCallbackFn<T>): void;
    esSearch(query: any, options: any, cb: SearchCallbackFn<T>): void;
    esCount(query: any, cb: CountCallbackFn): void;
    flush(cb: FlushCallbackFn): void;
    refresh(cb: RefreshCallbackFn): void;
    synchronize(query: any, options?: any): EventEmitter;
    bulkError(): EventEmitter;
  }
}