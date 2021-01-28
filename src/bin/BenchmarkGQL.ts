// src/Library/BenchmarkGQL.ts
import autocannon from 'autocannon';
import type { Options as ACOptions, Result as ACResult } from 'autocannon';

console.log('Running Benchmark GQL test');

interface Benchmark {
  name: string;

  runs?: number;

  query: string;
}

const helloWorldQuery = JSON.stringify({
  query: '{\n  helloWorld \n}',
});

const helloWorldBenchmark: Benchmark = {
  name: 'HelloWorldQuery',
  runs: 5,
  query: helloWorldQuery,
};

const pillsQuery = JSON.stringify({
  query: `query {
    pills {
     id
     
     name
     
     interval
     
     events {
       id
       
       date
       
       type
     }
   }
 }`,
});

const pillsBenchmark: Benchmark = {
  name: 'Pills',
  query: pillsQuery,
  runs: 5,
};

const runAC = (
  body: string,
  opts: Partial<ACOptions> = {},
): Promise<ACResult> =>
  new Promise((resolve, reject) => {
    autocannon(
      {
        ...opts,
        url: 'http://localhost:8080/graphql',
        method: 'POST',
        body,
        headers: {
          'content-type': 'application/json',
        },
      },
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      },
    );
  });

interface TestOptions extends ACOptions {
  runs?: number;
}

async function runTest(
  body: string,
  { runs = 1, ...opts }: Partial<TestOptions>,
): Promise<ACResult[]> {
  const emptyArray = new Array<number>(runs).fill(1);

  const results: ACResult[] = [];

  // eslint-disable-next-line no-empty-pattern
  for (const [] of Object.entries(emptyArray)) {
    const result = await runAC(body, opts);

    results.push(result);
  }

  return results;
}

interface ProcessedRun {
  rawOutputs: ACResult[];

  name: string;

  averageLatency: number;
}

const average = (array: number[]): number =>
  array.reduce((p, c) => p + c, 0) / array.length;

function processTestRuns(runs: ACResult[], name: string): ProcessedRun {
  const averageLatencyArr = runs.map(({ latency: { average } }) => average);

  return {
    name,
    averageLatency: average(averageLatencyArr),
    rawOutputs: runs,
  };
}

async function runBenchmark(
  benchmarks: Benchmark | Benchmark[],
): Promise<ProcessedRun[]> {
  const results: ProcessedRun[] = [];

  if (Array.isArray(benchmarks)) {
    for (const benchmark of benchmarks) {
      const output = await runTest(benchmark.query, { runs: benchmark.runs });

      results.push(processTestRuns(output, benchmark.name));
    }
  } else {
    const output = await runTest(benchmarks.query, { runs: benchmarks.runs });
    results.push(processTestRuns(output, benchmarks.name));
  }

  return results;
}

function logResults(benchmarkResults: ProcessedRun[]): void {
  for (const result of benchmarkResults) {
    console.log(`\nResult of ${result.name}`, result.averageLatency);
  }
}

console.log('Running Benchmarks for helloWorldQuery');

logResults(await runBenchmark([helloWorldBenchmark, pillsBenchmark]));
