// Define the API client prototype
function ApiClient() {
    this.baseUrl = 'http://localhost:8080/api/v1';
    this.token = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxIiwiY3VzdG9tQ2xhaW0iOiJjdXN0b20iLCJpc3MiOiJBYmNfZW5nbGlzaCIsImV4cCI6MTc0NjQxODc1NiwiaWF0IjoxNzQ2NDE1MTU2LCJqdGkiOiJlYmZkN2ZmOS1hYmRiLTQ3NTYtOWE5OS1jNWE2NGMxNzE2Y2IifQ.l8oWgSBLECkQFcMWObC6AMHuMIHubnHe72kKHS9iKtJ6ZElxShvusPfXrFpDWl2x_Wz4qX4wF7gVuL4S08Gbaw'
}
  
  // Add a method to the prototype for submitting a single answer
  ApiClient.prototype.submitAnswer = async function(answerId, content) {
    try {
      const startTime = performance.now();
      const response = await fetch(`${this.baseUrl}/answer/${answerId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`,
        },
        body: JSON.stringify({ content }),
      });
  
      const endTime = performance.now();
      const duration = endTime - startTime;
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      return { success: true, duration, data };
    } catch (error) {
      return { success: false, duration: 0, error: error.message };
    }
  };
  
  // Add a method to test performance with n requests
  ApiClient.prototype.testPerformance = async function(answerId, content, n) {
    console.log(`Starting performance test with ${n} requests...`);
    const results = [];
    let successCount = 0;
    let totalDuration = 0;
  
    // Send n requests sequentially
    for (let i = 0; i < n; i++) {
      console.log(`Sending request ${i + 1}...`);
      const result = await this.submitAnswer(answerId, content);
      results.push(result);
      if (result.success) {
        successCount++;
        totalDuration += result.duration;
      }
    }
  
    // Calculate statistics
    const averageDuration = successCount > 0 ? (totalDuration / successCount).toFixed(2) : 0;
    const failureCount = n - successCount;
  
    // Display results
    console.log('\nPerformance Test Results:');
    console.log(`Total Requests: ${n}`);
    console.log(`Successful Requests: ${successCount}`);
    console.log(`Failed Requests: ${failureCount}`);
    console.log(`Total Duration (successful requests): ${(totalDuration / 1000).toFixed(2)} seconds`);
    console.log(`Average Duration per successful request: ${averageDuration} ms`);
    console.log('\nDetailed Results:');
    results.forEach((result, index) => {
      if (result.success) {
        console.log(`Request ${index + 1}: Success, Duration: ${result.duration.toFixed(2)} ms`);
      } else {
        console.log(`Request ${index + 1}: Failed, Error: ${result.error}`);
      }
    });
  
    return { totalRequests: n, successCount, failureCount, totalDuration, averageDuration, results };
  };
  
  // Usage
  (async () => {
    // Create an instance of ApiClient
    const apiClient = new ApiClient();
  
    // Test the API with 5 requests for performance
    try {
      await apiClient.testPerformance(1, "He dont no were their going tomorow", 5);
    } catch (error) {
      console.error('Performance test failed:', error);
    }
  })();