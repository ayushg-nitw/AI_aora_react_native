import { Client, Account, ID, Avatars, Databases, Query, Storage } from 'react-native-appwrite';
import { 
  APPWRITE_ENDPOINT, 
  APPWRITE_PLATFORM, 
  APPWRITE_PROJECT_ID, 
  APPWRITE_DATABASE_ID, 
  APPWRITE_STORAGE_ID, 
  APPWRITE_USERS_COLLECTION_ID, 
  APPWRITE_VIDEOS_COLLECTION_ID 
} from '@env';

// Appwrite Configuration
export const config = {
  endpoint: APPWRITE_ENDPOINT,
  platform: APPWRITE_PLATFORM,
  projectId: APPWRITE_PROJECT_ID,
  databaseId: APPWRITE_DATABASE_ID,
  storageId: APPWRITE_STORAGE_ID,
  usersCollectionId: APPWRITE_USERS_COLLECTION_ID,
  videosCollectionId: APPWRITE_VIDEOS_COLLECTION_ID,
};

// Initialize Appwrite Client
const client = new Client();
client.setEndpoint(config.endpoint).setProject(config.projectId).setPlatform(config.platform);

const account = new Account(client);
const avatars = new Avatars(client);
const db = new Databases(client);
const storage = new Storage(client);

// Register User
export const createUser = async (email, password, username) => {
  try {
    const newAccount = await account.create(ID.unique(), email, password, username);
    if (!newAccount) throw new Error('Account creation failed');

    const avatarUrl = avatars.getInitials(username);
    await signIn(email, password);

    const newUser = await db.createDocument(config.databaseId, config.usersCollectionId, ID.unique(), {
      accountId: newAccount.$id,
      email,
      username,
      avatar: avatarUrl,
    });

    console.log(newUser);
    return newUser;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// Sign In User
export const signIn = async (email, password) => {
  try {
    return await account.createEmailPasswordSession(email, password);
  } catch (error) {
    console.error('Sign in failed:', error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get(); // Fetch logged-in user
    if (!currentAccount) return null; // Return null if no user is logged in

    const currentUser = await db.listDocuments(
      config.databaseId,
      config.usersCollectionId,
      [Query.equal('accountId', currentAccount.$id)]
    );

    return currentUser?.documents[0] || null; // Return user data if found, else return null
  } catch (error) {
    console.log('No logged-in user detected.');
    return null; // Return null instead of throwing an error
  }
};

// Fetch All Posts
export const getAllPosts = async () => {
  try {
    const allPosts = await db.listDocuments(config.databaseId, config.videosCollectionId, [
      Query.orderDesc('$createdAt'),
    ]);
    return allPosts.documents;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

// Fetch Latest 6 Posts
export const getLatestPosts = async () => {
  try {
    const latestPosts = await db.listDocuments(config.databaseId, config.videosCollectionId, [
      Query.orderDesc('$createdAt'),
      Query.limit(6),
    ]);
    return latestPosts.documents;
  } catch (error) {
    console.error('Error fetching latest posts:', error);
    throw error;
  }
};

// Search Posts by Title
export const searchPosts = async (query) => {
  try {
    const searchResults = await db.listDocuments(config.databaseId, config.videosCollectionId, [
      Query.search('title', query),
    ]);
    return searchResults.documents;
  } catch (error) {
    console.error('Error searching posts:', error);
    throw error;
  }
};

// Get User-Specific Posts
export const getUserPosts = async (userId) => {
  try {
    const userPosts = await db.listDocuments(config.databaseId, config.videosCollectionId, [
      Query.equal('creators', userId),
    ]);
    return userPosts.documents;
  } catch (error) {
    console.error('Error fetching user posts:', error);
    throw error;
  }
};

// Sign Out User
export const signOut = async () => {
  try {
    return await account.deleteSession('current');
  } catch (error) {
    console.error('Sign out failed:', error);
    throw error;
  }
};

// Get File Preview (Video or Image)
export const getFilePreview = async (fileId, type) => {
  try {
    let fileUrl;
    if (type === 'video') {
      fileUrl = storage.getFileView(config.storageId, fileId);
    } else if (type === 'image') {
      fileUrl = storage.getFilePreview(config.storageId, fileId, 2000, 2000, 'top', 100);
    } else {
      throw new Error('Invalid file type');
    }

    if (!fileUrl) throw new Error('File preview failed');
    return fileUrl;
  } catch (error) {
    console.error('Error getting file preview:', error);
    throw error;
  }
};

// Upload File
export const uploadFile = async (file, type) => {
  if (!file) return;

  const { mimeType, ...rest } = file;
  const asset = { type: mimeType, ...rest };

  try {
    const uploadedFile = await storage.createFile(config.storageId, ID.unique(), asset);
    return await getFilePreview(uploadedFile.$id, type);
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

// Create Video Post
export const createVideo = async (form) => {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, 'image'),
      uploadFile(form.video, 'video'),
    ]);

    return await db.createDocument(config.databaseId, config.videosCollectionId, ID.unique(), {
      title: form.title,
      thumbnail: thumbnailUrl,
      video: videoUrl,
      prompt: form.prompt,
      creators: form.userId,
    });
  } catch (error) {
    console.error('Error creating video:', error);
    throw error;
  }
};

// Update Document
export const updateDocument = async (documentId, data) => {
  try {
    return await db.updateDocument(config.databaseId, config.videosCollectionId, documentId, data);
  } catch (error) {
    console.error('Error updating document:', error);
    throw error;
  }
};
