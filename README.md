# Food Trucks

## Overview

This API allows users to find food trucks in San Francisco by searching for specific food truck names or food items. It extends the functionality of the SODA Consumer API by enabling users to search for food trucks within a specified radius, a feature not supported by the native API due to data type limitations.

The project addresses the gap in the SODA Consumer API, specifically its inability to perform within_box searches for food trucks because their location data is not stored as Point data types. By enhancing this functionality, the API aims to provide a more seamless and user-friendly experience.

## Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/en) latest
-   [Docker](https://www.docker.com/products/docker-desktop/) latest
-   [SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html) latest
-   AWS account and credentials config (for the deployment step)

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/mavisluan/food-trucks.git
    ```
2. Navigate to the project directory:
    ```bash
    cd food-trucks
    ```
3. Install dependencies:
    ```bash
    npm install
    ```
4. Build the application
    ```bash
    sam build
    ```
5. Start the application:

    ```bash
    npm run start
    ```

    Auto-rebuild and restart API server on file changes for local development

    ```bash
    npm run watch
    ```

### API Usage

-   Endpoint: `http://localhost:3000/food-trucks`
-   Method: `GET`
-   Query Parameters: (Optional)
-   foodItem (`String`): The name of the food to search for
    -   Example: foodItem=hot dogs
-   truckName (`String`): The name of the truck
    -   Example: truckName=Ting
-   latitude (`Float Number`): The latitude of the center point to search around.
    -   Example: latitude=37.7749
-   longitude (`Float Number`): The longitude of the center point to search around.
    -   Example: longitude=-122.4194
-   radius (`Number`): The radius (in meters) within which to search for food trucks.
    -   Example: radius=500
-   Response:
    -   Without `foodIte`m or `truckName` in the query: Returns all active, approved food trucks.
    -   With `foodItem` or `truckName` in the query: Filters the results based on the provided parameter(s). If both are provided, foodItem will be used to filter the results.
    -   `Location-based search`: Requires latitude, longitude, and radius. If any of these parameters are missing, returns results without location filtering.

### Deployment

1. Build the application
    ```bash
    sam build
    ```
2. Deploy to AWS
    ```bash
    sam deploy
    ```
    The sam deploy command creates a Cloudformation Stack and deploys your resources
    Use help command to find out more usages on deploy
    ```bash
    sam deploy -h
    ```

## Trade-offs & Design Decisions

The Food Trucks API is built using Node.js and the AWS SAM Framework, with core functionality provided by an AWS Lambda function exposed via a publicly accessible API endpoint. This design decision was driven by the need to deliver a functional service within a limited development time frame, aiming to minimize complexity and focus on a straightforward architecture.

### Design Decisions

Serverless Architecture: Leveraging AWS Lambda provides several benefits:

-   On-Demand Execution: The service runs only when requested, optimizing resource usage and cost.

-   Scalability: AWS Lambda automatically scales with the volume of incoming requests, handling high traffic without manual intervention.

-   Reduced Infrastructure Management: By avoiding the need for dedicated servers, Lambda simplifies deployment and maintenance tasks.

-   Public API Endpoint: Exposing the Lambda function via a public endpoint is ideal for simple use cases where ease of setup and lower costs are prioritized, and advanced features of API Gateway are not required.

### Trade-offs

-   Cold Start Latency: AWS Lambda functions experience cold starts, which can result in slower response times for the first request after a period of inactivity. This may impact user experience slightly, especially under low traffic conditions.

-   Lack of Caching: Using Lambda function URLs simplifies setup but does not inherently provide caching mechanisms. This could become a performance bottleneck if the API experiences high traffic, as each request involves a fresh execution of the function.

-   Limited Feature Set: The minimalistic approach, while efficient, may not support advanced features such as complex request routing or advanced security configurations without additional services or configurations.

-   Monitoring and Debugging: Although AWS Lambda provides built-in monitoring via CloudWatch, debugging serverless functions can be more challenging compared to traditional server-based architectures, as it may involve additional steps to access logs and trace issues.

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature-foo`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some foo'`)
5. Push to the branch (`git push origin feature-foo`)
6. Open a pull request
