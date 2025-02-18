
export const config ={
  endpoint:"https://cloud.appwrite.io/v1",
  platform:'com.ayush.aora',
  projectId:'679efe7200206043c24e',
  databaseId:'679f05aa0037740468f8',
  storageId:'679f0878002e723c3b3a',
  usersCollectionId:'679f0647002b3c57c0db',
  videosCollectionId:'679f0655003471053575'
}

import { Client, Account,ID, Avatars, Databases, Query,Storage } from 'react-native-appwrite';
// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(config.endpoint) // Your Appwrite Endpoint
    .setProject(config.projectId)
    .setPlatform(config.platform) // YOUR application ID
;

const account = new Account(client);
const avatars = new Avatars(client);
const db = new Databases(client);
const storage = new Storage(client);

// Register User
export const createUser = async (email, password, username) => {

  try{
       const newAccount = await account.create(
         ID.unique(),
         email,
         password,
         username
       );

       if(!newAccount) throw Error;
       const avatarUrl = avatars.getInitials(username);

       await signIn(email,password);

       const newUser = await db.createDocument(
        config.databaseId,
        config.usersCollectionId,
        ID.unique(),
        {
          accountId:newAccount.$id,
          email,
          username,
          avatar:avatarUrl
        });
        console.log(newUser);
        return newUser;
  }
  catch(error){
    console.log(error);
    throw new Error(error);
  }

}

export const signIn = async (email,password) =>{
    try{
        const session = await account.createEmailPasswordSession(email,password);
        return session;
    }
    catch(error){
      throw new Error(error);
    }
}

export const getCurrentUser = async()=>{
  try{
      const currentAccount = await account.get();

      if(!currentAccount) throw Error;
      
      const currentUser = await db.listDocuments(
        config.databaseId,
        config.usersCollectionId,
        [Query.equal('accountId',currentAccount.$id)]
      )
      if(!currentUser) throw Error;

      return currentUser;
  }
  catch(error){
    console.log(error);
    throw new Error(error);
  }
}

export const getAllPosts = async ()=>{
  try{
    const allposts= await db.listDocuments(
      config.databaseId,
      config.videosCollectionId,
      [Query.orderDesc('$createdAt')]
    )
    return allposts.documents;
  }
  catch(error){
    throw new Error(error);
  }
};

export const getLatestPosts = async ()=>{
  try{
    const allposts= await db.listDocuments(
      config.databaseId,
      config.videosCollectionId,
      [Query.orderDesc('$createdAt'),Query.limit(6)]
    );
    return allposts.documents;
  }
  catch(error){
    throw new Error(error);
  }
};

export const searchPosts = async (query)=>{
  try{
    const allposts= await db.listDocuments(
      config.databaseId,
      config.videosCollectionId,
      [Query.search('title',query)]
    );
    return allposts.documents;
  }
  catch(error){
    throw new Error(error);
  }
};

export const getUserPosts = async (userId) =>{
  try{
    const allposts= await db.listDocuments(
      config.databaseId,
      config.videosCollectionId,
      [Query.equal('creators',userId)]
    );
    return allposts.documents;
  }
  catch(error){
    throw new Error(error);
  }
}

export const signOut = async () =>{

  try{
     const session = await account.deleteSession('current');
     
     return session;
  }
  catch(error){
    throw new Error(error);
  }
}

export const getFilePreview = async (fileId, type)=>{
  let fileUrl;
  try {
    
    if(type === 'video'){
      fileUrl = storage.getFileView(config.storageId, fileId); //appwrite function
    }
    else if( type === 'image'){
       fileUrl = storage.getFilePreview(config.storageId,fileId,2000, 2000,'top',100);
    }
    else{
      throw new Error('Invaild file type');
    }

    if(!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
}

export const uploadFile = async (file, type )=>{
   if(!file) return;

   //how appwrite accept it i am doing that now;
   const {mimeType, ...rest} = file;
   const asset = {type: mimeType, ...rest};

   try {
       const uploadedFile = await storage.createFile(config.storageId,ID.unique(),asset);
       const fileUrl = await getFilePreview(uploadedFile.$id, type);
       return fileUrl;

   } catch (error) {
     throw new Error(error);
   }
} 
export const createVideo = async (form)=>{
  try{
     const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail,'image'),
      uploadFile(form.video,'video')
     ]);

     const newPost = await db.createDocument(
      config.databaseId,
      config.videosCollectionId,
      ID.unique(),
      {
        title: form.title,
        thumbnail: thumbnailUrl,
        video:videoUrl,
        prompt: form.prompt,
        creators: form.userId
      }
     );

     return newPost;

  }
  catch(error){
    throw new Error(error);
  }
}

export const updateDocument = async (documentId, data) => {
  try {
    return await db.updateDocument(config.databaseId, config.videosCollectionId, documentId, data);
  } catch (error) {
    console.error("Failed to update document:", error);
    throw error;
  }
};
