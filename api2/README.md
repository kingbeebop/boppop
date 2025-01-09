# Bop Pop GraphQL API Documentation

## Overview
The Bop Pop API uses GraphQL to provide flexible data access and manipulation. The GraphQL endpoint is available at `/graphql`.

## Getting Started

### GraphQL Endpoint
- Development: `http://localhost:8000/graphql`
- GraphiQL Interface: `http://localhost:8000/graphql`

### Authentication
Include the JWT token in the Authorization header:
```http
Authorization: Bearer <your_token>
```

## Query Examples

### Fetch an Artist
```graphql
query {
  artist(id: 1) {
    id
    username
    bio
    songs {
      id
      title
      url
    }
  }
}
```

### Fetch Multiple Songs
```graphql
query {
  songs {
    id
    title
    url
    artist {
      username
    }
    playlist {
      theme
    }
  }
}
```

### Create a New Song
```graphql
mutation {
  createSong(input: {
    title: "My New Song"
    url: "https://soundcloud.com/..."
    artistId: 1
    playlistId: 1
  }) {
    id
    title
    url
  }
}
```

### Update a Playlist
```graphql
mutation {
  updatePlaylist(id: 1, input: {
    theme: "New Theme"
    active: true
    contest: false
  }) {
    id
    theme
    active
  }
}
```

### Submit a Vote
```graphql
mutation {
  createVote(input: {
    songId: 1
    artistId: 2
    playlistId: 1
  }) {
    id
    createdAt
  }
}
```

## Advanced Query Examples

### Paginated and Filtered Artists
```graphql
query {
  artists(
    pagination: { page: 1, perPage: 10 }
    filter: { 
      search: "john",
      isActive: true
    }
    sort: { field: "username", order: ASC }
  ) {
    items {
      id
      username
      bio
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      totalPages
      totalItems
      currentPage
    }
  }
}
```

### Date Range Filtered Playlists
```graphql
query {
  playlists(
    filter: {
      dateRange: {
        startDate: "2024-01-01",
        endDate: "2024-12-31"
      }
      search: "jazz"
      active: true
    }
    sort: { field: "date", order: DESC }
  ) {
    items {
      id
      theme
      date
    }
    pageInfo {
      totalItems
    }
  }
}
```

### Real-time Subscriptions
```graphql
subscription {
  artistUpdates {
    artist {
      id
      username
    }
    action
  }
}

subscription {
  voteUpdates {
    vote {
      id
      songId
      artistId
    }
    action
  }
}
```

## Type Definitions

### Artist
```graphql
type Artist {
  id: ID!
  username: String!
  email: String!
  bio: String
  profilePic: String
  songs: [Song!]!
  votes: [Vote!]!
  reviews: [Review!]!
}
```

### Song
```graphql
type Song {
  id: ID!
  title: String!
  url: String!
  artist: Artist!
  playlist: Playlist!
  votes: [Vote!]!
  reviews: [Review!]!
}
```

### Playlist
```graphql
type Playlist {
  id: ID!
  number: Int!
  theme: String!
  date: Date!
  active: Boolean!
  contest: Boolean!
  winner: Song
  songs: [Song!]!
}
```

## Error Handling
GraphQL errors will be returned in the following format:
```json
{
  "errors": [
    {
      "message": "Error message here",
      "path": ["field", "path", "here"],
      "extensions": {
        "code": "ERROR_CODE"
      }
    }
  ]
}
```

## Best Practices
1. Use fragments for reusable field selections
2. Request only needed fields
3. Use aliases for multiple instances of same field
4. Implement proper error handling
5. Use variables for dynamic values

## Tools
- [GraphiQL](http://localhost:8000/graphql): Interactive in-browser GraphQL IDE
- [Apollo Client](https://www.apollographql.com/docs/react/): Recommended client for React applications
- [GraphQL Code Generator](https://www.graphql-code-generator.com/): Generate TypeScript types from your queries 