# Notification System Implementation

## Overview
The notification system has been implemented to notify users when they are removed from someone's friends list. The system includes both backend and frontend components.

## Backend Implementation

### 1. Notification Model (`backend/src/models/notification.model.js`)
- **user1**: The user who triggered the notification (e.g., the user who removed a friend)
- **user2**: The user who receives the notification (e.g., the user who was removed)
- **status**: Either "unread" or "read"
- **timestamps**: Automatically tracks creation and update times

### 2. Notification Controller (`backend/src/controllers/notification.controller.js`)
- `getNotifications`: Fetches all unread notifications for the current user
- `markNotificationAsRead`: Marks a specific notification as read
- `markAllNotificationsAsRead`: Marks all notifications as read for the current user
- `createNotification`: Helper function to create notifications (used by other controllers)

### 3. Notification Routes (`backend/src/routes/notification.route.js`)
- `GET /api/notifications`: Get all unread notifications
- `PATCH /api/notifications/:id/read`: Mark a specific notification as read
- `PATCH /api/notifications/mark-all-read`: Mark all notifications as read

### 4. Updated Friendship Controller
- Modified `removeFriend` function to create a notification when a friend is removed
- The notification is created with user1 as the remover and user2 as the removed friend

## Frontend Implementation

### 1. Updated Friend Store (`frontend/src/store/useFriendStore.js`)
Added notification-related state and functions:
- `notifications`: Array of unread notifications
- `notificationsLoading`: Loading state for notifications
- `getNotifications()`: Fetches notifications from the server
- `markNotificationAsRead(notificationId)`: Marks a notification as read
- `markAllNotificationsAsRead()`: Marks all notifications as read

### 2. Updated Inbox Component (`frontend/src/Pages/InBox.jsx`)
- Added tabbed interface with "Friend Requests" and "Notifications" tabs
- Displays notifications with user information and "Mark as Read" button
- Includes "Mark All as Read" functionality
- Shows notification count badges on tabs

## How It Works

1. **Friend Removal**: When a user removes a friend using the "Remove Friend" option in the chat menu:
   - The friendship is deleted from the database
   - A notification is created with user1 as the remover and user2 as the removed friend
   - The notification status is set to "unread"

2. **Notification Display**: 
   - Notifications appear in the Inbox under the "Notifications" tab
   - Only unread notifications are displayed
   - Each notification shows the name of the user who removed them
   - Notifications include a timestamp

3. **Mark as Read**:
   - Individual notifications can be marked as read using the "Mark as Read" button
   - All notifications can be marked as read using the "Mark All as Read" button
   - Once marked as read, notifications disappear from the inbox

## API Endpoints

### Get Notifications
```
GET /api/notifications
Authorization: Bearer <token>
Response: { notifications: [...] }
```

### Mark Notification as Read
```
PATCH /api/notifications/:id/read
Authorization: Bearer <token>
Response: { message: "Notification marked as read.", notification: {...} }
```

### Mark All Notifications as Read
```
PATCH /api/notifications/mark-all-read
Authorization: Bearer <token>
Response: { message: "All notifications marked as read." }
```

## Database Schema

```javascript
{
  user1: ObjectId, // User who triggered the notification
  user2: ObjectId, // User who receives the notification
  status: String,  // "unread" or "read"
  createdAt: Date,
  updatedAt: Date
}
```

## Security Features

- Only the recipient (user2) can mark their own notifications as read
- Notifications are automatically populated with user information (excluding passwords)
- All endpoints require authentication
- Proper error handling and validation

## Future Enhancements

The notification system can be extended to support:
- Different types of notifications (friend requests, group invites, etc.)
- Real-time notifications using WebSocket
- Email notifications
- Push notifications for mobile apps
- Notification preferences and settings 