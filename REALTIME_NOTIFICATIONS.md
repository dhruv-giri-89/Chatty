# Real-Time Notification System with Socket.IO

## Overview
The real-time notification system has been implemented using Socket.IO to provide instant notifications for friend requests, friend request responses, and friend removals. The system also includes count badges in the navbar to show pending friend requests and unread notifications.

## Backend Implementation

### 1. Socket Events (`backend/src/lib/socket.js`)

#### Friend Request Events
- **`friendRequestSent`**: Emitted when a user sends a friend request
- **`friendRequestResponse`**: Emitted when a user accepts/declines a friend request
- **`friendRemoved`**: Emitted when a user removes a friend

#### Event Data Structure
```javascript
// friendRequestSent
{
  recipientId: "user_id",
  senderName: "Sender Name"
}

// friendRequestResponse
{
  recipientId: "user_id",
  responderName: "Responder Name",
  status: "accepted" | "declined"
}

// friendRemoved
{
  recipientId: "user_id",
  removerName: "Remover Name"
}
```

### 2. Updated Friendship Controller (`backend/src/controllers/friendShip.controller.js`)

#### Socket Event Emissions
- **`initiateFriendship`**: Emits `friendRequestSent` event
- **`updateFriendshipStatus`**: Emits `friendRequestResponse` event
- **`removeFriend`**: Emits `friendRemoved` event and creates notification

### 3. Count Endpoints

#### Notification Count
```
GET /api/notifications/count
Authorization: Bearer <token>
Response: { count: number }
```

#### Friend Request Count
```
GET /api/request-count
Authorization: Bearer <token>
Response: { count: number }
```

## Frontend Implementation

### 1. Socket Event Listeners (`frontend/src/store/useAuthStore.js`)

#### Real-Time Toast Notifications
- **`newFriendRequest`**: Shows success toast with friend request message
- **`friendRequestResponse`**: Shows success/error toast based on acceptance/decline
- **`friendRemoved`**: Shows error toast with removal message

#### Toast Styling
```javascript
// Friend Request
{
  duration: 5000,
  icon: "👋",
  style: { background: "#10b981", color: "white" }
}

// Friend Request Response (Accepted)
{
  duration: 5000,
  icon: "✅",
  style: { background: "#10b981", color: "white" }
}

// Friend Request Response (Declined)
{
  duration: 5000,
  icon: "❌",
  style: { background: "#ef4444", color: "white" }
}

// Friend Removed
{
  duration: 5000,
  icon: "👋",
  style: { background: "#f59e0b", color: "white" }
}
```

### 2. Updated Friend Store (`frontend/src/store/useFriendStore.js`)

#### New State Properties
```javascript
{
  notificationCount: 0,
  friendRequestCount: 0
}
```

#### New Functions
- **`getNotificationCount()`**: Fetches notification count from server
- **`getFriendRequestCount()`**: Fetches friend request count from server
- **`refreshInboxData()`**: Refreshes all inbox data and counts

### 3. Enhanced Navbar (`frontend/src/components/Navbar.jsx`)

#### Count Badges
- **Inbox Badge**: Shows friend request count (red background)
- **Notifications Badge**: Shows notification count (orange background)
- **Badge Logic**: Shows "99+" for counts over 99

#### Badge Styling
```css
.absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center
```

## Real-Time Flow

### 1. Friend Request Sent
1. User A sends friend request to User B
2. Backend creates friendship record
3. Backend emits `friendRequestSent` event
4. User B receives real-time toast notification
5. User B's inbox and counts are refreshed
6. User B sees updated friend request count in navbar

### 2. Friend Request Response
1. User B accepts/declines friend request
2. Backend updates friendship status
3. Backend emits `friendRequestResponse` event
4. User A receives real-time toast notification
5. User A's inbox and counts are refreshed
6. User A sees updated friend request count in navbar

### 3. Friend Removal
1. User A removes User B from friends list
2. Backend deletes friendship record
3. Backend creates notification record
4. Backend emits `friendRemoved` event
5. User B receives real-time toast notification
6. User B's inbox and counts are refreshed
7. User B sees updated notification count in navbar

## Socket Connection Management

### Connection Setup
```javascript
const newSocket = io(BASE_URL, {
  auth: { token: authUser.token },
  query: { userId: authUser._id },
});
```

### Event Cleanup
- Socket events are automatically cleaned up on disconnect
- Reconnection handled automatically by Socket.IO
- User mapping updated on connect/disconnect

## Security Features

- All socket events require authentication
- User can only receive notifications meant for them
- Proper error handling for socket events
- Rate limiting through existing API endpoints

## Performance Optimizations

- Counts are cached in frontend state
- Real-time updates only refresh necessary data
- Socket events are lightweight and efficient
- Badge counts update instantly without full page refresh

## Testing the System

### Test Scenarios
1. **Send Friend Request**: User A sends request to User B
   - User B should see toast notification
   - User B's friend request count should increase
   - User B's inbox should show new request

2. **Accept Friend Request**: User B accepts User A's request
   - User A should see success toast
   - Both users' friend lists should update
   - Counts should update accordingly

3. **Decline Friend Request**: User B declines User A's request
   - User A should see decline toast
   - Request should be removed from both users
   - Counts should update accordingly

4. **Remove Friend**: User A removes User B
   - User B should see removal toast
   - User B should get notification in inbox
   - User B's notification count should increase

## Future Enhancements

- Real-time typing indicators
- Message read receipts
- Group chat notifications
- Push notifications for mobile
- Email notifications as fallback
- Notification preferences and settings
- Sound notifications
- Desktop notifications 