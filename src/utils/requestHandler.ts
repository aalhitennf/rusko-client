// TODO This whole thing is kinda awful or not, not sure

// Lib
import axios, { CancelTokenSource, Method } from 'axios';
// Utils
import { createJWT } from './helpers';
// Types
import Device from '../Components/Devices/Device';
import { encryptPayload, decryptPayload } from './aes';

const VALID_RESPONSE_TYPES = ['string', 'object'];

type RequestParams = {
  path: string;
  method: Method;
  headers?: { [key: string]: string };
  cancelToken?: CancelTokenSource;
  data?: string | FormData;
  device: Device;
};

type ResponseTypes = string | object;

export const requestHandler = async (
  params: RequestParams,
): Promise<ResponseTypes> => {
  params.headers ? {} : (params.headers = {});

  await appendJwtHeaders(params);
  await handleEncryption(params);

  const response = await axios({
    url: params.device?.url() + params.path,
    method: params.method,
    headers: params.headers,
    cancelToken: params.cancelToken?.token,
    data: params.data,
    timeout: 2000,
    validateStatus: () => true,
  });

  if (typeof response.data in VALID_RESPONSE_TYPES) {
    throw new Error('Invalid response type');
  }

  const body = response.data as string;

  if (response.status !== 200) {
    throw new Error(body);
  }

  return await handleDecryption(body, params.device);
};

const appendJwtHeaders = async (params: RequestParams): Promise<void> => {
  const jwt = await createJWT(params.device.password);

  if (!params.headers) {
    throw new Error('Failed to append Jwt headers: No headers');
  }

  params.headers.Authorization = `Bearer ${jwt}`;
};

const handleEncryption = async (params: RequestParams): Promise<void> => {
  params.data =
    params.data && typeof params.data === 'string'
      ? await encryptPayload(params.data, params.device.password)
      : params.data;
};

const handleDecryption = async (
  body: string,
  device: Device,
): Promise<string> => {
  return await decryptPayload(body, device.password);
};
