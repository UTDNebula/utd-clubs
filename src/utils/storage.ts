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
