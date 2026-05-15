/**
 * Reusable Swagger Examples
 */
export const SWAGGER_EXAMPLES = {
  USER_PROFILE: {
    id: '550e8400-e29b-41d4-a716-446655440000',
    email: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
    phoneNumber: '+1234567890',
    role: 'USER',
    isVerified: true,
    profileImage: 'https://example.com/profiles/john.jpg',
    createdAt: '2024-01-01T12:00:00Z',
    updatedAt: '2024-01-01T12:00:00Z',
  },
  RIDE_ESTIMATE: [
    {
      vehicleType: 'CAR',
      estimatedFare: 250.50,
      estimatedDistance: 12.5,
      estimatedDuration: 30,
    },
    {
      vehicleType: 'BIKE',
      estimatedFare: 80.00,
      estimatedDistance: 12.5,
      estimatedDuration: 20,
    }
  ],
  ERROR_VALIDATION: {
    success: false,
    message: 'Validation failed',
    errors: [
      {
        path: 'body.email',
        message: 'Invalid email format',
      }
    ]
  }
};
