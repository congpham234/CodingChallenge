# Use a Node.js 18 base image from AWS ECR for the builder stage
FROM public.ecr.aws/lambda/nodejs:18 as builder
WORKDIR /usr/app

# Copy package.json and package-lock.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of your application source code
COPY . ./
# Rebuild any native modules if necessary
RUN npm rebuild

# Run the TypeScript build command (make sure this generates source maps)
RUN npm run build

# Start a new stage from the Node.js 18 base image to keep the final image clean
FROM public.ecr.aws/lambda/nodejs:18
WORKDIR ${LAMBDA_TASK_ROOT}

# Copy the transpiled JavaScript files and source maps from the builder stage
COPY --from=builder /usr/app/dist/* ./

# Copy the /var/log directory from the builder stage
COPY /var/log /var/log

# Copy other necessary files such as OpenAPI specifications
COPY openapi-spec.json ./

# Set the CMD to your handler function
CMD ["index.handler"]
