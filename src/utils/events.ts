import { LS, LSKeys } from '../ls';

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (e: 'event', v: string, data?: Record<string, string>) => void;
  }
}

type Payload = {
  broker: string;
  broker_next: string;
  type: 'report' | 'API' | 'add_one' | 'add_more' | 'None';
};

export const sendDataToGA = async (payload: Payload) => {
  try {
    const now = new Date();
    const date = `${now.getFullYear()}-${
      now.getMonth() + 1
    }-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

    await fetch(
      'https://script.google.com/macros/s/AKfycbxfP1lKFN5KJ9QIPa2Ym2Wl6NFRII7_t4K64pqRbxzHmc6xnFd7RQr6x4P2Lmbl90NNOg/exec',
      {
        redirect: 'follow',
        method: 'POST',
        body: JSON.stringify({ date, ...payload, vari: 'var3', id: LS.getItem(LSKeys.UserId, 0) }),
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
      },
    );
  } catch (error) {
    console.error('Error!', error);
  }
};

type PayloadFirstInfo = {
  broker: string;
};

export const sendDataToGAFirstInfo = async (payload: PayloadFirstInfo) => {
  try {
    const now = new Date();
    const date = `${now.getFullYear()}-${
      now.getMonth() + 1
    }-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

    await fetch(
      'https://script.google.com/macros/s/AKfycbzXyv0fGHF2EGIaZeyBWI4SqZGaCh42jLrEfKvZ4w28PA5xafK9aghPy7LWvseDu_8P/exec',
      {
        redirect: 'follow',
        method: 'POST',
        body: JSON.stringify({ date, ...payload, vari: 'var3', id: LS.getItem(LSKeys.UserId, 0) }),
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
      },
    );
  } catch (error) {
    console.error('Error!', error);
  }
};
