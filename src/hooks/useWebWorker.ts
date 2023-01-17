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
  const workerFactory = useCallback(() => new Worker(workerScript, workerOptions), [workerScript, workerOptions]);
  const worker = useRef(workerFactory());

  const [status, setStatus] = useState<WorkerStatus>(WorkerStatus.Idle);

  useEffect(() => {
    return () => worker.current.terminate();
  }, []);

  const handleMessage = useCallback(
    (e: MessageEvent<ReturnType>, resolve: (value: ReturnType | PromiseLike<ReturnType>) => void) => {
      if (e && e.data) {
        setStatus(WorkerStatus.Idle);
        console.log('WebWorker data received');
        console.log(e.data);
        resolve(e.data);
      }
    },
    []
  );

  const terminate = useCallback(() => {
    console.log('Terminate WebWorker');
    setStatus(WorkerStatus.Idle);
    worker.current.terminate();
    worker.current = workerFactory();
  }, [worker.current]);

  const job = useCallback(
    (message: MessageType): Promise<ReturnType> => {
      return new Promise((resolve, reject) => {
        console.log(status);
        if (!terminateOnNewJob && status !== WorkerStatus.Idle) {
          console.error('The worker already has a job and terminateOnNewJob is false, new job not started');
          return;
        }

        if (terminateOnNewJob && status !== WorkerStatus.Idle) {
          terminate();
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
