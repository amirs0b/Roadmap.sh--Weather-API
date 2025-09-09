import swaggerJSDoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Weather API",
            version: "1.0.0",
            description: "API documentation for the Weather application",
        },
        servers: [
            {
                url: "http://localhost:5000",
            },
        ],
        paths: {
            "/api/auth/register": {
                post: {
                    summary: "Register a new user",
                    description: "Creates a new user account.",
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        username: {
                                            type: "string",
                                            example: "testuser",
                                        },
                                        password: {
                                            type: "string",
                                            example: "Password123!",
                                        },
                                    },
                                    required: ["username", "password"],
                                },
                            },
                        },
                    },
                    responses: {
                        "200": {
                            description: "User registered successfully",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: {
                                                type: "boolean",
                                                example: true,
                                            },
                                            message: {
                                                type: "string",
                                                example: "User registered successfully",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        "400": {
                            description:
                                "Bad Request - Missing fields or invalid password format",
                        },
                    },
                },
            },
            "/api/auth/": {
                post: {
                    summary: "User login",
                    description: "Authenticates a user and returns a JWT token.",
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        username: {
                                            type: "string",
                                            example: "testuser",
                                        },
                                        password: {
                                            type: "string",
                                            example: "Password123!",
                                        },
                                    },
                                    required: ["username", "password"],
                                },
                            },
                        },
                    },
                    responses: {
                        "200": {
                            description: "Login successful",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: {
                                                type: "boolean",
                                                example: true,
                                            },
                                            login: {
                                                type: "string",
                                                example: "Login successful",
                                            },
                                            data: {
                                                type: "object",
                                                properties: {
                                                    token: {
                                                        type: "string",
                                                        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                                                    },
                                                    user: {
                                                        type: "object",
                                                        properties: {
                                                            id: {
                                                                type: "string",
                                                                example: "60d0fe4f5311236168a109ca",
                                                            },
                                                            role: {
                                                                type: "string",
                                                                example: "user",
                                                            },
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        "400": {
                            description: "Bad Request - User not found or password incorrect",
                        },
                    },
                },
            },
            "/api/weather/current": {
                get: {
                    summary: "Get current weather",
                    description:
                        "Retrieves the current weather for a specified city. Requires user authentication.",
                    security: [{ bearerAuth: [] }],
                    parameters: [
                        {
                            name: "city",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string",
                                example: "London",
                            },
                        },
                        {
                            name: "country",
                            in: "query",
                            required: false,
                            schema: {
                                type: "string",
                                example: "UK",
                            },
                        },
                    ],
                    responses: {
                        "200": {
                            description: "Successful response from cache or database",
                        },
                        "201": {
                            description: "Successful response from external API",
                        },
                        "400": {
                            description: "Bad Request - City parameter is required",
                        },
                        "401": {
                            description: "Unauthorized - Invalid or missing token",
                        },
                    },
                },
            },
            "/api/weather/": {
                get: {
                    summary: "Get all weather data history",
                    description:
                        "Retrieves all historical weather data. Requires admin privileges.",
                    security: [{ bearerAuth: [] }],
                    responses: {
                        "200": {
                            description: "Successful response",
                        },
                        "401": {
                            description: "Unauthorized - Invalid or missing token",
                        },
                        "403": {
                            description: "Forbidden - User is not an admin",
                        },
                    },
                },
            },
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
    },
    apis: ["./Routes/*.js"],
};

const swaggerDocs = swaggerJSDoc(options);
export default swaggerDocs;