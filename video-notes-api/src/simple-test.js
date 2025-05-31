// simple-test.js
console.error('STDERR: Starting...');
console.log('STDOUT: Hello from stdout');
console.error('STDERR: Finished');

process.stdin.on('data', (data) => {
  console.error('STDERR: Received data:', data.toString());
  console.log('STDOUT: Echo -', data.toString().trim());
});