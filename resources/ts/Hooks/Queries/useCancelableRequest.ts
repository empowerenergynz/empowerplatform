import axios from 'axios';
import { useMemo } from 'react';

export default (url: string) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const source = useMemo(() => axios.CancelToken.source(), [url]);

  const http = useMemo(
    () =>
      axios.create({
        cancelToken: source.token,
        timeout: 10000,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [url]
  );

  return { http, cancel: source.cancel, isCancel: axios.isCancel };
};
