# Leviathan News

## Quick Start with Docker

The fastest way to run Leviathan News is using the pre-built Docker image:

```bash
# Pull the Docker image
docker pull saahir87/leviathan-news:latest

# Run the container
docker run -p 3000:3000 saahir87/leviathan-news:latest
```

Then access the application at http://localhost:3000

## Run Locally from Source

If you prefer to run the application from source:

1. Clone the repository

```bash
git clone https://github.com/saahirfoux/leviathan-news.git
cd leviathan-news
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Features

- News article display with a modern, dark UI
- Article filtering by category, source, author, and date
- Clean and responsive design
- Support for external article links

## Alternative Docker Setup

### Using Docker Compose

1. Make sure you have Docker and Docker Compose installed
2. Clone the repository and navigate to the project directory
3. Run the application with:

```bash
docker-compose up -d
```

4. Access the application at http://localhost:3000

### Building Your Own Docker Image

1. Clone the repository and navigate to the project directory
2. Build the Docker image:

```bash
docker build -t leviathan-news .
```

3. Run the Docker container:

```bash
docker run -p 3000:3000 leviathan-news
```

## Contact

If you have any questions or would like to discuss this project, please feel free to contact me on LinkedIn:
[Saahir Foux](https://www.linkedin.com/in/saahir-foux-4456b227/)
