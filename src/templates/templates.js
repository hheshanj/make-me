export const openSourceTemplate = `# Project Name

> A brief description of what this project does and who it's for

## Features

- ✨ Feature 1
- 🚀 Feature 2
- 💡 Feature 3

## Installation

\`\`\`bash
npm install project-name
\`\`\`

## Usage

\`\`\`javascript
import { something } from 'project-name';

// Example usage
something.doThing();
\`\`\`

## API Reference

### \`functionName(param)\`

Description of what the function does.

**Parameters:**
- \`param\` (Type): Description

**Returns:** Type - Description

## Contributing

Contributions are always welcome!

See \`contributing.md\` for ways to get started.

## License

[MIT](https://choosealicense.com/licenses/mit/)

## Authors

- [@username](https://github.com/username)
`;

export const apiDocsTemplate = `# API Documentation

## Overview

Brief description of the API and its purpose.

**Base URL:** \`https://api.example.com/v1\`

## Authentication

All API requests require authentication using an API key:

\`\`\`bash
curl -H "Authorization: Bearer YOUR_API_KEY" https://api.example.com/v1/endpoint
\`\`\`

## Endpoints

### GET /users

Retrieve a list of users.

**Query Parameters:**
- \`limit\` (number): Maximum number of results
- \`offset\` (number): Pagination offset

**Response:**
\`\`\`json
{
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    }
  ]
}
\`\`\`

### POST /users

Create a new user.

**Request Body:**
\`\`\`json
{
  "name": "Jane Doe",
  "email": "jane@example.com"
}
\`\`\`

**Response:**
\`\`\`json
{
  "id": 2,
  "name": "Jane Doe",
  "email": "jane@example.com",
  "created_at": "2024-01-01T00:00:00Z"
}
\`\`\`

## Error Codes

| Code | Description |
|------|-------------|
| 400  | Bad Request |
| 401  | Unauthorized |
| 404  | Not Found |
| 500  | Internal Server Error |

## Rate Limiting

API requests are limited to 1000 requests per hour per API key.
`;

export const profileTemplate = `# Hi there 👋 I'm [Your Name]

## 🚀 About Me
I'm a [role] passionate about [interests]...

## 🛠️ Skills

**Languages:**
\`\`\`
JavaScript, Python, TypeScript, Go
\`\`\`

**Frameworks & Tools:**
- React, Node.js, Express
- Docker, Kubernetes
- PostgreSQL, MongoDB

## 📊 GitHub Stats

![GitHub Stats](https://github-readme-stats.vercel.app/api?username=yourusername&show_icons=true&theme=radical)

## 🔥 Recent Projects

### [Project Name](https://github.com/username/project)
Brief description of the project and its impact.

### [Another Project](https://github.com/username/another)
Brief description of another cool project.

## 📫 How to reach me

- 💼 [LinkedIn](https://linkedin.com/in/yourprofile)
- 🐦 [Twitter](https://twitter.com/yourhandle)
- 📧 [Email](mailto:your.email@example.com)
- 🌐 [Website](https://yourwebsite.com)

## 💡 Fun Fact

Something interesting about you!
`;

export const templates = {
    'open-source': {
        name: 'Open Source Project',
        description: 'Standard structure for open source projects',
        content: openSourceTemplate
    },
    'api-docs': {
        name: 'API Documentation',
        description: 'Template for API reference documentation',
        content: apiDocsTemplate
    },
    'profile': {
        name: 'GitHub Profile',
        description: 'Personal GitHub profile README',
        content: profileTemplate
    }
};

export default templates;
