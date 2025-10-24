import { addMinutes } from 'date-fns';
import 'server-only';

type GetPostResponse = {
  bucket: string;
  name: string;
  content_type: string;
  size: number;
  content_encoding: '';
  md5: string;
  media_link: string;
  created: string;
  updated: string;
};

type DeleteResponse = 1;

type APIResponse<T> =
  | {
      message: 'success';
      status: number;
      data: T;
    }
  | {
      message: 'error';
      status: number;
      data: string;
    };
export async function callStorageAPI(
  method: 'GET',
  objectID: string,
): Promise<APIResponse<GetPostResponse>>;
export async function callStorageAPI(
  method: 'POST',
  objectID: string,
  body: Blob,
): Promise<APIResponse<GetPostResponse>>;
export async function callStorageAPI(
  method: 'DELETE',
  objectID: string,
): Promise<APIResponse<DeleteResponse>>;
export async function callStorageAPI<T>(
  method: 'GET' | 'POST' | 'DELETE',
  objectID: string,
  body?: Blob,
): Promise<APIResponse<T>> {
  const res = await fetch(
    `${process.env.NEBULA_API_URL}/storage/${process.env.NEBULA_API_STORAGE_BUCKET}/${objectID}`,
    {
      method,
      headers: {
        'x-api-key': process.env.NEBULA_API_KEY as string,
        'x-storage-key': process.env.NEBULA_API_STORAGE_KEY as string,
      },
      ...(body && { body }),
    },
  );

  const data = (await res.json()) as APIResponse<T>;

  return data;
}

export async function getUploadURL(objectID: string, type: string) {
  const res = await fetch(
    `${process.env.NEBULA_API_URL}/storage/${process.env.NEBULA_API_STORAGE_BUCKET}/${objectID}`,
    {
      method: 'PUT',
      headers: {
        'x-api-key': process.env.NEBULA_API_KEY as string,
        'x-storage-key': process.env.NEBULA_API_STORAGE_KEY as string,
      },
      body: JSON.stringify({
        expiration: addMinutes(Date.now(), 5),
        headers: [
          `Content-type:${type}`,
          `x-goog-content-length-range:0,${1000000}`,
        ],
        method: 'PUT',
      }),
    },
  );
  const data = (await res.json()) as APIResponse<string>;

  return data;
}
