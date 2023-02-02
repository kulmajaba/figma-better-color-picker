import { useCallback, useEffect, useRef, useState } from 'react';

import { WorkerStatus } from '../types';

interface Options {
  worker: string;
  terminateOnNewJob?: boolean;
  workerOptions?: WorkerOptions;
}

const useWebWorker = <MessageType, ReturnType>({
  worker: workerScript,
  workerOptions,
  terminateOnNewJob = false
}: Options) => {
  // The worker cannot be instantiated here,
  // otherwise a new worker is created on every render
  const worker = useRef<Worker>();

  const [status, setStatus] = useState<WorkerStatus>(WorkerStatus.Idle);

  const workerFactory = useCallback(() => new Worker(workerScript, workerOptions), [workerScript, workerOptions]);

  useEffect(() => {
    worker.current = workerFactory();
    return () => worker.current?.terminate();
  }, []);

  const handleMessage = useCallback(
    (e: MessageEvent<ReturnType>, resolve: (value: ReturnType | PromiseLike<ReturnType>) => void) => {
      if (e && e.data) {
        setStatus(WorkerStatus.Idle);
        resolve(e.data);
      }
    },
    []
  );

  const terminate = useCallback(() => {
    console.log('Terminate WebWorker');
    setStatus(WorkerStatus.Idle);
    worker.current?.terminate();
    worker.current = workerFactory();
  }, [worker.current]);

  const job = useCallback(
    (message: MessageType): Promise<ReturnType> => {
      return new Promise((resolve, reject) => {
        if (!terminateOnNewJob && status !== WorkerStatus.Idle) {
          console.error('The worker already has a job and terminateOnNewJob is false, new job not started');
          return;
        }

        if (terminateOnNewJob && status !== WorkerStatus.Idle) {
          terminate();
        }

        if (worker.current === undefined) {
          worker.current = workerFactory();
        }

        setStatus(WorkerStatus.Working);
        worker.current.onmessage = (e: MessageEvent<ReturnType>) => handleMessage(e, resolve);
        worker.current.onerror = (e) => {
          setStatus(WorkerStatus.Idle);
          reject(e);
        };
        worker.current.postMessage(message);
      });
    },
    [worker.current, status, terminateOnNewJob]
  );

  return { status, job, terminate };
};

export default useWebWorker;
